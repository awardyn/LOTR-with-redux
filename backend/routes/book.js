const express = require('express');
const { v4: uuidv4 } = require('uuid');
const app = express.Router();
const client = require('../config/pgClient');

app.get('/', async (req, res) => {
  const { sort, search } = req.query;
  const sortDirection = sort === '0' ? 'ASC' : 'DESC';
  const searchQuery = search !== undefined ? search.toLowerCase() : '';
  try {
    const response = await client.query(
      `SELECT * from book WHERE lower(name) LIKE '%${searchQuery}%' ORDER BY name ${sortDirection}`,
    );
    res.send({
      books: [...response.rows],
    });
  } catch (e) {
    console.error(e);
    res.sendStatus(400);
  }
});

app.get('/:id/chapters', async (req, res) => {
  let { id } = req.params;
  try {
    const book = await client.query(`SELECT * FROM book WHERE id = '${id}'`);
    const bookUniqueId = book.rows[0].unique_id;
    const response = await client.query(
      `SELECT * FROM chapter WHERE book = '${bookUniqueId}'`,
    );
    res.send({
      chapters: response.rows,
    });
  } catch (e) {
    console.error(e);
    res.sendStatus(400);
  }
});

app.get('/:id', async (req, res) => {
  let { id } = req.params;
  try {
    const response = await client.query(
      `SELECT * FROM book WHERE id = '${id}'`,
    );
    res.send({
      book: response.rows,
    });
  } catch (e) {
    console.error(e);
    res.sendStatus(400);
  }
});

app.post('/', async (req, res) => {
  const bookId = uuidv4();
  try {
    for await (const chapter of req.body.chapters) {
      client.query(
        `INSERT INTO chapter(chaptername, book) VALUES ('${chapter.chaptername}', '${bookId}')`,
      );
    }
    await client.query(
      `INSERT INTO book(unique_id, name) VALUES ('${bookId}', '${req.body.name}') RETURNING id`,
      function (err, result) {
        if (err) return res.send(err);
        const new_id = result.rows[0].id;
        return res.status(201).send({ id: new_id });
      },
    );
  } catch (e) {
    console.error(e);
    res.sendStatus(400);
  }
});

app.delete('/:id', async (req, res) => {
  let id = req.params.id;
  try {
    const response = await client.query(`DELETE FROM book WHERE id = ${id}`);
    res.sendStatus(200);
  } catch (e) {
    console.error(e);
    res.sendStatus(400);
  }
});

app.put('/:id', async (req, res) => {
  let id = req.params.id;
  let data = req.body;
  try {
    const response = await client.query(
      `UPDATE book SET name = '${data.name}' WHERE id = ${id} RETURNING unique_id`,
    );
    await client.query(
      `DELETE FROM chapter WHERE book = '${response.rows[0].unique_id}'`,
    );
    for await (const chapter of req.body.chapters) {
      client.query(
        `INSERT INTO chapter(chaptername, book) VALUES ('${chapter.chaptername}', '${response.rows[0].unique_id}')`,
      );
    }
    res.sendStatus(200);
  } catch (e) {
    console.error(e);
    res.sendStatus(400);
  }
});

module.exports = app;

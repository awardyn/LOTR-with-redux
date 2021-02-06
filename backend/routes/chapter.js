const express = require('express');
const { v4: uuidv4 } = require('uuid');

const app = express.Router();
const client = require('../config/pgClient');

app.post('/', async (req, res) => {
  let id = req.params.id;
  let data = req.body;
  try {
    await client.query(
      `INSERT INTO chapter(chaptername, book) VALUES ('${req.body.chaptername}', '${req.body.bookId}') RETURNING id`,
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

app.put('/:id', async (req, res) => {
  let id = req.params.id;
  let data = req.body;
  try {
    await client.query(
      `UPDATE chapter SET chaptername = '${data.chaptername}' WHERE id = ${id}`,
    );
    res.sendStatus(200);
  } catch (e) {
    console.error(e);
    res.sendStatus(400);
  }
});

app.delete('/:id', async (req, res) => {
  let id = req.params.id;
  try {
    await client.query(`DELETE FROM chapter WHERE id = ${id}`);
    res.sendStatus(200);
  } catch (e) {
    console.error(e);
    res.sendStatus(400);
  }
});

module.exports = app;

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
      `SELECT * from movie WHERE lower(name) LIKE '%${searchQuery}%' ORDER BY name ${sortDirection}`,
    );
    res.send({
      movies: [...response.rows],
    });
  } catch (e) {
    console.error(e);
    res.sendStatus(400);
  }
});

app.get('/:id/quotes', async (req, res) => {
  let { id } = req.params;
  try {
    const movie = await client.query(`SELECT * FROM movie WHERE id = '${id}'`);
    const movieUniqueId = movie.rows[0].unique_id;
    const response = await client.query(
      `SELECT * FROM quote WHERE movie = '${movieUniqueId}'`,
    );
    res.send({
      quotes: response.rows,
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
      `SELECT * FROM movie WHERE id = '${id}'`,
    );
    res.send({
      movie: response.rows,
    });
  } catch (e) {
    console.error(e);
    res.sendStatus(400);
  }
});

app.post('/', async (req, res) => {
  const movieId = uuidv4();
  try {
    for await (const quote of req.body.quotes) {
      const quoteId = uuidv4();
      client.query(
        `INSERT INTO quote(unique_id, dialog, character, movie) VALUES ('${quoteId}', '${quote.dialog}', '${quote.character_id}', '${movieId}')`,
      );
    }
    await client.query(
      `INSERT INTO movie(unique_id, name, runtimeinminutes, budgetinmillions, boxofficerevenueinmillions, academyawardnominations, academyawardwins, rottentomatesscore) VALUES ('${movieId}', '${req.body.name}', '${req.body.runtimeinminutes}', '${req.body.budgetinmillions}', '${req.body.boxofficerevenueinmillions}', '${req.body.academyawardnominations}', '${req.body.academyawardwins}', '${req.body.rottentomatesscore}') RETURNING id`,
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
    const response = await client.query(`DELETE FROM movie WHERE id = ${id}`);
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
      `UPDATE movie SET name = '${data.name}', runtimeinminutes = '${data.runtimeinminutes}', budgetinmillions = '${data.budgetinmillions}', boxofficerevenueinmillions = '${data.boxofficerevenueinmillions}', academyawardnominations = '${data.academyawardnominations}', academyawardwins = '${data.academyawardwins}', rottentomatesscore = '${data.rottentomatesscore}'  WHERE id = ${id} RETURNING unique_id`,
    );
    await client.query(
      `DELETE FROM quote WHERE movie = '${response.rows[0].unique_id}'`,
    );
    for await (const quote of req.body.quotes) {
      const quoteId = uuidv4();
      client.query(
        `INSERT INTO quote(unique_id, dialog, character, movie) VALUES ('${quoteId}', '${quote.dialog}', '${quote.character_id}', '${response.rows[0].unique_id}')`,
      );
    }
    res.sendStatus(200);
  } catch (e) {
    console.error(e);
    res.sendStatus(400);
  }
});

module.exports = app;

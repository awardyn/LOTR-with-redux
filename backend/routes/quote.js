const express = require('express');
const { v4: uuidv4 } = require('uuid');
const app = express.Router();
const client = require('../config/pgClient');

app.get('/', async (req, res) => {
  const { sort, search } = req.query;
  const searchQuery = search !== undefined ? search.toLowerCase() : '';
  const sortDirection = sort === '0' ? 'ASC' : 'DESC';

  try {
    const response = await client.query(
      `SELECT quote.id as id, quote.dialog, movie.name as movieName, character.name as characterName FROM quote, movie, character WHERE lower(dialog) LIKE '%${searchQuery}%' AND quote.movie = movie.unique_id AND quote.character = character.unique_id ORDER BY dialog ${sortDirection}`,
    );
    res.send({
      quotes: [...response.rows],
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
      `SELECT quote.dialog, movie.name as movieName, character.name as characterName FROM quote, movie, character WHERE quote.id = '${id}' AND quote.movie = movie.unique_id AND quote.character = character.unique_id`,
    );
    res.send({
      quote: response.rows,
    });
  } catch (e) {
    console.error(e);
    res.sendStatus(400);
  }
});

app.post('/', async (req, res) => {
  const quoteId = uuidv4();
  try {
    await client.query(
      `INSERT INTO quote(unique_id, dialog, movie, character) VALUES ('${quoteId}', '${req.body.dialog}', '${req.body.movie}', '${req.body.character}') RETURNING id`,
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
    const response = await client.query(`DELETE FROM quote WHERE id = ${id}`);
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
    await client.query(
      `UPDATE quote SET dialog = '${data.dialog}', character = '${data.character}', movie = '${data.movie}' WHERE id = ${id}`,
    );
    res.sendStatus(200);
  } catch (e) {
    console.error(e);
    res.sendStatus(400);
  }
});

module.exports = app;

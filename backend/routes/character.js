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
      `SELECT * from character WHERE lower(name) LIKE '%${searchQuery}%' ORDER BY name ${sortDirection}`,
    );
    res.send({
      characters: [...response.rows],
    });
  } catch (e) {
    console.error(e);
    res.sendStatus(400);
  }
});

app.get('/:id/quotes', async (req, res) => {
  let { id } = req.params;
  try {
    const character = await client.query(
      `SELECT * FROM character WHERE id = '${id}'`,
    );
    const characterUniqueId = character.rows[0].unique_id;
    const response = await client.query(
      `SELECT * FROM quote WHERE character = '${characterUniqueId}'`,
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
      `SELECT * FROM character WHERE id = '${id}'`,
    );
    res.send({
      character: response.rows,
    });
  } catch (e) {
    console.error(e);
    res.sendStatus(400);
  }
});

app.post('/', async (req, res) => {
  const characterId = uuidv4();
  try {
    for await (const quote of req.body.quotes) {
      const quoteId = uuidv4();
      client.query(
        `INSERT INTO quote(unique_id, dialog, movie, character) VALUES ('${quoteId}', '${quote.dialog}', '${quote.movie_id}', '${characterId}')`,
      );
    }
    await client.query(
      `INSERT INTO character(unique_id, race, gender, spouse, death, realm, name, wikiurl) VALUES ('${characterId}', '${req.body.race}', '${req.body.gender}', '${req.body.spouse}', '${req.body.death}', '${req.body.realm}', '${req.body.name}', '${req.body.wikiurl}') RETURNING id`,
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
    await client.query(`DELETE FROM character WHERE id = ${id}`);
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
      `UPDATE character SET race = '${data.race}', gender = '${data.gender}', spouse = '${data.spouse}', death = '${data.death}', realm = '${data.realm}', name = '${data.name}', wikiurl = '${data.wikiurl}'  WHERE id = ${id} RETURNING unique_id`,
    );
    await client.query(
      `DELETE FROM quote WHERE character = '${response.rows[0].unique_id}'`,
    );
    for await (const quote of req.body.quotes) {
      const quoteId = uuidv4();
      client.query(
        `INSERT INTO quote(unique_id, dialog, movie, character) VALUES ('${quoteId}', '${quote.dialog}', '${quote.movie_id}', '${response.rows[0].unique_id}')`,
      );
    }
    res.sendStatus(200);
  } catch (e) {
    console.error(e);
    res.sendStatus(400);
  }
});

module.exports = app;

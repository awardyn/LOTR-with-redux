const express = require('express');
const cors = require('cors');
const app = express();
const character = require('./routes/character');
const book = require('./routes/book');
const quote = require('./routes/quote');
const movie = require('./routes/movie');
const chapter = require('./routes/chapter');
const uploadImage = require('./routes/image');

const book_data = require('./book.json');
const movie_data = require('./movie.json');
const chapter_data = require('./chapter.json');
const character_data = require('./character.json');
const quote_data = require('./quote.json');

require('dotenv').config();
app.use(cors());
app.use(express.json());
app.use('/character', character);
app.use('/book', book);
app.use('/quote', quote);
app.use('/movie', movie);
app.use('/chapter', chapter);
app.use('/image', uploadImage);

app.post('/import_all', async (req, res) => {
  try {
    await client.query('drop table if exists book');
    await client.query('drop table if exists chapter');
    await client.query('drop table if exists character');
    await client.query('drop table if exists movie');
    await client.query('drop table if exists quote');

    await client.query(`CREATE TABLE IF NOT EXISTS book (
      id serial PRIMARY KEY,
      unique_id VARCHAR not null,
      name VARCHAR NOT NULL
   )`);
    await client.query(`CREATE TABLE IF NOT EXISTS movie (
      id serial PRIMARY KEY,
      unique_id VARCHAR not null,
      name VARCHAR NOT NULL,
      runtimeinminutes DECIMAL not null,
      budgetinmillions DECIMAL not null,
      boxofficerevenueinmillions DECIMAL not null,
      academyawardnominations DECIMAL not null,
      academyawardwins DECIMAL not null,
      rottentomatesscore DECIMAL not null
   )`);
    await client.query(`CREATE TABLE IF NOT EXISTS character (
      id serial PRIMARY KEY,
      unique_id VARCHAR not null,
      race VARCHAR,
      gender VARCHAR,
      spouse VARCHAR,
      death VARCHAR,
      realm VARCHAR,
      name VARCHAR,
      wikiurl VARCHAR
   )`);
    await client.query(`CREATE TABLE IF NOT EXISTS quote (
      id serial PRIMARY KEY,
      unique_id VARCHAR not null,
      dialog VARCHAR NOT NULL,
      movie VARCHAR not null,
      character VARCHAR not null
   )`);
    await client.query(`CREATE TABLE IF NOT EXISTS chapter (
      id serial PRIMARY KEY,
      chaptername VARCHAR NOT NULL,
      book VARCHAR not null
   )`);

    for await (const row_book of book_data['docs']) {
      client.query(
        `INSERT INTO book(unique_id, name) VALUES ('${row_book['_id']}', '${row_book['name']}')`,
      );
    }

    for await (const row_movie of movie_data['docs']) {
      client.query(
        `INSERT INTO movie(unique_id, name, runtimeinminutes, budgetinmillions, boxofficerevenueinmillions, academyawardnominations, academyawardwins, rottentomatesscore) VALUES ('${row_movie['_id']}', '${row_movie['name']}', '${row_movie['runtimeInMinutes']}', '${row_movie['budgetInMillions']}', '${row_movie['boxOfficeRevenueInMillions']}', '${row_movie['academyAwardNominations']}', '${row_movie['academyAwardWins']}', '${row_movie['rottenTomatesScore']}')`,
      );
    }
    for await (const row_chapter of chapter_data['docs']) {
      const chapterName = row_chapter['chapterName'].split("'").join('');
      client.query(
        `INSERT INTO chapter(chaptername, book) VALUES ('${chapterName}', '${row_chapter['book']}')`,
      );
    }
    for await (const row_character of character_data['docs']) {
      const name = row_character['name'].split("'").join('');
      client.query(
        `INSERT INTO character(unique_id, race, gender, spouse, death, realm, name, wikiurl) VALUES ('${row_character['_id']}', '${row_character['race']}', '${row_character['gender']}', '${row_character['spouse']}', '${row_character['death']}', '${row_character['realm']}', '${name}', '${row_character['wikiUrl']}')`,
      );
    }
    for await (const row_quote of quote_data['docs']) {
      const dialog = row_quote['dialog'].split("'").join('');
      client.query(
        `INSERT INTO quote(unique_id, dialog, movie, character) VALUES ('${row_quote['_id']}', '${dialog}', '${row_quote['movie']}', '${row_quote['character']}')`,
      );
    }
    res.sendStatus(201);
  } catch (e) {
    console.error(e);
    res.sendStatus(400);
  }
});

const client = require('./config/pgClient');
console.log('Connection parameters: ');
client
  .connect()
  .then(() => {
    console.log('Connected to PostgreSQL');
    const port = process.env.PORT || 5000;
    app.listen(port, () => {
      console.log(`API server listening at http://localhost:${port}`);
    });
  })
  .catch((err) => console.error('Connection error', err.stack));

import { createAction } from 'redux-api-middleware';
import {
  CREATE_MOVIE,
  DELETE_MOVIE,
  GET_MOVIE_QUOTES,
  GET_MOVIES,
  MOVIES_ERRORS,
  UPDATE_MOVIE,
} from '../types';

export const getMovies = (search) =>
  createAction({
    endpoint: `http://localhost:5000/movie?sort=0&search=${search}`,
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
    types: [
      'REQUEST',
      {
        type: GET_MOVIES,
        payload: (action, state, res) => {
          return res.json().then((json) => ({
            movies: json.movies,
            search: search.length > 0 ? true : false,
          }));
        },
      },
      MOVIES_ERRORS,
    ],
  });

export const getMovieQuotes = (id) =>
  createAction({
    endpoint: `http://localhost:5000/movie/${id}/quotes`,
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
    types: ['REQUEST', GET_MOVIE_QUOTES, MOVIES_ERRORS],
  });

export const updateMovie = (id, data) =>
  createAction({
    endpoint: `http://localhost:5000/movie/${id}`,
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
    types: ['REQUEST', UPDATE_MOVIE, MOVIES_ERRORS],
  });

export const createMovie = (data) =>
  createAction({
    endpoint: `http://localhost:5000/movie`,
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
    types: ['REQUEST', CREATE_MOVIE, MOVIES_ERRORS],
  });

export const deleteMovie = (id) =>
  createAction({
    endpoint: `http://localhost:5000/movie/${id}`,
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    types: ['REQUEST', DELETE_MOVIE, MOVIES_ERRORS],
  });

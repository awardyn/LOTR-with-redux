import { createAction } from 'redux-api-middleware';
import {
  CREATE_QUOTE,
  DELETE_QUOTE,
  GET_QUOTES,
  QUOTES_ERRORS,
  UPDATE_QUOTE,
} from '../types';

export const getQuotes = (search) =>
  createAction({
    endpoint: `http://localhost:5000/quote?sort=0&search=${search}`,
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
    types: [
      'REQUEST',
      {
        type: GET_QUOTES,
        payload: (action, state, res) => {
          return res.json().then((json) => ({
            quotes: json.quotes,
            search: search.length > 0 ? true : false,
          }));
        },
      },
      QUOTES_ERRORS,
    ],
  });

export const updateQuote = (id, data) =>
  createAction({
    endpoint: `http://localhost:5000/quote/${id}`,
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
    types: ['REQUEST', UPDATE_QUOTE, QUOTES_ERRORS],
  });

export const createQuote = (data) =>
  createAction({
    endpoint: `http://localhost:5000/quote`,
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
    types: ['REQUEST', CREATE_QUOTE, QUOTES_ERRORS],
  });

export const deleteQuote = (id) =>
  createAction({
    endpoint: `http://localhost:5000/quote/${id}`,
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    types: ['REQUEST', DELETE_QUOTE, QUOTES_ERRORS],
  });

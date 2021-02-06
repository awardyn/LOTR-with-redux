import { createAction } from 'redux-api-middleware';
import {
  BOOKS_ERRORS,
  CREATE_BOOK,
  DELETE_BOOK,
  GET_BOOK_CHAPTERS,
  GET_BOOKS,
  UPDATE_BOOK,
} from '../types';

export const getBooks = (search) =>
  createAction({
    endpoint: `http://localhost:5000/book?sort=0&search=${search}`,
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
    types: [
      'REQUEST',
      {
        type: GET_BOOKS,
        payload: (action, state, res) => {
          return res.json().then((json) => ({
            books: json.books,
            search: search.length > 0 ? true : false,
          }));
        },
      },
      BOOKS_ERRORS,
    ],
  });

export const getBookChapters = (id) =>
  createAction({
    endpoint: `http://localhost:5000/book/${id}/chapters`,
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
    types: ['REQUEST', GET_BOOK_CHAPTERS, BOOKS_ERRORS],
  });

export const updateBook = (id, data) =>
  createAction({
    endpoint: `http://localhost:5000/book/${id}`,
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
    types: ['REQUEST', UPDATE_BOOK, BOOKS_ERRORS],
  });

export const createBook = (data) =>
  createAction({
    endpoint: `http://localhost:5000/book`,
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
    types: ['REQUEST', CREATE_BOOK, BOOKS_ERRORS],
  });

export const deleteBook = (id) =>
  createAction({
    endpoint: `http://localhost:5000/book/${id}`,
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    types: ['REQUEST', DELETE_BOOK, BOOKS_ERRORS],
  });

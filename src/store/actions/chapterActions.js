import { createAction } from 'redux-api-middleware';
import {
  CHAPTERS_ERRORS,
  CREATE_CHAPTER,
  DELETE_CHAPTER,
  UPDATE_CHAPTER,
} from '../types';

export const updateChapter = (id, data) =>
  createAction({
    endpoint: `http://localhost:5000/chapter/${id}`,
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
    types: ['REQUEST', UPDATE_CHAPTER, CHAPTERS_ERRORS],
  });

export const createChapter = (data) =>
  createAction({
    endpoint: `http://localhost:5000/chapter`,
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
    types: ['REQUEST', CREATE_CHAPTER, CHAPTERS_ERRORS],
  });

export const deleteChapter = (id) =>
  createAction({
    endpoint: `http://localhost:5000/chapter/${id}`,
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    types: ['REQUEST', DELETE_CHAPTER, CHAPTERS_ERRORS],
  });

import { createAction } from 'redux-api-middleware';
import {
  CHARACTERS_ERRORS,
  CREATE_CHARACTER,
  DELETE_CHARACTER,
  GET_CHARACTER_QUOTES,
  GET_CHARACTERS,
  UPDATE_CHARACTER,
} from '../types';

export const getCharacters = (search) =>
  createAction({
    endpoint: `http://localhost:5000/character?sort=0&search=${search}`,
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
    types: [
      'REQUEST',
      {
        type: GET_CHARACTERS,
        payload: (action, state, res) => {
          return res.json().then((json) => ({
            characters: json.characters,
            search: search.length > 0 ? true : false,
          }));
        },
      },
      CHARACTERS_ERRORS,
    ],
  });

export const getCharacterQuotes = (id) =>
  createAction({
    endpoint: `http://localhost:5000/character/${id}/quotes`,
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
    types: ['REQUEST', GET_CHARACTER_QUOTES, CHARACTERS_ERRORS],
  });

export const updateCharacter = (id, data) =>
  createAction({
    endpoint: `http://localhost:5000/character/${id}`,
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
    types: ['REQUEST', UPDATE_CHARACTER, CHARACTERS_ERRORS],
  });

export const createCharacter = (data) =>
  createAction({
    endpoint: `http://localhost:5000/character`,
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
    types: ['REQUEST', CREATE_CHARACTER, CHARACTERS_ERRORS],
  });

export const deleteCharacter = (id) =>
  createAction({
    endpoint: `http://localhost:5000/character/${id}`,
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    types: ['REQUEST', DELETE_CHARACTER, CHARACTERS_ERRORS],
  });

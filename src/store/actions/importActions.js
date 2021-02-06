import { createAction } from 'redux-api-middleware';
import { CHARACTERS_ERRORS, SETUP_DEFAULT_DATA } from '../types';

export const setupDefaultData = () =>
  createAction({
    endpoint: `http://localhost:5000/import_all`,
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    types: ['REQUEST', SETUP_DEFAULT_DATA, CHARACTERS_ERRORS],
  });

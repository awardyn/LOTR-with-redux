import { createAction } from 'redux-api-middleware';
import { BOOKS_ERRORS,POST_IMAGE } from '../types';

export const postImage = (formData) =>
  createAction({
    endpoint: `http://localhost:5000/image`,
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'multipart/form-data',
    },
    body: formData,
    types: ['REQUEST', POST_IMAGE, BOOKS_ERRORS],
  });

import { BOOKS_ERRORS,GET_BOOK_CHAPTERS, GET_BOOKS } from '../types';

const initialState = {
  books: [],
  searched: false,
  chapters: [],
};

const bookReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_BOOKS:
      return {
        ...state,
        books: action.payload.books,
        searched: action.payload.search,
      };
    case GET_BOOK_CHAPTERS:
      return {
        ...state,
        chapters: action.payload.chapters,
      };
    case BOOKS_ERRORS:
      console.error(action.payload);
      return state;
    default:
      return state;
  }
};

export default bookReducer;

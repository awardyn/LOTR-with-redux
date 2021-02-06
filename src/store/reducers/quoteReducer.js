import { GET_QUOTES, QUOTES_ERRORS } from '../types';

const initialState = {
  quotes: [],
  searched: false,
};

const quoteReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_QUOTES:
      return {
        quotes: action.payload.quotes,
        searched: action.payload.search,
      };
    case QUOTES_ERRORS:
      console.error(action.payload);
      return state;
    default:
      return state;
  }
};

export default quoteReducer;

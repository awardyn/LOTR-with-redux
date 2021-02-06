import { GET_MOVIE_QUOTES, GET_MOVIES, MOVIES_ERRORS } from '../types';

const initialState = {
  movies: [],
  searched: false,
  movieQuotes: [],
};

const movieReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_MOVIES:
      return {
        ...state,
        movies: action.payload.movies,
        searched: action.payload.search,
      };
    case GET_MOVIE_QUOTES:
      return {
        ...state,
        movieQuotes: action.payload.quotes,
      };
    case MOVIES_ERRORS:
      console.error(action.payload);
      return state;
    default:
      return state;
  }
};

export default movieReducer;

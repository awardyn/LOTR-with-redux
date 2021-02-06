import { combineReducers } from 'redux';
import bookReducer from './bookReducer';
import characterReducer from './characterReducer';
import movieReducer from './movieReducer';
import quoteReducer from './quoteReducer';

export default combineReducers({
  books: bookReducer,
  characters: characterReducer,
  movies: movieReducer,
  quotes: quoteReducer,
});

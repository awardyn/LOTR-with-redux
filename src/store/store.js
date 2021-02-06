import { applyMiddleware, createStore } from 'redux';
import { apiMiddleware } from 'redux-api-middleware';
import thunk from 'redux-thunk';
import rootReducer from './reducers';

const initialState = {};

const middleware = [apiMiddleware, thunk];

const store = createStore(
  rootReducer,
  initialState,
  applyMiddleware(...middleware),
);

export default store;

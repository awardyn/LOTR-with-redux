import {
  CHARACTERS_ERRORS,
  GET_CHARACTER_QUOTES,
  GET_CHARACTERS,
} from '../types';

const initialState = {
  characters: [],
  searched: false,
  characterQuotes: [],
};

const characterReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_CHARACTERS:
      return {
        ...state,
        characters: action.payload.characters,
        searched: action.payload.search,
      };
    case GET_CHARACTER_QUOTES:
      return {
        ...state,
        characterQuotes: action.payload.quotes,
      };
    case CHARACTERS_ERRORS:
      console.error(action.payload);
      return state;
    default:
      return state;
  }
};

export default characterReducer;

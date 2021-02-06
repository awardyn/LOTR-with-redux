import { createSelector } from 'reselect';

export const moviesSelector = (state) => state.movies;

const movieItemId = (state, itemId) => itemId;

export const movieSelector = () => {
  return createSelector([moviesSelector, movieItemId], (items, itemId) =>
    items?.movies?.find((item) => Number(item.id) === Number(itemId)),
  );
};

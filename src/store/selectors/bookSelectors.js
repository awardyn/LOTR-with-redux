import { createSelector } from 'reselect';

export const booksSelector = (state) => state.books;

const bookItemId = (state, itemId) => itemId;

export const bookSelector = () => {
  return createSelector([booksSelector, bookItemId], (items, itemId) =>
    items?.books?.find((item) => Number(item.id) === Number(itemId)),
  );
};

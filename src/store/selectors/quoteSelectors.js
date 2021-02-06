import { createSelector } from 'reselect';

export const quotesSelector = (state) => state.quotes;

const quoteItemId = (state, itemId) => itemId;

export const quoteSelector = () => {
  return createSelector([quotesSelector, quoteItemId], (items, itemId) =>
    items?.quotes?.find((item) => Number(item.id) === Number(itemId)),
  );
};

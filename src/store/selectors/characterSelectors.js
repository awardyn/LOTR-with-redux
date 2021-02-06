import { createSelector } from 'reselect';

export const charactersSelector = (state) => state.characters;

const characterItemId = (state, itemId) => itemId;

export const characterSelector = () => {
  return createSelector(
    [charactersSelector, characterItemId],
    (items, itemId) =>
      items?.characters?.find((item) => Number(item.id) === Number(itemId)),
  );
};

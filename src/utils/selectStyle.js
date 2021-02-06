export const selectStyle = {
  menuPortal: (base) => ({ ...base, zIndex: 9999 }),
  singleValue: (base) => ({
    ...base,
    overflow: 'initial',
  }),
  container: (base) => ({ ...base, width: '250px' }),
};

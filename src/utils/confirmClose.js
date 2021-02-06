export const confirmClose = (handleClose) => {
  const closeDialog = window.confirm('Are you sure that you want to close?');
  if (closeDialog) {
    handleClose();
  }
};

import { useCallback, useState } from 'react';

export const useToggle = (initState?) => {
  const [open, setOpen] = useState(initState || false);
  const handleClickOpen = useCallback(() => {
    setOpen(true);
  }, []);
  const handleClose = useCallback(() => {
    setOpen(false);
  }, []);
  return [open, handleClickOpen, handleClose];
};

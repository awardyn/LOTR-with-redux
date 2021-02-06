import React from 'react';
import { toast } from 'react-toastify';
import { Button, Typography } from '@material-ui/core';
import { ErrorToast, SuccessToast } from '../StaticComponents';
import * as S from './Import.css';

const Import = ({ setupDefaultData }) => {
  const handleClick = async () => {
    const importData = window.confirm(
      'Are you sure that you want to set default settings?',
    );
    if (importData) {
      setupDefaultData().then((res) => {
        if (res.error) {
          toast.error(<ErrorToast message={res.payload?.message} />);
        } else {
          toast.success(
            <SuccessToast message="Data has been set, reload page" />,
          );
        }
      });
    }
  };

  return (
    <S.Container>
      <Typography variant="h3">
        Click here to setup default settings of Middle-Earth
      </Typography>
      <Button variant="contained" color="primary" onClick={handleClick}>
        Setup
      </Button>
    </S.Container>
  );
};

export default Import;

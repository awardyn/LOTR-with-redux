import React from 'react';
import { useHistory } from 'react-router-dom';
import { Button, Typography } from '@material-ui/core';
import * as S from './Main.css';

const Main = () => {
  const { push } = useHistory();

  const handleClick = () => {
    push('/import');
  };

  return (
    <S.Container>
      <Typography variant="h2">
        Welcome to the treasury of knowledge about Middle-earth
      </Typography>
      <Typography variant="h4">
        Here you will find everything from the first to the third era of
        Middle-earth
      </Typography>
      <Button variant="contained" color="primary" onClick={handleClick}>
        Getting started
      </Button>
    </S.Container>
  );
};

export default Main;

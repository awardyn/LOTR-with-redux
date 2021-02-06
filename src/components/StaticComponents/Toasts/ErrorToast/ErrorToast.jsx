import React from 'react';
import * as S from '../Toast.css';

export const ErrorToast = (props) => {
  return (
    <S.ToastContainer>
      <S.ErrorIconStyle />
      <S.ToastStyle>{props.message}</S.ToastStyle>
    </S.ToastContainer>
  );
};

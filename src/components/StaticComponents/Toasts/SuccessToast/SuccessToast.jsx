import React from 'react';
import * as S from '../Toast.css';

export const SuccessToast = (props) => {
  return (
    <S.ToastContainer>
      <S.CheckCircleIconStyle />
      <S.ToastStyle>{props.message}</S.ToastStyle>
    </S.ToastContainer>
  );
};

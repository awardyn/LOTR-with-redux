import React from 'react';
import * as S from './ToastProvider.css';

const ToastProvider = () => {
  return (
    <div>
      <S.Toast
        autoClose={5000} // 5s
      />
    </div>
  );
};

export default ToastProvider;

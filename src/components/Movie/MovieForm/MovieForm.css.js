import { Typography } from '@material-ui/core';
import { Form } from 'formik';
import styled from 'styled-components';

export const HeaderTitle = styled(Typography)`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const Header = styled.div`
  padding: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const FormContainer = styled(Form)`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: flex-start;
  min-height: 1000px;
  width: 100%;
`;

export const ButtonsContainer = styled.div`
  display: flex;
  flex-direction: row-reverse;
  justify-content: flex-start;
  && :not(:first-child) {
    margin-right: 8px;
  }
`;

export const SelectsContainer = styled.div`
  display: flex;
  & > div {
    width: 100%;
    margin-right: 1rem;
  }
  margin-top: 1rem;
`;

export const SelectContainer = styled.div`
  margin-top: 10px;
  width: 250px;
`;

export const ElementContainer = styled.div`
  width: 100%;
`;

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
  min-height: 300px;
`;

export const ButtonsContainer = styled.div`
  display: flex;
  flex-direction: row-reverse;
  justify-content: flex-start;
  && :not(:first-child) {
    margin-right: 8px;
  }
`;

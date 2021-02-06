import styled from 'styled-components';

export const Container = styled.div`
  margin-top: 2rem;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  align-items: center;
  height: 32rem;
`;

export const TableContainer = styled.div`
  padding: 2rem;
`;

export const ButtonsContainer = styled.div`
  display: flex;
  flex-direction: row-reverse;
  justify-content: flex-start;
  && :not(:first-child) {
    margin-right: 8px;
  }
`;

export const Link = styled.a`
  text-decoration: none;
  color: white;
  &:visited {
    color: white;
  }
`;

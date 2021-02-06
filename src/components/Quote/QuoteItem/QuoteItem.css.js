import styled from 'styled-components';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  align-items: center;
  min-height: calc(100vh - 8rem);
`;
export const ButtonsContainer = styled.div`
  display: flex;
  flex-direction: row-reverse;
  justify-content: flex-start;
  && :not(:first-child) {
    margin-right: 8px;
  }
`;

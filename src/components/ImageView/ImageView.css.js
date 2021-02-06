import styled from 'styled-components';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 400px;
`;

export const ImagesContainer = styled.div`
  width: 400px;
`;

export const ImageContainer = styled.img`
  width: 400px;
  height: 300px;
  margin-bottom: 20px;
`;

export const UploadFileButtonWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
  margin-bottom: 20px;
`;

export const InputFile = styled.input`
  position: absolute;
  left: 0;
  opacity: 0;
  width: 89px;
  height: 36px;
`;

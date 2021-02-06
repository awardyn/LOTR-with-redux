import React, { useEffect, useState } from 'react';
import { Button } from '@material-ui/core';
import axios from 'axios';
import { handleException } from '../../utils/errorHandlingUtils';
import * as S from './ImageView.css';

const ImageView = () => {
  const [listOfImages, setListOfImages] = useState([]);

  const importAllImages = (r) => {
    return r.keys().map(r);
  };

  useEffect(() => {
    setListOfImages(
      importAllImages(
        require.context(
          './../../../backend/files/',
          false,
          /\.(png|jpe?g|svg)$/,
        ),
      ),
    );
  }, []);

  const onImageChange = async (event) => {
    try {
      const formData = new FormData();
      const img = event.target.files[0];
      formData.append('myImage', img);
      const config = {
        headers: {
          'content-type': 'multipart/form-data',
        },
      };
      await axios
        .post('http://localhost:5000/image', formData, config)
        .then((response) => {
          alert('The file is successfully uploaded');
        })
        .catch((error) => {});
    } catch (e) {
      handleException(e);
    }
  };

  return (
    <S.Container>
      <h1>Select Image</h1>
      <S.UploadFileButtonWrapper>
        <Button variant="contained">Select</Button>
        <S.InputFile type="file" name="image" onChange={onImageChange} />
      </S.UploadFileButtonWrapper>
      <S.ImagesContainer>
        {listOfImages.map((image, index) => (
          <S.ImageContainer alt="" key={index} src={image} />
        ))}
      </S.ImagesContainer>
    </S.Container>
  );
};

export default ImageView;

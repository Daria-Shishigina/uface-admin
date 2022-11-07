import styled from 'styled-components';

export const Modal = styled.div`
  display: flex;
  position: fixed;
  z-index: 10000;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.6);
`;

export const Container = styled.div`
  background-color: #fff;
  display: flex;
  padding: 15px;
  border: 1px solid #eee;
  box-shadow: rgba(0, 0, 0, 0.06) 0px 2px 4px;
  position: absolute;
  right: 0;
  height: 100%;
  width: 100%;
  max-width: 600px;
  overflow-y: scroll;
  transform: translateX(105%);
`;

export const FormContainer = styled.div`
  width: 100%;

  .photos-block {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;

    width: 100%;
    height: 100%;
  }

  .main-image-status {
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;

    font-size: 14px;
    padding: 10px;
  }

  .buttons-block {
    display: flex;
    padding: 10px;
    justify-content: center;
    align-items: center;
  }

  .card {
    border: none;
  }

  .card-header {
    background: none;
    font-weight: bold;
  }

  input {
    background: #f2f2f2;
    border-radius: 26px 26px 5px 26px;
    outline: none;
    color: #2c2c2c;
    padding-left: 18px;
    padding-top: 5px;
    padding-bottom: 5px;
    padding-right: 18px;
    border: none;
  }

  button {
    border: none;
    padding: 0.6em 1.3em;
    color: #fff;
    box-shadow: 0 2px 4px rgb(138 149 158 / 20%);
    border-radius: 5px 30px 30px 30px;
    letter-spacing: 0.38px;
    background-color: #2c2c2c;

    &:hover {
      background-color: #111;
    }
  }

  .upload,
  .photo {
    border: none;
    background-color: #fff;
    padding: 5px;
    color: #000;
    border-radius: 0;
    box-shadow: none;
    text-decoration: underline;
    &:hover {
      background-color: #fff;
    }
  }
`;

export const CloseButton = styled.button`
  position: absolute;
  width: 30px;
  height: 30px;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2;
  top: 15px;
  right: 15px;

  border: none;
  padding: 0.6em 1.3em;
  color: #fff;
  box-shadow: 0 2px 4px rgb(138 149 158 / 20%);
  border-radius: 5px 30px 30px 30px;
  letter-spacing: 0.38px;
  background-color: #2c2c2c;
`;

export const LoaderContainer = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
  justify-content: center;
  align-items: center;
`;

export const Images = styled.div`
  /* height: 200px; */
  padding: 15px;
  display: flex;
  gap: 25px;
  justify-content: center;
  align-items: center;

  img.main {
    border: 1px solid black;
  }
`;

export const Image = styled.div`
  display: flex;
  flex-direction: column;

  gap: 15px;

  .select-main {
    margin: auto;
  }
`;

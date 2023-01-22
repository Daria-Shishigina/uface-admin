import styled from 'styled-components';

export const FormContainer = styled.div`
  border: none;

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
    padding: 0.3em 1em;
    color: #fff;
    box-shadow: 0 2px 4px rgb(138 149 158 / 20%);
    border-radius: 5px 30px 30px 30px;
    letter-spacing: 0.38px;
    background-color: #2c2c2c;

    &:hover {
      background-color: #111;
    }
  }
`;

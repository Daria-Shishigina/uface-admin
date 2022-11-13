import { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
  body {
    margin: 0;
    padding: 0;
    font-family: Open-Sans, Helvetica, Sans-Serif;
  }

  * {
    box-sizing: border-box;
  }

  input[type="number"]::-webkit-outer-spin-button,
  input[type="number"]::-webkit-inner-spin-button {
      -webkit-appearance: none; // Yeah, yeah everybody write about it
  }

  input[type='number'],
  input[type="number"]:hover,
  input[type="number"]:focus {
      appearance: none;
      -moz-appearance: textfield;
  }

  .MuiTablePagination-root{
    display: flex;
    justify-content: center;
    margin: auto;

    p{
      margin-bottom: 0;
    }
  }

  .MuiDataGrid-footerContainer{
    justify-content: space-around !important;
  }
`;

export default GlobalStyle;

import styled from 'styled-components';
export const CogContainer = styled.div`
  display: flex;
  align-items: flex-end;
  justify-content: flex-end;

  input[type='checkbox'] {
    background-color: #2c2c2c;
  }
`;
interface ICoord {
  w: number;
}
export const ListStyles = styled.ul<ICoord>`
  width: ${(props) => props.w}px;
  /* height: 300px; */
  padding: 1em 0;
  background-color: white;
  position: fixed;
  border: 1px solid lightgrey;
`;
export const SelectorContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
`;
export const CogButton = styled.i`
  cursor: pointer;
  &.active {
    color: #111;
  }
`;

export const InputStyles = styled.input`
  transform: translateY(-50%);
  color: #2c2c2c;
  margin-right: 8px;
`;

export const LabelStyles = styled.label`
  user-select: none;
  font-size: 12px;
  margin-right: 8px;
`;

export const OutData = styled.div`
  width: 100%;
  padding: 1em;
  font-weight: bold;
  font-size: 24px;

  display: flex;
  justify-content: center;
  align-items: center;
`;
export const Background = styled.div`
  background-color: grey;
  border-radius: 15px;
  min-height: 100px;
  min-width: 75px;
  position: fixed;
`;

export const Foreground = styled.img``;

export const Tr = styled.tr`
  button {
    border: none;
    padding: 0.3em 1em;
    color: #fff;
    box-shadow: 0 2px 4px rgb(138 149 158 / 20%);
    border-radius: 5px 30px 30px 30px;
    letter-spacing: 0.38px;
    background-color: #2c2c2c;
  }

  .manage-buttons {
    display: flex;
    gap: 10px;
    justify-content: center;
    align-items: center;
  }
`;

export const PagginationStyles = styled.div`
  display: flex;
  gap: 15px;
  width: 100%;
  align-items: center;
  justify-content: center;
  padding: 5px;

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
    width: 100px;

    &.page {
      width: 70px;
    }
  }

  button {
    border: none;
    padding: 0.3em 1em;
    color: #fff;
    box-shadow: 0 2px 4px rgb(138 149 158 / 20%);
    border-radius: 5px 30px 30px 30px;
    letter-spacing: 0.38px;
    background-color: #2c2c2c;

    &.disabled {
      background-color: #b5b5b5;
      color: #ffffff;
    }
  }

  select {
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

  label {
    margin: 0;
  }

  div {
    cursor: pointer;
  }

  .paggy {
    display: flex;
    gap: 5px;
    align-items: center;
    justify-content: center;
    div {
      padding: 5px;
      line-height: 1;
    }
  }

  .current-offset {
    display: flex;
    gap: 10px;
    align-items: center;
    justify-content: center;
  }

  /* Chrome, Safari, Edge, Opera */
  input::-webkit-outer-spin-button,
  input::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }

  /* Firefox */
  input[type='number'] {
    -moz-appearance: textfield;
  }

  .active {
    font-size: 1.2em;
    font-weight: bold;
  }
`;

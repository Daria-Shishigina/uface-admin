import styled from 'styled-components';

interface IMenuProps {
  open: boolean;
}
export const LeftMenuContainer = styled.nav<IMenuProps>`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;

  height: 100vh;
  width: ${(props) => (props.open ? 250 : 64)}px;
  left: 0;
  top: 0;
  padding-bottom: 2em;

  position: fixed;
  z-index: 101;

  background-color: #2c2c2c;
  box-shadow: 6px 14px 14px rgb(123 135 170 / 24%);

  transition: 0.5s ease;
`;

export const LeftMenuListStyles = styled.ul`
  width: 100%;
  padding: 0;
  margin: 0;

  display: flex;
  flex-direction: column;

  list-style: none;
`;

export const ListItemStyles = styled.li`
  width: 100%;
  padding: 1em;
  margin: 0;

  overflow: hidden;

  display: flex;
  justify-content: flex-start;
  align-items: center;
  list-style: none;
  gap: 1em;

  background-color: #2c2c2c;
  &:hover {
    background-color: rgba(52, 59, 70, 0.5);
  }

  i {
    font-size: 24px;
    color: #f2f4f7;
    &:hover {
      color: white;
    }
  }

  span {
    opacity: 0;
    white-space: nowrap;
    color: #f2f4f7;

    transition: 0.5s ease;
    &.active {
      opacity: 1;
    }
    &:hover {
      color: white;
    }
  }
`;

interface IButton {
  width: number;
}
export const Button = styled.button<IButton>`
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  top: 0;
  right: -${(props) => (props.width ? props.width : 20)}px;
  width: ${(props) => (props.width ? props.width : 20)}px;
  height: 50px;
  border-bottom-right-radius: 7px;

  outline: none !important;
  border: none;
  box-shadow: none;
  background-color: #2c2c2c;
`;

interface ILogo {
  open: boolean;
}
export const Logo = styled.div<ILogo>`
  width: 100%;
  height: 50px;
  margin-bottom: 20px;
  padding-left: 1em;

  display: flex;
  align-items: center;
  justify-content: flex-start;

  &:hover {
    background-color: rgba(52, 59, 70, 0.5);
  }

  a {
    width: 100%;
    white-space: nowrap;
    display: flex;
    align-items: center;
    gap: 15px;
  }

  img {
    height: 40px;
    width: auto;
  }

  span {
    opacity: 0;
    white-space: nowrap;
    color: #f2f4f7;

    font-weight: bold;
    font-size: 1.3em;

    transition: 0.5s ease;
    &.active {
      opacity: 1;
    }
    &:hover {
      color: white;
    }
  }
`;

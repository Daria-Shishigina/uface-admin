import React from 'react';
import styled from 'styled-components';

export const StatsContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-left: 5em;
  gap: 1.3em;
`;
export const LeftCard = styled.div`
  box-shadow: rgba(0, 0, 0, 0.15) 0px 0px 20px 0px;
  display: flex;
  min-width: 625px;
  border-radius: 12px;
  margin-top: 1.5em;
  min-height: 230px;
  height: 230px;
  background-color: white;
  color: white;
`;
export const InnerCard = styled.div`
  background-color: #3f76ec;
  border-radius: 12px 0 0 12px;
  display: flex;
  justify-content: center;
  align-items: center;
  width: fit-content;
  padding: 25px;
  height: 100%;
`;
export const Portrait = styled.div`
  background-image: url('https://via.placeholder.com/180');
  width: 180px;
  height: 180px;
  border-radius: 50%;
  border: 5px solid white;
`;
export const InnerCardHeader = styled.header`
  background-color: #f2f4f7;
  padding-bottom: 7px;
  padding-top: 7px;
  padding-left: 20px;
  padding-right: 20px;
  width: 395px;
  border-radius: 0 12px 0 0;

  color: #374d7a;
  h3 {
    font-size: 18px;
    font-weight: bold;
    margin-bottom: 0;
  }
  span {
    font-size: 15px;
    margin-top: 7px;
  }
`;
export const InnerCardRightDescription = styled.div`
  padding-bottom: 8px;
  padding-top: 8px;
  padding-left: 20px;
  padding-right: 20px;
  .header {
    opacity: 0.45;
    font-weight: bold;
    color: #163c6e;
    font-size: 12px;
  }
  p {
    color: #163c6e;

    font-size: 15px;
  }
`;
export const InnerCardRight = styled.div`
  /* padding-left: 1em; */
  border-radius: 0 12px 0 0;
  color: black;
  /* height: 15%; */
  font-size: 18px;
  width: 395px;
  margin-bottom: 5px;

  p {
    border-bottom: 1px solid lightgrey;
    width: 80%;
  }
`;

//Card
interface IPropsCard {
  inputColor?: string;
}
export const Cards = styled.div`
  margin-top: 2em;
  padding: 1em;
  display: grid;
  width: 100%;
  grid-template-columns: repeat(auto-fill, minmax(150px, 240px));
  grid-column-gap: 20px;
  grid-row-gap: 20px;
`;
export const CardStyles = styled.a<IPropsCard>`
  border-radius: 12px;
  overflow: hidden;
  position: relative;
  color: inherit;
  width: 15em;
  height: 6.565em;
  padding: 12px 10px 10px 40px;
  cursor: pointer;
  background-color: ${(props) => props.inputColor || '#3f76ec'};
  border-bottom: 0px solid white;
  &:hover {
    text-decoration: none;
    .goto {
      opacity: 1;
      transition: ease-in-out 0.4s opacity;
    }
    img {
      transform: scale(1.5);
      transition: ease-in-out 0.4s transform;
    }
  }
`;
export const CardGoTo = styled.div`
  font-size: 9px;
  letter-spacing: 1px;
  line-height: 14px;
  font-weight: 500;
  text-transform: uppercase;
  opacity: 0.5;
  width: fit-content;
  margin-left: 68.4062px;
  margin-top: 9px;
  text-align: right;
`;
export const CardHeader = styled.h3`
  margin-top: 0.5em;
  /* margin-left: 3.8em; */
  font-size: 13px;
  letter-spacing: 1px;
  margin: 0;
  text-transform: uppercase;
  width: fit-content;
  font-weight: 400;
  text-decoration: none;
`;

export const CardContainer = styled.div`
  z-index: 10;
  position: relative;
  color: white;
  text-decoration: none;
`;
export const CardImageDiv = styled.div`
  position: absolute;
  top: 50%;
  transform: translate(-100%, -50%);
  opacity: 0.1;
  z-index: 1;
`;
export const CardImage = styled.img`
  transform-origin: center;
`;

export const CardInfo = styled.h2`
  margin-top: 7px;
  font-size: 26px;
  font-weight: bold;
`;

import * as React from 'react';
import {
  CardStyles,
  CardContainer,
  CardHeader,
  CardInfo,
  CardGoTo,
  CardImage,
  CardImageDiv,
} from './stats.styles';

interface IProps {
  name: string;
  image: string;
  number: number;
  color: string | undefined;
}
const Card = ({ name, image, number, color }: IProps) => {
  return (
    <CardStyles inputColor={color && color}>
      <CardContainer>
        <CardHeader>{name}</CardHeader>
        <CardInfo>{number}</CardInfo>{' '}
        <CardGoTo className='goto'>Перейти в раздел</CardGoTo>
      </CardContainer>
      <CardImageDiv>
        <CardImage src={image} />
      </CardImageDiv>
    </CardStyles>
  );
};

export default Card;

import * as React from 'react';

//Components
import Card from './card.components';
import {
  Cards,
  InnerCard,
  InnerCardHeader,
  InnerCardRight,
  InnerCardRightDescription,
  LeftCard,
  Portrait,
  StatsContainer,
} from './stats.styles';

//Interfaces
interface IProps {
  //   children: React.ReactNode;
}
const cardsArray = [
  {
    name: 'Терминалы',
    number: 1,
    image: 'https://via.placeholder.com/75',
    color: '#2f303d',
  },
  {
    name: 'Шлагбаумы',
    number: 0,
    image: 'https://via.placeholder.com/75',
    color: '#2f303d',
  },
  {
    name: 'сотрудники',
    number: 78,
    image: 'https://via.placeholder.com/75',
  },
  {
    name: 'Отделы',
    number: 0,
    image: 'https://via.placeholder.com/75',
  },
  {
    name: 'Номера машин',
    number: 0,
    image: 'https://via.placeholder.com/75',
  },
];

const StatsComponents = ({}: IProps) => {
  return (
    <StatsContainer>
      <LeftCard>
        <InnerCard>
          <Portrait />
        </InnerCard>

        <InnerCardRight>
          <InnerCardHeader className='lastEntrance'>
            <h3>ПОСЛЕДНИЙ ВХОД</h3>
            <span>21.06.2021 15:50:26</span>
          </InnerCardHeader>

          <InnerCardRightDescription>
            <span>
              <span className='header'>ФИО</span>
              <p></p>
            </span>
            <span>
              <span className='header'>Устройство</span>
              <p>Корпус №12</p>
            </span>
          </InnerCardRightDescription>
        </InnerCardRight>
      </LeftCard>
      <Cards>
        {cardsArray.map(({ name, number, image, ...props }) => (
          <Card
            name={name}
            number={number}
            image={image}
            key={name}
            color={props.color && props.color}
          />
        ))}
      </Cards>
    </StatsContainer>
  );
};

export default StatsComponents;

import { useEffect, useState } from 'react';
import type { GetServerSideProps, NextApiRequest, NextPage } from 'next';
import PersonIcon from '@mui/icons-material/Person';
import DvrIcon from '@mui/icons-material/Dvr';

//context
import { useGlobalContext } from 'context/global';

//styles
import { DashboardBody } from 'styles/dashboard.styles';

//components
import { IStudent } from 'components/log/log-list.interfaces';
import { useQuery } from 'react-query';
import styled from 'styled-components';
import Moment from 'react-moment';
import Link from 'next/link';
import LogMainGrid from 'components/log/log-main-grid.component';
import { CircularProgress } from '@mui/material';

//interfaces
interface IProps {}

const Container = styled.div`
  h2,
  h3 {
    /* margin: 10px;
    margin-top: 24px; */
    font-weight: bold;
  }

  .grid-head {
    margin-top: 50px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
`;

const TopGrid = styled.div`
  display: grid;
  grid-template-columns: 2.5fr 1fr;
  gap: 50px;
`;

const NavigationGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 50px;
`;

const LastEntered = styled.div`
  border: 1px solid #333;
  border-radius: 25px;
  /* padding: 30px; */
  overflow: hidden;

  display: flex;
  justify-content: space-between;
  /* width: fit-content; */

  .info-block {
    padding: 24px;
  }

  h2 {
    font-weight: bold;
    margin: 0;
    margin-bottom: 20px;
  }

  img {
    margin-right: -1px;
  }

  .fio {
    font-size: 1.5em;
  }

  .terminal {
    font-size: 1em;

    .title {
      font-weight: bold;
    }
  }

  .date {
    margin-top: 10px;
    font-size: 0.89em;
  }
`;

const DashboardPage: NextPage = ({}: IProps) => {
  //Временная мера
  const { user, setUser } = useGlobalContext();

  const [canReadLogs, setCanReadLogs] = useState(false);

  useEffect(() => {
    user?.roles.map((item) =>
      item.authorities.map((authItem) => {
        if (authItem.authority_kod === 'visitlog') {
          setCanReadLogs(true);
        }
      })
    );
  }, [user]);

  useEffect(() => {
    if (window) {
      //@ts-ignore
      if (sessionStorage.getItem('user')?.length > 0) {
        //@ts-ignore
        const user = JSON.parse(sessionStorage.getItem('user'));
        setUser(user);
      }
    }
  }, []);

  return (
    <DashboardBody>
      {/* <StatsComponents /> */}

      {canReadLogs && (
        <>
          <h1 style={{ fontWeight: 'bold' }}>Главная</h1>
          <LogStudentsMonitoring />
        </>
      )}
    </DashboardBody>
  );
};

const LinkToPage = styled.a`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  height: fit-content;
  width: 100%;
  border-radius: 25px;
  background-color: #2c2c2c;
  color: #fff;
  font-size: 1.1em;
  text-decoration: none !important;
  cursor: pointer;
  box-shadow: 6px 14px 14px rgba(123, 135, 170, 0.24);

  transition: 0.13s ease;

  &:hover {
    color: #fff;
    background-color: #202020;
  }
`;

function ButtonToPage({
  title,
  linkPart,
}: {
  title: string;
  linkPart: string;
}) {
  return (
    <Link href={`/${linkPart}`} passHref>
      <LinkToPage>{title}</LinkToPage>
    </Link>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  // const uid = await loadIdToken(req as NextApiRequest);

  // if (!uid) {
  //   res.setHeader("location", "/auth");
  //   res.statusCode = 302;
  //   res.end();
  // }

  return { props: {} };
};

function LogStudentsMonitoring({}) {
  const [users, setUsers] = useState<IStudent[]>([]);
  const [listProp, setListProp] = useState<any[]>([]);
  const [photo, setPhoto] = useState<any>('');

  async function getPhoto(pid: string) {
    let login = sessionStorage.getItem('login');
    let password = sessionStorage.getItem('password');
    let height = 200;

    const userData = { login, password, height, pid };
    const resPhoto = await fetch('/api/getPhotoFolk', {
      method: 'POST',
      body: JSON.stringify({ userData }),
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const photo: any = await resPhoto.json();

    if (photo.status === 'success') {
      // return photo.photos[0].base64;
      setPhoto(photo?.photos[0]?.base64 || '');
    } else {
      setPhoto('');
    }
  }

  const { status, data, error, isFetching } = useQuery(
    'lastEntered',
    async () => {
      let login = sessionStorage.getItem('login');
      let password = sessionStorage.getItem('password');
      const res = await fetch('/api/getLogRecognition', {
        method: 'POST',
        body: JSON.stringify({
          login,
          password,
          limit: '5',
          offset: 0,
          getimg: true,
        }),
        headers: {
          'Content-Type': 'application/json',
        },
      }).then((result) => result.json());

      // console.log({ res });
      setUsers(res.logs);
    },
    {
      // Время повторного запроса: 1 сек = 1 • 1000мс
      // refetchInterval: 1000,
    }
  );

  // console.log({ users, photo });

  useEffect(() => {
    if (users?.length > 0 && listProp.length === 0) {
      Object.keys(users[0])?.map((item) => {
        let protertyItem = { name: item, property: '-none' };
        let newListProp = listProp;
        newListProp.push(protertyItem);
        setListProp(newListProp);
      });

      getPhoto(users[0].personId);

      let newListProp = listProp;
      newListProp[8].property = '';
      newListProp[9].property = '';
      newListProp[10].property = '';
      newListProp[17].property = '';
      newListProp[20].property = '';
      setListProp(newListProp);
    }
  }, [users]);

  if (status === 'loading')
    return (
      <div
        style={{
          height: '100vh',
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <CircularProgress />
      </div>
    );
  //@ts-ignore
  if (status === 'error') return <span>Error: {error?.message}</span>;

  return users?.length > 0 ? (
    <Container>
      <TopGrid>
        <LastEntered>
          <div className='info-block'>
            <h2>Последний вход</h2>
            <div className='fio'>{users[0].FIO}</div>
            <div className='terminal'>
              <span className='title'>Устройство: </span>
              <span>{users[0].title_terminal}</span>
            </div>
            <div className='date'>
              <div>Дата входа:</div>
              <Moment date={users[0]?.dt_log} subtract={{ hours: 12 }} format='DD.MM.YYYY HH:mm:ss' />
            </div>
          </div>
          <img
            src={users[0].image}
            height={318}
            alt='Изображение с терминала'
          />
          {photo !== '' ? (
            <img
              src={photo}
              height={318}
              style={{ marginLeft: 10 }}
              alt='Изображение с терминала'
            />
          ) : (
            <div
              style={{
                height: 318,
                width: 200,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                marginLeft: 10,
              }}
            >
              Нет в базе
            </div>
          )}
        </LastEntered>
        <div>
          <h4>Навигация:</h4>
          <NavigationGrid>
            <ButtonToPage title='Пользователи' linkPart='persons' />
            <ButtonToPage title='Терминалы' linkPart='terminals' />
          </NavigationGrid>
        </div>
      </TopGrid>
      <div>
        <div className='grid-head'>
          <h3>Последние вошедшие:</h3>
          <Link href={`/logs`} passHref>
            <a>Посмотреть всех</a>
          </Link>
        </div>
        <LogMainGrid />
      </div>
    </Container>
  ) : (
    <></>
  );
}

export default DashboardPage;

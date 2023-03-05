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
import moment from 'moment';
import styled from 'styled-components';
import Moment from 'react-moment';
import Link from 'next/link';
import LogMainGrid from 'components/log/log-main-grid.component';
import { CircularProgress } from '@mui/material';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import InsertChartIcon from '@mui/icons-material/InsertChartOutlined';
import PeopleIcon from '@mui/icons-material/PeopleOutlined';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import TextField from '@mui/material/TextField';
import dayjs, { Dayjs } from 'dayjs';

import { Avatar, Card, CardContent, Typography } from '@mui/material';
import MoneyIcon from '@mui/icons-material/Money';

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
  const [photoNotFound, setPhotoNotFound] = useState<any>('none');
  const [totalUserPeriod, setTotalUserPeriod] = useState<any>(0);
  const [totalUserPeriodEntry, setTotalUserPeriodEntry] = useState<any>(0);
  const [totalUserPeriodExit, setTotalUserPeriodExit] = useState<any>(0);
  const [totalPersons, setTotalPersons] = useState<any>(0);



  const [value, setValue] = useState<Dayjs | null>(
      dayjs('2023-25-02T21:11:54'),
  );
  const handleChange = (newValue: Dayjs | null) => {
    setValue(newValue);
  };

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
          limit: '1',
          offset: 0,
          getimg: true,
        }),
        headers: {
          'Content-Type': 'application/json',
        },
      }).then((result) => result.json());

      let total = await fetch('/api/getLogRecognition', {
        method: 'POST',
        body: JSON.stringify({
          login,
          password,
          // from_d: moment().subtract(1, 'days').format('DD.MM.YYYY HH:mm:ss'),
          from_d: moment().startOf('day').format('DD.MM.YYYY HH:mm:ss'),
          to_d: moment().format('DD.MM.YYYY HH:mm:ss'),
        }),
        headers: {
          'Content-Type': 'application/json',
        },
      }).then((result) => result.json());

      const user = { login, password, limit: 10000, offset: 0 };
      const _totalPersons = await fetch('/api/folks', {
        method: 'POST',
        body: JSON.stringify({ user }),
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const data = await _totalPersons.json();
      setTotalPersons(data.allcnt)
      setTotalUserPeriod(total.curcnt);
      let entry = 0;
      let exit = 0;
      total.logs.forEach(el => {
        if (el.inout === 'Вход') entry += 1;
        if (el.inout === 'Выход') exit += 1;
      })
      setTotalUserPeriodExit(exit)
      setTotalUserPeriodEntry(entry)
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

  useEffect(() => {
    setTimeout(() => {
      if (photo === '') setPhotoNotFound('block');
    }, 3000);
  }, []);

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
        {/*<CircularProgress />*/}
      </div>
    );
  //@ts-ignore
  if (status === 'error') return <span>Error: {error?.message}</span>;

  return users?.length > 0 ? (
    <Container>
      <Grid container spacing={6}>
        <Grid item xs={8} md={8}>
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
                  <Moment date={users[0]?.dt_log} format='DD.MM.YYYY HH:mm:ss' />
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
                    <div id="photoNotFound" style={{display: photoNotFound}}>Нет в базе</div>
                  </div>
              )}
            </LastEntered>
            {/*<div>*/}
            {/*  <h4>Навигация:</h4>*/}
            {/*  <NavigationGrid>*/}
            {/*    <ButtonToPage title='Пользователи' linkPart='persons' />*/}
            {/*    <ButtonToPage title='Терминалы' linkPart='terminals' />*/}
            {/*  </NavigationGrid>*/}
            {/*</div>*/}
        </Grid>
        <Grid item xs={4} md={4}>
          <Grid container spacing={5}>


            <Grid item xs={6} md={6}>
          <Card
              sx={{ height: '80%' }}
          >
            <CardContent>
              <Grid
                  container
                  spacing={3}
                  sx={{ justifyContent: 'space-between' }}
              >
                <Grid item>
                  <Typography
                      color="textSecondary"
                      gutterBottom
                      variant="overline"
                      fontSize={8}
                  >
                    Общее количество распознаваний (Сегодня)
                  </Typography><br/><br/>
                  <Grid container>
                    <Grid sx={6} md={6}>
                  <Typography
                      color="textPrimary"
                      //variant="h4"
                      fontSize={14}
                  >
                    {totalUserPeriod}
                  </Typography>
                    </Grid>
                    <Grid sx={6} md={6}>
                  <Avatar style={{float: 'right'}}
                      sx={{
                        backgroundColor: '#ee1445',
                        height: 30,
                        width: 30
                      }}
                  >
                    <MoneyIcon />
                  </Avatar>
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
            </Grid>
            <Grid item xs={6} md={6}>
              <Card
                  sx={{ height: '80%' }}
              >
                <CardContent>
                  <Grid
                      container
                      spacing={3}
                      sx={{ justifyContent: 'space-between' }}
                  >
                    <Grid item>
                      <Typography
                          color="textSecondary"
                          gutterBottom
                          variant="overline"
                          fontSize={8}
                      >
                        Общее количество распознаваний ВХОД (Сегодня)
                      </Typography><br/><br/>
                      <Grid container>
                        <Grid sx={6} md={6}>
                          <Typography
                              color="textPrimary"
                              //variant="h4"
                              fontSize={14}
                          >
                            {totalUserPeriodEntry}
                          </Typography>
                        </Grid>
                        <Grid sx={6} md={6}>
                          <Avatar style={{float: 'right'}}
                                  sx={{
                                    backgroundColor: 'success.main',
                                    height: 30,
                                    width: 30
                                  }}
                          >
                            <InsertChartIcon />
                          </Avatar>
                        </Grid>
                      </Grid>
                    </Grid>
                    <Grid item>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
            <Grid item style={{marginTop: '-10%'}} xs={6} md={6}>
              <Card
                  sx={{ height: '80%' }}
              >
                <CardContent>
                  <Grid
                      container
                      spacing={3}
                      sx={{ justifyContent: 'space-between' }}
                  >
                    <Grid item>
                      <Typography
                          color="textSecondary"
                          gutterBottom
                          variant="overline"
                          fontSize={8}
                      >
                        Общее количество распознаваний ВЫХОД (Сегодня)
                      </Typography><br/><br/>
                      <Grid container>
                        <Grid sx={6} md={6}>
                          <Typography
                              color="textPrimary"
                              //variant="h4"
                              fontSize={14}
                          >
                            {totalUserPeriodExit}
                          </Typography>
                        </Grid>
                        <Grid sx={6} md={6}>
                          <Avatar style={{float: 'right'}}
                                  sx={{
                                    backgroundColor: 'warning.main',
                                    height: 30,
                                    width: 30
                                  }}
                          >
                            <InsertChartIcon />
                          </Avatar>
                        </Grid>
                      </Grid>
                    </Grid>
                    <Grid item>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
            <Grid item style={{marginTop: '-10%'}} xs={6}  md={6}>
              <Card
                  sx={{ height: '80%' }}
              >
                <CardContent>
                  <Grid
                      container
                      spacing={3}
                      sx={{ justifyContent: 'space-between' }}
                  >
                    <Grid item>
                      <Typography
                          color="textSecondary"
                          gutterBottom
                          variant="overline"
                          fontSize={8}
                      >
                        Общее количество пользователей
                      </Typography><br/><br/>
                      <Grid container>
                        <Grid sx={6} md={6}>
                          <Typography
                              color="textPrimary"
                              //variant="h4"
                              fontSize={14}
                          >
                            {totalPersons}
                          </Typography>
                        </Grid>
                        <Grid sx={6} md={6}>
                          <Avatar style={{float: 'right'}}
                                  sx={{
                                    backgroundColor: 'primary.main',
                                    height: 30,
                                    width: 30
                                  }}
                          >
                            <PeopleIcon />
                          </Avatar>
                        </Grid>
                      </Grid>
                    </Grid>
                    <Grid item>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>

          </Grid>
        </Grid>
      </Grid>
      <div>
        <div className='grid-head'>
          <h3>Последние 50 проходов:&nbsp;&nbsp;&nbsp;
            {/*<LocalizationProvider dateAdapter={AdapterDayjs}>*/}
            {/*<DateTimePicker*/}
            {/*    label="Start date"*/}
            {/*    value={value}*/}
            {/*    onChange={handleChange}*/}
            {/*    renderInput={(params) => <TextField {...params} size="small"/>}*/}
            {/*/>&nbsp;&nbsp;&nbsp;*/}
            {/*  <DateTimePicker*/}
            {/*      label="End date"*/}
            {/*      value={value}*/}
            {/*      onChange={handleChange}*/}
            {/*      renderInput={(params) => <TextField {...params} size="small"/>}*/}
            {/*  />*/}
            {/*</LocalizationProvider>*/}
          </h3>
          <Link href={`/logs`} passHref>
            <a>Проходы за период</a>
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

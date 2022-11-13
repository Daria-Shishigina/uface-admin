import { Table } from 'react-bootstrap';
import React, { useState, useEffect } from 'react';
import LoadingSpin from 'react-loading-spin';

//Context
import { useGlobalContext } from 'context/global';

//Components
import CogComponent from './cog.component';

//Styles
import { OutData, PagginationStyles, Tr } from './clients.styles';
import ModalEdit from 'components/modal-edit/modal-edit.component';
import styled from 'styled-components';

export interface IClient {
  dateborn: string;
  activated: any;
  email: string;
  fio: string;
  fname: string;
  lname: string;
  sname: string;
  id: string;
  personid: string;
  phone: string;
  phone_approve: any;
  role: string;
  photo: string;
  vuz_title: string;
  vuz_kod: string;
  role_title: string;
  role_kod: string;
  isCreate: boolean;
}

export interface IPhoto {
  base64: string;
  main: boolean;
  faceid: string;
}

const PanelStyles = styled.div`
  display: flex;
  width: 100%;
  justify-content: flex-end;
  align-items: center;

  padding: 10px 5px;

  button {
    border: none;
    padding: 0.3em 1em;
    color: #fff;
    box-shadow: 0 2px 4px rgb(138 149 158 / 20%);
    border-radius: 5px 30px 30px 30px;
    letter-spacing: 0.38px;
    background-color: #2c2c2c;
  }
`;

const PanelAndFilter = ({ canAddUser }: { canAddUser: boolean }) => {
  const { setEditUser } = useGlobalContext();

  return (
    <PanelStyles>
      {canAddUser && (
        <button
          type='button'
          onClick={() => {
            setEditUser({
              dateborn: '',
              activated: false,
              email: '',
              fio: '',
              fname: '',
              lname: '',
              sname: '',
              id: '',
              personid: '',
              phone: '',
              phone_approve: false,
              role: '',
              photo: '',
              vuz_title: '',
              vuz_kod: '',
              role_title: '',
              role_kod: '',
              isCreate: true,
            });
          }}
        >
          Создать пользователя
        </button>
      )}
    </PanelStyles>
  );
};

const TableRow = ({
  item,
  filtering,
  canEditUser,
}: {
  item: IClient;
  filtering: { property: string; name: string }[];
  canEditUser: boolean;
}) => {
  const { setEditUser } = useGlobalContext();

  // Подгрузка фотографии пользователя
  //   const [photo, setPhoto] = useState<string>('');
  //   useEffect(() => {
  //     async function getPhoto() {
  //       let login = sessionStorage.getItem('login');
  //       let password = sessionStorage.getItem('password');
  //       let height = 40;

  //       const userData = { login, password, height, pid: item.personid };
  //       const resPhoto = await fetch('/api/getPhotoFolk', {
  //         method: 'POST',
  //         body: JSON.stringify({ userData }),
  //         headers: {
  //           'Content-Type': 'application/json',
  //         },
  //       });
  //       const photo = await resPhoto.json();

  //       const mainPhoto: IPhoto[] = photo.photos.filter(
  //         (photoItem: IPhoto) => photoItem.main && photoItem
  //       );

  //       const { base64 } = mainPhoto[0];
  //       setPhoto(base64);
  //       return base64;
  //     }

  //     getPhoto();
  //   }, []);

  const deleteFolk = async () => {
    let login = sessionStorage.getItem('login');
    let password = sessionStorage.getItem('password');

    const data = { login, password, pid: item.personid };

    // console.log({ data });
    const delFunc = await fetch('/api/delFolk', {
      method: 'DELETE',
      body: JSON.stringify({ data }),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    console.log({ delFunc });
  };

  return (
    <Tr key={item.personid}>
      <td
        style={{ cursor: 'pointer', height: 40, width: 80 }}
        className={'d' + filtering[0].property}
      >
        {false ? (
          <>
            {/* React Tooltip => faceid */}
            {/* <img
              style={{ width: 'auto', margin: 'auto', height: '40px' }}
              src={photo}
            /> */}
          </>
        ) : (
          //   <LoadingSpin primaryColor={'#2c2c2c'} size='36px' />
          <></>
        )}
      </td>

      <td className={'d' + filtering[1].property}>{item.id}</td>
      <td className={'d' + filtering[2].property}>{item.fio}</td>

      <td className={'d' + filtering[3].property}>{item.email}</td>
      <td className={'d' + filtering[4].property}>{item.phone}</td>
      <td className={'d' + filtering[5].property}>{item.personid}</td>
      <td className={'d' + filtering[6].property}>{item.role_title}</td>
      <td className={'d' + filtering[7].property}>{item.dateborn}</td>
      {canEditUser && (
        <td className={'d'}>
          <div className='manage-buttons'>
            <button type='button' onClick={() => setEditUser(item)}>
              <i className='fa-solid fa-pen-to-square' />
            </button>
            <button type='button' onClick={() => deleteFolk()}>
              <i className='fa-solid fa-trash-can' />
            </button>
          </div>
        </td>
      )}
    </Tr>
  );
};

const VisitorsTable = () => {
  const [filtering, setFilter] = useState([
    { property: '-none', name: 'Фото' },
    { property: '', name: 'ID' },
    { property: '', name: 'ФИО' },
    { property: '', name: 'E-Mail' },
    { property: '', name: 'Телефон' },
    { property: '-none', name: 'Персональный ID' },
    { property: '', name: 'Роль' },
    { property: '', name: 'Дата рождения' },
  ]);

  //Примитивный роутинг
  const [limit, setLimit] = useState(20);
  const [offset, setOffset] = useState<number>(0);
  const [maxUsers, setMaxUsers] = useState(0);

  const [clients, setClients] = useState<IClient[]>([]);

  const { user, setEditUser } = useGlobalContext();

  const [canReadLogs, setCanReadLogs] = useState(false);
  const [canEditUser, setCanEditUser] = useState(false);
  const [canAddUser, setCanAddUser] = useState(false);

  // Алексей Давыдулин, [4 Jun 2022, 10:29:32 PM]:
  // 3 - это просмотр
  // 1 - добавление
  // 2 - редактироанте

  useEffect(() => {
    user?.roles.map((item) =>
      item.authorities.map((authItem) => {
        if (authItem.authority_kod === 'users') {
          // console.log({ authItem });
          setCanReadLogs(true);
          authItem.authority_fields.map((fieldItem) => {
            // console.log({ fieldItem });
            if (
              fieldItem.field_kod === 'ACTIV' &&
              fieldItem.field_value.includes('1')
            ) {
              setCanAddUser(true);
              setCanEditUser(true);
            }
            if (
              fieldItem.field_kod === 'ACTIV' &&
              fieldItem.field_value.includes('2')
            ) {
              setCanEditUser(true);
            }
          });
        }
      })
    );
  }, [user]);

  useEffect(() => {
    getFolks();
  }, [offset, limit]);

  //Получить список пользователей
  const getFolks = async () => {
    let login = sessionStorage.getItem('login');
    let password = sessionStorage.getItem('password');

    //20, 50, 100, 200, 500

    const user = { login, password, limit, offset: offset * limit };
    const res = await fetch('/api/folks', {
      method: 'POST',
      body: JSON.stringify({ user }),
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const data = await res.json();

    setClients(data.folks);
    setMaxUsers(data.allcnt);
  };

  //Функция пагинации
  const Pagination = () => {
    const [offsetInput, setInputValue] = useState<number>(
      Math.round(offset + 1)
    );
    const handleClick = (e: any) => {
      if (e.key !== 'Enter') {
        return;
      }

      let pageNumber: number;

      pageNumber = offsetInput;
      if (pageNumber > maxUsers / limit) {
        pageNumber = Math.ceil(maxUsers / limit);
      }
      if (pageNumber < 1) {
        pageNumber = 1;
      }

      setOffset(Math.round(pageNumber - 1));
    };

    return (
      <PagginationStyles>
        <label>
          Показать на странице{' '}
          <select value={limit} onChange={(e: any) => setLimit(e.target.value)}>
            <option value={20}>20</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
            <option value={300}>300</option>
            <option value={500}>500</option>
          </select>
        </label>
        <div className='current-offset'>
          <div>Перейти на </div>
          <input
            className='page'
            type='number'
            value={offsetInput}
            onBlur={() => setInputValue(Math.round(offset + 1))}
            onChange={(e: any) => setInputValue(e.target.value)}
            onKeyPress={(e) => handleClick(e)}
          />
          <div> страницу</div>
        </div>
        <button
          className={offset === 0 ? 'disabled' : ''}
          onClick={() => setOffset(offset - 1)}
          disabled={offset === 0}
        >
          Назад
        </button>
        <div className='paggy'>
          {offset - 2 >= 1 && (
            <div
              style={{ fontSize: '0.70em' }}
              onClick={() => setOffset(offset - 3)}
            >
              {offset - 2}
            </div>
          )}
          {offset - 1 >= 1 && (
            <div
              style={{ fontSize: '0.85em' }}
              onClick={() => setOffset(offset - 2)}
            >
              {offset - 1}
            </div>
          )}
          {offset >= 1 && (
            <div
              style={{ fontSize: '.95em' }}
              onClick={() => setOffset(offset - 1)}
            >
              {offset}
            </div>
          )}
          {/* Текущий */}
          <div className='active'>{offset + 1}</div>
          {/* Текущий */}
          {offset + 2 <= Math.ceil(maxUsers / limit) && (
            <div
              style={{ fontSize: '.95em' }}
              onClick={() => setOffset(offset + 1)}
            >
              {offset + 2}
            </div>
          )}
          {offset + 3 <= Math.ceil(maxUsers / limit) && (
            <div
              style={{ fontSize: '0.85em' }}
              onClick={() => setOffset(offset + 2)}
            >
              {offset + 3}
            </div>
          )}
          {offset + 4 <= Math.ceil(maxUsers / limit) && (
            <div
              style={{ fontSize: '0.7em' }}
              onClick={() => setOffset(offset + 3)}
            >
              {offset + 4}
            </div>
          )}
        </div>
        <button
          className={
            Math.ceil(maxUsers / limit) <= offset + 1 ? 'disabled' : ''
          }
          onClick={() => setOffset(offset + 1)}
          disabled={Math.ceil(maxUsers / limit) <= offset + 1}
        >
          Вперед
        </button>
        <div> Всего страниц: {Math.ceil(maxUsers / limit)}</div>
      </PagginationStyles>
    );
  };

  return (
    <>
      <PanelAndFilter canAddUser={canAddUser} />
      {clients?.length > 0 && <Pagination />}
      <CogComponent filtering={filtering} setFilter={setFilter} />
      {clients?.length > 0 &&
      filtering.filter((item) => item.property !== '-none').length !== 0 ? (
        <Table striped borderless hover responsive size='lg'>
          <thead>
            <tr>
              {filtering.map((item, key) => (
                <th className={'d' + item.property} key={key}>
                  {item.name}
                </th>
              ))}
              {canEditUser && (
                <th style={{ textAlign: 'center' }}>Управление</th>
              )}
            </tr>
          </thead>

          <tbody>
            {clients.map((item) => {
              item = {
                ...item,
                activated: item.activated == '1',
                phone_approve: item.phone_approve == '1',
              };

              return (
                <TableRow
                  canEditUser={canEditUser}
                  key={item.personid}
                  item={item}
                  filtering={filtering}
                />
              );
            })}
          </tbody>
        </Table>
      ) : (
        <OutData>Нет данных</OutData>
      )}
      {clients?.length > 0 && <Pagination />}
      <ModalEdit />
    </>
  );
};

export default VisitorsTable;

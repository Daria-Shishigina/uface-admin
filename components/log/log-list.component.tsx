import { useEffect, useState } from 'react';

import { Table } from 'react-bootstrap';
import { PagginationStyles, Tr } from 'components/clients/clients.styles';

import { IStudent } from './log-list.interfaces';

const LogList = () => {
  const [userList, setUserList] = useState<IStudent[]>([]);

  //Примитивный роутинг
  const [limit, setLimit] = useState(20);
  const [offset, setOffset] = useState<number>(0);
  const [maxUsers, setMaxUsers] = useState(0);

  const getLogs = async () => {
    let login = sessionStorage.getItem('login');
    let password = sessionStorage.getItem('password');

    const res = await fetch('/api/getLogRecognition', {
      method: 'POST',
      body: JSON.stringify({ login, password, limit, offset }),
      headers: {
        'Content-Type': 'application/json',
      },
    }).then((result) => result.json());

    if (res.status === 'success') {
      setUserList(res.logs);
      setMaxUsers(res.allcnt || 20);
    }
  };

  useEffect(() => {
    getLogs();
  }, [offset, limit]);

  //Функция пагинации
  function Pagination() {
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
  }

  return (
    <div>
      <h1>Последние проходы</h1>
      <Pagination />
      {userList.length > 0 && <LogUsersList users={userList} />}
    </div>
  );
};

function LogUsersList({ users }: { users: IStudent[] }) {
  return (
    <div>
      <Table striped borderless hover responsive size='lg'>
        <tbody>
          {users.map((item, i) => {
            return (
              <Tr key={`${item.id}-${i}`}>
                <td>{item.id}</td>
                <td>{item.FIO}</td>

                <td>{item.title_terminal}</td>
                <td>{item.maskState}</td>
                <td>{item.id_terminal}</td>
              </Tr>
            );
          })}
        </tbody>
      </Table>
    </div>
  );
}

export default LogList;

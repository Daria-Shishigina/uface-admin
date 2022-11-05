import { useEffect, useState } from 'react';
import Link from 'next/link';

//Context
import { useGlobalContext } from 'context/global';

//Styles
import {
  Button,
  LeftMenuContainer,
  LeftMenuListStyles,
  ListItemStyles,
  Logo,
} from './leftmenu.styles';
import { useRouter } from 'next/router';

const LeftMenuComponent = () => {
  const router = useRouter();
  const { user } = useGlobalContext();

  const [canReadLogs, setCanReadLogs] = useState(false);
  const [canReadUsers, setCanReadUsers] = useState(false);
  const [canReadTerminals, setCanReadTerminals] = useState(false);

  const [isOpen, setOpen] = useState<boolean>(false);

  useEffect(() => {
    user?.roles.map((item) =>
      item.authorities.map((authItem) => {
        if (authItem.authority_kod === 'visitlog') {
          setCanReadLogs(true);
        }
        if (authItem.authority_kod === 'users') {
          setCanReadUsers(true);
        }

        if (authItem.authority_kod === 'terminals') {
          setCanReadTerminals(true);
        }
      })
    );
  }, [user]);

  function test() {
      console.log(1)
  }

  return user?.status === 'success' && router.pathname !== '/login' ? (
    <LeftMenuContainer id="sidebar" open={isOpen}
       onMouseLeave={() => {setOpen(false);}}
        onMouseOver={() => {setOpen(true);}}
    >
      <Logo open={isOpen}>
        <Link href='/dashboard'>
          <a>
            <img src='/images/tsu_logo.jpg' />{' '}
            <span className={isOpen ? 'active' : ''}>Админ-панель</span>
          </a>
        </Link>
      </Logo>
      <Button
        type='button'
        onClick={() => {
          setOpen(!isOpen);
        }}
        width={40}
      >
        <i
          className={`fas fa-chevron-right`}
          style={
            isOpen
              ? {
                  transform: 'rotate(180deg)',
                  transition: '0.3s ease',
                  color: 'white',
                }
              : { transition: '0.3s ease', color: 'white' }
          }
        ></i>
      </Button>
      <LeftMenuListStyles>
        {canReadLogs && (
          <Link href={'/logs'}>
            <a>
              <ListItemStyles>
                <i className='fa-solid fa-right-from-bracket'></i>{' '}
                <span className={isOpen ? 'active' : ''}>
                  Полный список логов
                </span>
              </ListItemStyles>
            </a>
          </Link>
        )}
        {canReadUsers && (
          <Link href={'/persons'}>
            <a>
              <ListItemStyles>
                <i className='fas fa-address-book'></i>{' '}
                <span className={isOpen ? 'active' : ''}>
                  Отделы и сотрудники
                </span>
              </ListItemStyles>
            </a>
          </Link>
        )}
        {canReadTerminals && (
          <Link href={'/terminals'}>
            <a>
              <ListItemStyles>
                <i className='fas fa-desktop'></i>{' '}
                <span className={isOpen ? 'active' : ''}>Устройства</span>
              </ListItemStyles>
            </a>
          </Link>
        )}
      </LeftMenuListStyles>
    </LeftMenuContainer>
  ) : (
    <></>
  );
};

export default LeftMenuComponent;

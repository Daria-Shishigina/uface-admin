import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

//Context
import { IUser, useGlobalContext } from 'context/global';

//Styles
import {
  ListItem,
  ListStyles,
  UserHeader,
  UserMenuStyles,
  UserPicture,
} from './header.styles';

//interfaces
interface IProps {
  user: IUser | null,
}

const UserMenu = ({ user }: IProps) => {
  const headUser = useRef<HTMLDivElement | null>(null);
  const [isOpen, setOpen] = useState<boolean>(false);

  const [dimensions, setDimensions] = useState<{
    x: number;
    y: number;
  }>({
    x: headUser.current?.getBoundingClientRect().right || 0,
    y: headUser.current?.getBoundingClientRect().bottom || 0,
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const handleResize = (): void => {
        setDimensions({
          x: headUser.current?.getBoundingClientRect().right || 0,
          y: headUser.current?.getBoundingClientRect().bottom || 0,
        });
      };

      window.addEventListener('resize', handleResize);
      return (): void => {
        window.removeEventListener('resize', handleResize);
      };
    }
  }, [isOpen, dimensions]);

  return (
    user && (
      <UserMenuStyles>
        <UserHeader
          className={isOpen ? 'active' : ''}
          ref={headUser}
          onClick={() => {
            setOpen(!isOpen);
            setDimensions({
              x: headUser.current?.getBoundingClientRect().right || 0,
              y: headUser.current?.getBoundingClientRect().bottom || 0,
            });
          }}
        >
          <UserPicture>
            {user.image ? (
              <img src={user.image} alt='Фото' />
            ) : (
              <i className='fas fa-user'></i>
            )}
          </UserPicture>

          <span>{user.login}</span>

          {isOpen ? (
            <i className='fas fa-chevron-up'></i>
          ) : (
            <i className='fas fa-chevron-down'></i>
          )}
        </UserHeader>
        {isOpen && (
          <MenuList
            close={() => setOpen(false)}
            t={dimensions.y}
            l={dimensions.x}
          />
        )}
      </UserMenuStyles>
    )
  );
};

interface IList {
  t: number;
  l: number;
  close: () => void;
}
function MenuList({ t, l, close }: IList) {
  const router = useRouter();
  const { setUser } = useGlobalContext();

  const logoutHandler = () => {
    sessionStorage.removeItem('login');
    sessionStorage.removeItem('password');
    sessionStorage.removeItem('user');
    setUser(null);
    router.push('/login');
  };

  return (
    <ListStyles w={230} style={{ top: t, left: l - 230 }}>
      <ListItem onClick={close}>
        <Link href='/dashboard/personal'>
          <a>Личные данные</a>
        </Link>
      </ListItem>
      <ListItem
        onClick={() => {
          close();
          logoutHandler();
        }}
        // onMouseLeave={close}
      >
        <span>Выйти</span>
      </ListItem>
    </ListStyles>
  );
}

export default UserMenu;

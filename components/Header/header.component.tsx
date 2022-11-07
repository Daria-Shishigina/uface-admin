import { useGlobalContext } from 'context/global';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { HeaderContainer } from './header.styles';
import UserMenu from './userMenu.component';

const HeaderComponents = () => {
  const router = useRouter();
  const { user, setUser } = useGlobalContext();
  useEffect(() => {
    if (window) {
      //@ts-ignore
      if (sessionStorage?.getItem('user')?.length > 0) {
        //@ts-ignore
        const user = JSON.parse(sessionStorage?.getItem('user'));
        setUser(user);
      }
    }
  }, []);

  // console.log({ user });

  return user?.status === 'success' && router.pathname !== '/login' ? (
    <HeaderContainer>
      <UserMenu user={user} />
    </HeaderContainer>
  ) : (
    <></>
  );
};

export default HeaderComponents;

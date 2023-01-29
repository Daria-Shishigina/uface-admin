import { useGlobalContext } from 'context/global';
import { useRouter } from 'next/router';
import {useEffect, useState} from 'react';
import {HeaderContainer, ListItem, ListStyles, IconMain} from './header.styles';
import UserMenu from './userMenu.component';
import LogoutIcon from '@mui/icons-material/Logout';
import DisplaySettingsIcon from '@mui/icons-material/DisplaySettings';
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import Link from 'next/link';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';

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

  const logoutHandler = () => {
    sessionStorage.removeItem('login');
    sessionStorage.removeItem('password');
    sessionStorage.removeItem('user');
    setUser(null);
    router.push('/login');
  };

  const openFullScreen = () => {
    document.body.requestFullscreen();
  }

  // console.log({ user });

  return user?.status === 'success' && router.pathname !== '/login' ? (
    <HeaderContainer >
      <UserMenu user={user}/>
      <Select value={'10'} sx={{ '.MuiOutlinedInput-notchedOutline': { border: 0 }}}>
        <MenuItem value={10}>Russian</MenuItem>
        <MenuItem value={20}>English</MenuItem>
        <MenuItem value={30}>Español</MenuItem>
      </Select>
      <IconMain>
        <Link href='/dashboard/personal'>
          <a><DisplaySettingsIcon style={{cursor: "pointer"}} fontSize={"medium"}/></a>
        </Link>&nbsp;&nbsp;&nbsp;&nbsp;
        <LogoutIcon fontSize={"medium"} style={{cursor: "pointer"}} onClick={() => {
          logoutHandler();
        }}/>&nbsp;&nbsp;&nbsp;&nbsp;
        <FullscreenIcon fontSize={"medium"} style={{cursor: "pointer"}} onClick={() => {
          openFullScreen();
        }}/>
      </IconMain>
    </HeaderContainer>
  ) : (
    <></>
  );
};

export default HeaderComponents;

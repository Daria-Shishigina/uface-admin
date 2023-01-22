import Head from 'next/head';
import * as React from 'react';
import type { AppProps } from 'next/app';
import { useRouter } from 'next/router';
//Context
import ContextProvider, { useGlobalContext } from '../context/global';

//Components
import HeaderComponents from '../components/Header/header.component';
import LeftMenuComponent from '../components/LeftMenu/leftmenu.componenet';
import GlobalStyle from 'styles/global.styles';
import { useEffect } from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';

function MyApp({ Component, pageProps }: AppProps) {
  const { user } = useGlobalContext();
  // console.log({ user });
  const router = useRouter();
  useEffect(() => {
    if (router.pathname !== '/login' && user === null) {
      typeof window !== 'undefined' && router.push('/login');
    }
  }, []);

  const queryClient = new QueryClient();

  return (
    <>
      <GlobalStyle />
      <Head>
        {/* eslint-disable-next-line @next/next/no-css-tags */}
        <link
          href='//netdna.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css'
          rel='stylesheet'
        />
        <link
          rel='stylesheet'
          href='https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css'
          integrity='sha512-Fo3rlrZj/k7ujTnHg4CGR2D7kSs0v4LLanw2qksYuRlEzO+tcaEPQogQ0KaoGN26/zrn20ImR1DfuLWnOo7aBA=='
          crossOrigin='anonymous'
          referrerPolicy='no-referrer'
        />
      </Head>
      <QueryClientProvider client={queryClient}>
        <ContextProvider>
          <HeaderComponents />
          <LeftMenuComponent />

          <Component {...pageProps} />
        </ContextProvider>
      </QueryClientProvider>
    </>
  );
}

export default MyApp;

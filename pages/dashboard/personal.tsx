import { useEffect } from 'react';
import Link from 'next/link';

//Context
import { useGlobalContext } from 'context/global';

//Componenets
import PersonalInfo from 'components/Forms/personal.component';

//Styles
import { DashboardBody } from 'styles/dashboard.styles';

const Personal = () => {
  //Временная мера
  const { setUser } = useGlobalContext();

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

  return (
    <DashboardBody>
      <Link href='/dashboard'>
        <a>Вернуться в Dashboard</a>
      </Link>
      <PersonalInfo />
    </DashboardBody>
  );
};

export default Personal;

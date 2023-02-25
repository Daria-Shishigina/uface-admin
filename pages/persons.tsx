import { useEffect, useState } from 'react';
import type { GetServerSideProps, NextApiRequest, NextPage } from 'next';

//context
import { IUser, useGlobalContext } from 'context/global';

//styles
import { DashboardBody } from 'styles/dashboard.styles';

//components
import StatsComponents from 'components/Stats/stats.components';
import LogList from 'components/log/log-list.component';
import VisitorsTable from 'components/clients/clients.components';
import VisitorsGrid from 'components/clients/clients-grid.component';
import BlockUi from 'react-block-ui';
import 'react-block-ui/style.css';

//interfaces
interface IProps {}

const PersonsPage: NextPage = ({}: IProps) => {
  //Временная мера
  const { setUser } = useGlobalContext();
  const [blocking, setBlocking] = useState(false);
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
      <BlockUi tag="div" blocking={blocking} style={{cursor: 'default'}}>
      <VisitorsGrid setBlocking={setBlocking}/>
      </BlockUi>
      {/* <VisitorsTable /> */}
    </DashboardBody>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  // const uid = await loadIdToken(req as NextApiRequest);

  // if (!uid) {
  //   res.setHeader("location", "/auth");
  //   res.statusCode = 302;
  //   res.end();
  // }

  return { props: {} };
};

export default PersonsPage;

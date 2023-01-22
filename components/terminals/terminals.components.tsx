// getTerminals
import { useEffect, useState } from 'react';

import { Table } from 'react-bootstrap';
import { Tr } from 'components/clients/clients.styles';

import { useQuery } from 'react-query';

interface ITerminal {
  id: string;
  ip: string;
  linked: string;
  port: string;
  primary: string;
  state: string;
}

export default function TerminalsList() {
  const { status, data, error, isFetching } = useQuery(
    'terminals',
    async () => {
      let login = sessionStorage.getItem('login');
      let password = sessionStorage.getItem('password');

      const res = await fetch('/api/getTerminals', {
        method: 'POST',
        body: JSON.stringify({ login, password }),
        headers: {
          'Content-Type': 'application/json',
        },
      }).then((result) => result.json());

      return res.terms;
    },
    {
      // Refetch the data every second
      refetchInterval: 5000,
    }
  );

  console.log({ status, data });

  if (status === 'loading') return <h1>Loading...</h1>;
  //@ts-ignore
  if (status === 'error') return <span>Error: {error.message}</span>;

  return (
    <div>
      <h1>Список терминалов</h1>
      {data?.length > 0 && <TerminalItem terminals={data} />}
    </div>
  );
}

function TerminalItem({ terminals }: { terminals: ITerminal[] }) {
  return (
    <div>
      <Table striped borderless hover responsive size='lg'>
        <tbody>
          {terminals.map((item, i) => {
            return (
              <Tr key={`${item.id}-${i}`}>
                <td style={{ cursor: 'pointer', height: 40, width: 80 }}></td>

                <td>{item.state}</td>
                <td>{item.id}</td>
                <td>{item.ip}</td>

                <td>{item.port}</td>
              </Tr>
            );
          })}
        </tbody>
      </Table>
    </div>
  );
}

// getTerminals
import { useEffect, useState } from 'react';
import {
  DataGrid,
  GridColDef,
  GridValueGetterParams,
  GridToolbar,
  ruRU,
} from '@mui/x-data-grid';

import { Table } from 'react-bootstrap';
import { Tr } from 'components/clients/clients.styles';

import { useQuery } from 'react-query';

// interface ITerminal {
//   id: string;
//   ip: string;
//   linked: string;
//   port: string;
//   primary: string;
//   state: string;
// }

let stateColumn: any[] = [];
const getFormatedColumn = (filteredColumn: any[]) => {
  filteredColumn.map((cs: any) => {
    stateColumn.push({
      field: cs.key,
      headerName: cs.nameColumn,
      width: cs.width,
      hide: cs.hide,
    });
  });

  return stateColumn;
};

export default function TerminalsGrid() {
  const [columns, setColumns] = useState<any[]>([]);
  const [pageSize, setPageSize] = useState<number>(20);

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
      }); //.then((result) => result.json());
      const resData = await res.json();

      const columnsReq = await fetch('/api/column-names', {
        method: 'POST',
        body: JSON.stringify({ login, password }),
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const column = await columnsReq.json();
      console.log({ column });
      const filteredColumn = column?.clmns.filter(
        (item: any) => item.keyTable === 'terminals'
      );

      const formated = getFormatedColumn(filteredColumn);
      setColumns(formated);
      console.log({ resData });
      return resData.terms;
      // return res.terms;
    },
    {
      // Refetch the data every second
      refetchInterval: 5000,
    }
  );

  if (status === 'loading') return <h1>Loading...</h1>;
  //@ts-ignore
  if (status === 'error') return <span>Error: {error?.message}</span>;

  return (
    <div>
      <h1>Список терминалов</h1>
      <div style={{ height: '80vh' }}>
        <DataGrid
          rows={data}
          columns={columns}
          pageSize={pageSize}
          onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
          localeText={ruRU.components.MuiDataGrid.defaultProps.localeText}
          // getRowId={(row) => row.id}

          // node_modules/@mui/x-data-grid/DataGrid/useDataGridProps.d.ts; Строчка 3, значение 100 изменить на 500
          // node_modules/@mui/x-data-grid/DataGrid/useDataGridProps.js; Строчка 19, значение 100 изменить на 500
          rowsPerPageOptions={[20, 50, 100, 200, 500]}
          checkboxSelection
          disableSelectionOnClick
          components={{ Toolbar: GridToolbar }}
          componentsProps={{
            pagination: {
              labelRowsPerPage: 'Количество на странице',
              labelDisplayedRows: ({ from, to, count, page }: any) =>
                `Страница ${page + 1} из ${Math.ceil(count / pageSize)}`,
              // count: 1,
              // page: 0,
              // component: 'div', // here
              // onPageChange: () => {},
              // onRowsPerPageChange: () => {},
              // nextIconButtonProps: {
              //   disabled: true,
              // },
            },
          }}
        />
      </div>
    </div>
  );
}

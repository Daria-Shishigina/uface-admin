import { useEffect, useState } from 'react';
import {
  DataGridPro,
  GridColDef,
  GridValueGetterParams,
  GridToolbar,
  ruRU,
  GridToolbarContainer,
  GridToolbarColumnsButton,
  GridToolbarFilterButton,
  GridToolbarDensitySelector,
  GridToolbarExport,
  GridCellParams,
} from '@mui/x-data-grid-pro';
import moment from 'moment';

import { IStudent } from './log-list.interfaces';

let stateColumn: any[] = [];
const getFormatedColumn = (filteredColumn: any[]) => {
  stateColumn = [];
  filteredColumn.map((cs: any) => {
    if (cs.key === 'dt_log') {
      stateColumn.push({
        field: cs.key,
        headerName: cs.nameColumn,
        width: cs.width,
        hide: false, //
        renderCell: (params: any) => (
          <span>{moment(params.value).format('DD.MM.YYYY  hh:mm:ss')}</span>
        ),
      });
    } else {
      stateColumn.push({
        field: cs.key,
        headerName: cs.nameColumn,
        width: cs.width,
        hide: Boolean(cs.hide),
      });
    }
  });

  return stateColumn;
};

function CustomToolbar() {
  return (
    <GridToolbarContainer>
      <GridToolbarColumnsButton />
      <GridToolbarFilterButton />
      <GridToolbarDensitySelector />
      <GridToolbarExport csvOptions={{ utf8WithBom: true, delimiter: ';' }} />
    </GridToolbarContainer>
  );
}

const LogGrid = () => {
  const [userList, setUserList] = useState<IStudent[]>([]);

  //Примитивный роутинг
  const [limit, setLimit] = useState(1000);
  const [offset, setOffset] = useState<number>(0);
  const [columns, setColumns] = useState<any[]>([]);
  const [pageSize, setPageSize] = useState<number>(20);
  const [maxRetry, setMaxretry] = useState<number>(0);

  const getLogs = async () => {
    if (maxRetry === 3) return false; // TODO ???
    let login = sessionStorage.getItem('login');
    let password = sessionStorage.getItem('password');
    console.log(login, password)

    const res = await fetch('/api/getLogRecognition', {
      method: 'POST',
      body: JSON.stringify({ login, password, limit, offset, getimg: false }),
      headers: {
        'Content-Type': 'application/json',
      },
    }).then((result) => result.json());

    const columnsReq = await fetch('/api/column-names', {
      method: 'POST',
      body: JSON.stringify({ login, password }),
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const column = await columnsReq.json();

    const filteredColumn = column?.clmns.filter(
      (item: any) => item.keyTable === 'log_identify'
    );

    const formated = getFormatedColumn(filteredColumn);
    console.log(formated)
    setColumns(formated);
    setMaxretry(maxRetry + 1);
    if (res.status === 'success') {
      setUserList(res.logs);
    }
  };

  useEffect(() => {
    getLogs();
  }, [offset, userList, limit]);

  return (
    <div>
      <h1>Последние проходы</h1>
      <div style={{ height: '80vh' }}>
        <DataGridPro
          rows={userList}
          columns={columns}
          pageSize={pageSize}
          sx={{
            height: '80vh',
            '& .green': {
              // backgroundColor: '#b9d5ff91',
              color: '#1bcf12',
            },
            '& .red': {
              // backgroundColor: '#ff943975',
              color: '#c72828',
            },
          }}
          onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
          localeText={ruRU.components.MuiDataGrid.defaultProps.localeText}
          // getRowId={(row) => row.id}

          // node_modules/@mui/x-data-grid/DataGrid/useDataGridProps.d.ts; Строчка 3, значение 100 изменить на 500
          // node_modules/@mui/x-data-grid/DataGrid/useDataGridProps.js; Строчка 19, значение 100 изменить на 500
          rowsPerPageOptions={[20, 50, 100]}
          checkboxSelection
          disableSelectionOnClick
          components={{ Toolbar: CustomToolbar }}
          getCellClassName={(params: GridCellParams<number>) => {
            return params.field === 'temperature' &&
              params.row.temperature < params.row.std_temperature
              ? 'green'
              : params.field === 'temperature' &&
                params.row.temperature > params.row.std_temperature
              ? 'red'
              : '';
          }}
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
};

export default LogGrid;

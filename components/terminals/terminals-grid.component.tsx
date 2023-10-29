// getTerminals
import React, { useEffect, useState } from 'react';
import {
  DataGridPro,
  GridColDef,
  GridValueGetterParams,
  GridToolbar,
  ruRU,
} from '@mui/x-data-grid-pro';
import {CircularProgress, TextField, Typography} from '@mui/material';

import FormGroup from '@mui/material/FormGroup';
import {DataGrid} from '@mui/x-data-grid';
import Grid from "@mui/material/Grid";

import { Table } from 'react-bootstrap';
import { Tr } from 'components/clients/clients.styles';

import { useQuery } from 'react-query';
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";

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
      <FormGroup>
        <Grid container spacing={1}>
          <Grid item xs={6} md={6}>
      <h1>Список терминалов</h1>
      <div style={{ height: '80vh' }}>
          {columns.length === 0 ? <CircularProgress style={{ marginLeft: '50%', marginTop: '10%'}}/> :
        <DataGridPro
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
        /> }
      </div>
          </Grid>
          <Grid item xs={6}>
            <br/><br/><br/>
              <TextField
                fullWidth size="small" // onChange={}
                label='CardMicroVersion'/><br/>



            <Typography sx={{wordBreak: "break-word"}}>
              "CardMicroVersion": "", <br/>
              "SDKVersion": "v0.1.1.462eb-1211028.256-20220530-uface_D_E.3.109.1.6",<br/>
              "cpuTemperature": "41.043506",<br/>
              "cpuUsageRate": "53.278000%",<br/>
              "deviceKey": "84E0F426D672527A",<br/>
              "faceCount": "10351",<br/>
              "freeDiskSpace": "5159M",<br/>
              "ip": "192.168.0.123",<br/>
              "languageType": "ru",<br/>
              "memoryUsageRate": "31.075153%",<br/>
              "personCount": "5957",<br/>
              "time": "1697530436546",<br/>
              "timeZone": "GMT+7",<br/>
              "version": "GD-V32.7302"<br/>
            </Typography><br/>


          </Grid>
        </Grid>
      </FormGroup>
    </div>
  );
}

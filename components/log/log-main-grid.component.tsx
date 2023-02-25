import React, { useEffect, useState } from 'react';
import {
  DataGridPro,
  GridColDef,
  GridValueGetterParams,
  GridToolbar,
  ruRU,
  GridCellParams,
} from '@mui/x-data-grid-pro';
import Modal from '@mui/material/Modal';
import Typography from '@mui/material/Typography';
import { CircularProgress } from '@mui/material';
import Moment from 'react-moment';

const style = {
  position: 'absolute' as 'absolute',
  top: '15%',
  left: '12%',
  width: '76%',
  height: '70%',
};

import { IStudent } from './log-list.interfaces';
import { useQuery } from 'react-query';
import moment from 'moment';
import Grid from '@mui/material/Grid';
import { Box } from '@mui/material';
import {
  GridToolbarColumnsButton,
  GridToolbarContainer,
  GridToolbarDensitySelector, GridToolbarExport,
  GridToolbarFilterButton
} from "@mui/x-data-grid";

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

let stateColumn: any[] = [];
const getFormatedColumn = (filteredColumn: any[]) => {
  stateColumn = [];
  filteredColumn.map((cs: any) => {
    //temperatureState valueFormatter: ({ value }) => `${value} °C`
    if (cs.key === 'dt_log') {
      stateColumn.push({
        field: cs.key,
        headerName: cs.nameColumn,
        width: cs.width || 150,
        hide: cs.hide,
        renderCell: (params: any) => (
          <span>{moment(params.value).format('DD.MM.YYYY  hh:mm:ss')}</span>
        ),
        // hide: true,
      });
    } else if (
      cs.key === 'temperatureState' ||
      cs.key === 'temperature' ||
      cs.key === 'std_temperature'
    ) {
      stateColumn.push({
        field: cs.key,
        headerName: cs.nameColumn,
        width: cs.width || 150,
        hide: cs.hide,
        valueFormatter: ({ value }: any) => `${value} °C`,
        // hide: true,
      });
    } else {
      stateColumn.push({
        field: cs.key,
        headerName: cs.nameColumn,
        width: cs.width || 150,
        hide: cs.hide,
      });
    }
  });

  return stateColumn;
};

const LogMainGrid = () => {
  const [userList, setUserList] = useState<IStudent[]>([]);
  const [maxRetry, setMaxretry] = useState<number>(0);
  //Примитивный роутинг
  const [limit, setLimit] = useState(50);
  const [offset, setOffset] = useState<number>(0);
  const [maxUsers, setMaxUsers] = useState(0);
  const [columns, setColumns] = useState<any[]>([]);
  const [pageSize, setPageSize] = useState<number>(5);

  const [open, setOpen] = useState(false);
  const [imgsrc, setImgsrc] = useState('https://upload.wikimedia.org/wikipedia/commons/5/59/Empty.png?20091205084734');

  const handleOpen = async (params: any) => {
    let login = sessionStorage.getItem('login');
    let password = sessionStorage.getItem('password');
    let pid = params.row.personId;
    const user = {login, password, pid};
    const folks = await fetch('/api/folks', {
      method: 'POST',
      body: JSON.stringify({ user }),
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const userData = { login, password, height: 200, pid };
    const resPhoto = await fetch('/api/getPhotoFolk', {
      method: 'POST',
      body: JSON.stringify({ userData }),
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const photo: any = await resPhoto.json();
    // console.log(photo?.photos[0]?.base64)
    // console.log(params?.value)
    const dataFolks = await folks.json();
    console.log(dataFolks)
    setImgsrc({
      value: params?.value,
      id: dataFolks?.folks?.[0]?.id,
      fio: dataFolks?.folks?.[0]?.fio,
      base_photo: (photo.status === 'success') ? photo?.photos[0]?.base64 || '' : '',
      phone: dataFolks?.folks?.[0]?.phone,
      email: dataFolks?.folks?.[0]?.email,
      dt_log: moment(params?.row?.dt_log).format('DD.MM.YYYY HH:mm:ss'),
      dateborn: moment(dataFolks?.folks?.[0]?.dateborn).format('DD.MM.YYYY')
    });
    setOpen(true);
  }
  const handleClose = () => setOpen(false);

  const getLogs = async () => {
    let login = sessionStorage.getItem('login');
    let password = sessionStorage.getItem('password');

    const res = await fetch('/api/getLogRecognition', {
      method: 'POST',
      body: JSON.stringify({ login, password, limit, offset, getimg: true }),
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
    const filteredColumn = column.clmns.filter(
      (item: any) => ((item.keyTable === 'log_identify') && (item.hide === false))
    );
    const formated = getFormatedColumn(filteredColumn);
    // formated.push();
    const formatedWithImage = [
      {
        field: 'image',
        headerName: 'Фото',
        width: 100,
        editable: true,
        renderCell: (params: any) => (
          <img
            src={params.value}
            alt='Фото проходки'
            style={{ height: '100%', margin: 'auto' }}
            onClick={() => handleOpen(params)}
          />
        ),
      },
      ...formated,
    ];
    setColumns(formatedWithImage);

    if (res.status === 'success') {
      setUserList(res.logs);
      setMaxUsers(res.allcnt || 5);
    }
    setMaxretry(maxRetry + 1);
  };

  const { status, data, error, isFetching } = useQuery(
    'lastEnteredFullList',
    async () => {
      console.log(new Date())
      let login = sessionStorage.getItem('login');
      let password = sessionStorage.getItem('password');
      const res = await fetch('/api/getLogRecognition', {
        method: 'POST',
        body: JSON.stringify({ login, password, limit, offset, getimg: true }),
        headers: {
          'Content-Type': 'application/json',
        },
      }).then((result) => result.json());

      // console.log({ res });
      let users = res.logs;
      users.map((item: any) => {
        if (item.image === '<empty>') {
          item.image = '/images/user.png';
        }
      });

      setUserList(users);
    },
    {
      // Время повторного запроса: 1 сек = 1 • 1000мс
      refetchInterval: 5000,
    }
  );

  useEffect(() => {
    getLogs();
  }, []);

  return (
    <div>
      <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
      >
        <Box sx={{...style}} style={{backgroundColor: 'white'}}>
          <h2 id="parent-modal-title" style={{marginLeft: '20px'}}>ID: {imgsrc.id}</h2>
          <hr/>
          <Grid container spacing={0}>
            <Grid item xs={4} style={{marginLeft: '20px'}}>
              <img src = {imgsrc.value} style={{height: '80%', width: '80%'}}/>
            </Grid>
            <Grid item xs={4}>
              {imgsrc.base_photo !== '' ? (
                  <img src = {imgsrc.base_photo} style={{height: '80%', width: '80%'}}/>
              ) : (
                  <span>
                    Нет в базе
                  </span>
              )}
            </Grid>
            <Grid item xs={3} style={{marginLeft: '20px'}}>
              <Typography sx={{ wordBreak: "break-word" }}>
                <strong>Распознование: </strong><br/>{(imgsrc.fio === undefined) ? 'Не распознан' : 'Распознан'}
              </Typography><br/>
              <Typography sx={{ wordBreak: "break-word" }}>
                <strong> ФИО: </strong><br/>{imgsrc?.fio || null}
              </Typography><br/>
              <Typography sx={{ wordBreak: "break-word" }}>
                <strong>Дата распознования: </strong><br/>{imgsrc?.dt_log || null}
              </Typography><br/>
              <Typography sx={{ wordBreak: "break-word" }}>
                <strong> Телефон: </strong> <br/>{imgsrc?.phone || null}
              </Typography><br/>
              <Typography sx={{ wordBreak: "break-word" }}>
                <strong>Email:</strong><br/> {imgsrc?.email || null}
              </Typography><br/>
              <Typography sx={{ wordBreak: "break-word" }}>
                <strong>Дата рождения: </strong><br/>{imgsrc?.dateborn || null}
              </Typography>
            </Grid>
          </Grid>
        </Box>
      </Modal>
      <Box
        sx={{
          height: '50vh',
        }}
      >
        {userList.length === 0 ? <CircularProgress style={{ marginLeft: '50%', marginTop: '10%'}}/> :
            <DataGridPro
                rows={userList}
                columns={columns}
                pageSize={pageSize}
                sx={{
                  '& .green': {
                    color: '#1bcf12',
                  },
                  '& .red': {
                    color: '#c72828',
                  },
                }}
                onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
                localeText={ruRU.components.MuiDataGrid.defaultProps.localeText}
                // getRowId={(row) => row.id}

                // node_modules/@mui/x-data-grid/DataGrid/useDataGridProps.d.ts; Строчка 3, значение 100 изменить на 500
                // node_modules/@mui/x-data-grid/DataGrid/useDataGridProps.js; Строчка 19, значение 100 изменить на 500
                rowsPerPageOptions={[5, 10, 25]}
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

                // components={{ Toolbar: GridToolbar }}
            />
        }
      </Box>
    </div>
  );
};

export default LogMainGrid;

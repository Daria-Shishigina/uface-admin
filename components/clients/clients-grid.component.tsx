import React, { useState, useEffect, useRef } from 'react';
import {
  DataGridPro,
  ruRU,
  GridToolbar,
  useGridApiContext,
  useGridSelector,
  gridPageSelector,
  gridPageCountSelector,
  GridCsvExportOptions,
  GridToolbarContainer,
  GridToolbarExport,
  GridToolbarColumnsButton,
  GridToolbarDensitySelector,
  GridToolbarFilterButton,
} from '@mui/x-data-grid-pro';

import {DataGrid} from '@mui/x-data-grid';

import {
  Box,
  IconButton,
  MenuItem,
  Pagination,
  Select,
  TextField,
  Button,
  SelectChangeEvent
} from '@mui/material';
import FormHelperText from '@mui/material/FormHelperText';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import InputLabel from '@mui/material/InputLabel';
import ArrowOutwardIcon from '@mui/icons-material/ArrowOutward';

import LoadingSpin from 'react-loading-spin';

//Context
import { useGlobalContext } from 'context/global';

//Styles
import ModalEdit from 'components/modal-edit/modal-edit.component';
import styled from 'styled-components';
import moment from 'moment';
import Modal from "@mui/material/Modal";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import {useQuery} from "react-query";
import CopyAccsToTerminals from "../../pages/api/CopyAccsToTerminals";

export interface IClient {
  dateborn: string;
  activated: any;
  email: string;
  fio: string;
  fname: string;
  lname: string;
  sname: string;
  id: string;
  personid: string;
  phone: string;
  phone_approve: any;
  role: string;
  photo: string;
  vuz_title: string;
  vuz_kod: string;
  role_title: string;
  role_kod: string;
  isCreate: boolean;
}

export interface IPhoto {
  base64: string;
  main: boolean;
  faceid: string;
}

const style = {
  position: 'absolute' as 'absolute',
  top: '5%',
  left: '35%',
  width: '30%',
  height: '50%',
};

const PanelStyles = styled.div`
  display: flex;
  width: 100%;
  justify-content: flex-end;
  align-items: center;

  padding: 10px 5px;

  button {
    border: none;
    padding: 0.3em 1em;
    color: #fff;
    box-shadow: 0 2px 4px rgb(138 149 158 / 20%);
    border-radius: 5px 30px 30px 30px;
    letter-spacing: 0.38px;
    background-color: #2c2c2c;
  }
`;

let selectedBox = [];
let terminalsSelectedBox = [];

const PanelAndFilter = ({ canAddUser, handleOpen, updateAfterRemoveCheckboxes }: { canAddUser: boolean, updateAfterRemoveCheckboxes: any }) => {
  const { setEditUser } = useGlobalContext();

  return (
      <span>
        <h2>
          Пользователи
        </h2>
      <PanelStyles>
        {canAddUser && (
            <button
                type='button'
                onClick={() => {
                  setEditUser({
                    dateborn: '',
                    activated: false,
                    email: '',
                    fio: '',
                    fname: '',
                    lname: '',
                    sname: '',
                    id: '',
                    personid: '',
                    phone: '',
                    phone_approve: false,
                    role: '',
                    photo: '',
                    vuz_title: '',
                    vuz_kod: '',
                    role_title: '',
                    role_kod: '',
                    isCreate: true,
                  });
                }}
            >
              Создать пользователя
            </button>
        )}

        {canAddUser && (
            <button
                type='button'
                onClick={() => handleOpen()}
            >
              Массовое тиражирование
            </button>
        )}

        {canAddUser && (
            <button
                type='button'
                onClick={() => massRemove(updateAfterRemoveCheckboxes)}
            >
              Массовое удаление
            </button>
        )}

      </PanelStyles>
      </span>
  );
};

function massReplication() {
  if (selectedBox.length === 0) return alert('Выберите пользователей')
  let login = sessionStorage.getItem('login');
  let password = sessionStorage.getItem('password');
  for (let i = 0; i < selectedBox.length; i++) {
    let reqParam = {login, password, personid: selectedBox[i].personid};
    fetch('/api/CopyAccsToTerminals', {
      method: 'POST',
      body: JSON.stringify({data: reqParam}),
      headers: {
        'Content-Type': 'application/json',
      }
    });
  }
}

/**
 * Massive remove
 */
function massRemove(updateAfterRemoveCheckboxes) {
  if (selectedBox.length === 0) return alert('Выберите пользователей')
  let login = sessionStorage.getItem('login');
  let password = sessionStorage.getItem('password');
  for (let i = 0; i < selectedBox.length; i++) {
    let reqParam = {login, password, pid: selectedBox[i].personid};
    let delFunc = fetch('/api/delFolk', {
      method: 'DELETE',
      body: JSON.stringify({data: reqParam}),
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
  updateAfterRemoveCheckboxes();
}

function CustomPagination() {
  const apiRef = useGridApiContext();
  const page = useGridSelector(apiRef, gridPageSelector);
  const pageCount = useGridSelector(apiRef, gridPageCountSelector);
  const [pageSize, setPageSize] = useState<number>(20);

  const [pageN, setNavPage] = useState<any>(page + 1);

  return (
      <>
        <div>
          <TextField
              type='number'
              value={pageN}
              onChange={(e: any) => {
                if (e.target.value > pageCount) {
                  setNavPage(pageCount);
                  return;
                }

                setNavPage(e.target.value);
              }}
              defaultValue={pageN}
              size='small'
              variant='outlined'
              hiddenLabel
              label='Перейти на страницу'
              onKeyPress={(e) => {
                if (e.key !== 'Enter') {
                  return;
                }

                apiRef.current.setPage(pageN - 1);
                setNavPage('');
                //@ts-ignore
                e.target.blur();
              }}
          />
        </div>

        <div>
          <Select
              size='small'
              value={pageSize}
              label='Кол-во'
              onChange={(e: any) => {
                setPageSize(e.target.value);
                apiRef.current.setPageSize(e.target.value);
              }}
          >
            <MenuItem value={20}>20</MenuItem>
            <MenuItem value={50}>50</MenuItem>
            <MenuItem value={100}>100</MenuItem>
          </Select>
        </div>

        <Pagination
            color='primary'
            count={pageCount}
            page={page + 1}
            showFirstButton
            showLastButton
            onChange={(event, value) => apiRef.current.setPage(value - 1)}
        />

        <span>
        Страница {page + 1} из {pageCount}
      </span>
      </>
  );
}

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

const VisitorsGrid = () => {
  const [columns, setColumns] = useState<any[]>([]);

  //Примитивный роутинг
  const [limit, setLimit] = useState(20);
  const [pageSize, setPageSize] = useState<number>(20);
  const [page, setPage] = useState<number>(0);
  const [offset, setOffset] = useState<number>(0);
  const [maxUsers, setMaxUsers] = useState(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [open, setOpen] = useState(false);
  const handleOpen = () => {
    if (selectedBox.length === 0) return alert('Выберите пользователей')
    setOpen(true);
  }
  const handleClose = () => setOpen(false);
  let [clients, setClients] = useState<IClient[]>([]);

  const { user, setEditUser } = useGlobalContext();

  const [canReadLogs, setCanReadLogs] = useState(false);
  const [canEditUser, setCanEditUser] = useState(false);
  const [canAddUser, setCanAddUser] = useState(false);
  const [replicationType, setReplicationType] = React.useState('CopyAccsToTerminals');

  // Алексей Давыдулин, [4 Jun 2022, 10:29:32 PM]:
  // 3 - это просмотр
  // 1 - добавление
  // 2 - редактироанте

  useEffect(() => {
    user?.roles.map((item) =>
        item.authorities.map((authItem) => {
          if (authItem.authority_kod === 'users') {
            // console.log({ authItem });
            setCanReadLogs(true);
            authItem.authority_fields.map((fieldItem) => {
              // console.log({ fieldItem });
              if (
                  fieldItem.field_kod === 'ACTIV' &&
                  fieldItem.field_value.includes('1')
              ) {
                setCanAddUser(true);
                setCanEditUser(true);
              }
              if (
                  fieldItem.field_kod === 'ACTIV' &&
                  fieldItem.field_value.includes('2')
              ) {
                setCanEditUser(true);
              }
            });
          }
        })
    );
  }, [user]);

  useEffect(() => {
    getFolks();
  }, [offset, limit]);

  let stateColumn: any[] = [];
  const getFormatedColumn = (filteredColumn: any[]) => {
    filteredColumn.map((cs: any) => {
      if (cs.hide === true) return;
      if (
          cs.key.toLowerCase() === 'date_created' ||
          cs.key.toLowerCase() === 'date_updated'
      ) {
        stateColumn.push({
          field: cs.key.toLowerCase(),
          headerName: cs.nameColumn,
          width: cs.width,
          hide: cs.hide,
          renderCell: (params: any) => (
              <span>{moment(params.value).format('DD.MM.YYYY  hh:mm:ss')}</span>
          ),
          // hide: true,
        });
      } else if (cs.key.toLowerCase() === 'dateborn') {
        stateColumn.push({
          field: cs.key.toLowerCase(),
          headerName: cs.nameColumn,
          width: cs.width,
          hide: cs.hide,
          renderCell: (params: any) => (
              <span>{moment(params.value).format('DD.MM.YYYY')}</span>
          ),
          // hide: true,
        });
      } else {
        stateColumn.push({
          field: cs.key.toLowerCase(),
          headerName: cs.nameColumn,
          width: cs.width,
          hide: cs.hide,
        });
      }
    });

    return stateColumn;
  };

  let stateTColumn: any[] = [];
  const getFormatedTColumn = (filteredColumn: any[]) => {
    filteredColumn.map((cs: any) => {
      stateTColumn.push({
        field: cs.key,
        headerName: cs.nameColumn,
        width: cs.width,
        hide: cs.hide,
      });
    });

    return stateTColumn;
  };

  //Получить список пользователей
  const getFolks = async () => {
    setLoading(true);

    let login = sessionStorage.getItem('login');
    let password = sessionStorage.getItem('password');

    //20, 50, 100, 200, 500

    // const user = { login, password, limit, offset: offset * limit };
    const user = { login, password, limit: 10000, offset: 0 };
    const res = await fetch('/api/folks', {
      method: 'POST',
      body: JSON.stringify({ user }),
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const data = await res.json();
    console.log(123321)
    console.log(data)

    const columnsReq = await fetch('/api/column-names', {
      method: 'POST',
      body: JSON.stringify({ login: user.login, password: user.password }),
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const column = await columnsReq.json();
    // console.log(column);
    const filteredColumn = column?.clmns.filter(
        (item: any) => item.keyTable === 'folk'
    );

    // console.log({ column });

    const formated = getFormatedColumn(filteredColumn);
    const formatedWithButtons = [
      {
        field: 'action',
        headerName: 'Действия',
        width: 160, //test
        sortable: false,
        renderCell: (params: any) => {
          const editFolk = (e: any) => {
            e.stopPropagation();
            // console.log({ params, e });

            setEditUser(params.row);
          };

          const deleteFolk = async (e: any) => {
            e.stopPropagation();

            let login = sessionStorage.getItem('login');
            let password = sessionStorage.getItem('password');

            let reqParam = {login, password, pid: params.row.personid};
            let delFunc = fetch('/api/delFolk', {
              method: 'DELETE',
              body: JSON.stringify({data: reqParam}),
              headers: {
                'Content-Type': 'application/json',
              },
            });

            data.folks = data.folks.filter(el => (el.personid !== params.row.personid));
            setClients(data.folks);
          };

          const replication = async (e: any) => {
            let reqPar = {
              login: sessionStorage.getItem('login'),
              password: sessionStorage.getItem('password'),
              personid: params.row.personid,
            };

            await fetch('/api/CopyAccsToTerminals', {
              method: 'POST',
              body: JSON.stringify({data: reqPar}),
              headers: {
                'Content-Type': 'application/json',
              }
            });
          }

          return (
              <>
                <IconButton aria-label='Редактировать' onClick={editFolk}>
                  <EditIcon />
                </IconButton>
                <IconButton aria-label='Удалить' onClick={deleteFolk}>
                  <DeleteIcon />
                </IconButton>
                <IconButton aria-label='Тиражирование' onClick={replication}>
                  <ArrowOutwardIcon />
                </IconButton>
              </>
          );
        },
      },
      ...formated,
    ];
    setColumns(formatedWithButtons);
    setLoading(false);
    setClients(data.folks);
    setMaxUsers(data.allcnt);
  };

  const [tcolumns, setTcolumns] = useState<any[]>([]);
  const { status, data: terminalsData, error, isFetching } = useQuery(
      'terminals',
      async () => {
        let login = sessionStorage.getItem('login');
        let password = sessionStorage.getItem('password');

        const res = await fetch('/api/getTerminals', {
          method: 'POST',
          body: JSON.stringify({login, password}),
          headers: {
            'Content-Type': 'application/json',
          },
        }); //.then((result) => result.json());
        const resData = await res.json();

        const columnsReq = await fetch('/api/column-names', {
          method: 'POST',
          body: JSON.stringify({login, password}),
          headers: {
            'Content-Type': 'application/json',
          },
        });
        const column = await columnsReq.json();
        console.log({column});
        const filteredColumn = column?.clmns.filter(
            (item: any) => item.keyTable === 'terminals'
        );

        const formated = getFormatedTColumn(filteredColumn);
        setTcolumns(formated);
        console.log({resData});
        return resData.terms;
        // return res.terms;
      }
  );

  const onRowsSelectionHandler = (ids) => {
    selectedBox = [];
    ids.forEach(id => {
      selectedBox.push(clients.find(el => el.id === id));
    })
  };

  const onTerminalsSelectionHandler = (ids) => {
    terminalsSelectedBox = [];
    ids.forEach(id => {
      terminalsSelectedBox.push(terminalsData.find(el => el.id === id));
    })
  };

  // Update
  const updateAfterRemoveCheckboxes = () => {
    for (let i = 0; i < selectedBox.length; i++) {
      clients = clients.filter(el => (el.personid !== selectedBox[i].personid));
      setClients(clients);
    }
  }

  const changeReplicationType = (event: SelectChangeEvent) => {
    setReplicationType(event.target.value);
  };

  async function submitMassReplication() {
    if (terminalsSelectedBox.length === 0) return alert('Выберите терминал');
    let login = sessionStorage.getItem('login');
    let password = sessionStorage.getItem('password');
    for (let i = 0; i < selectedBox.length; i++) {
      for (let s = 0; s < terminalsSelectedBox.length; s++) {
        let terminalUri = `http://${terminalsSelectedBox[s].ip}:${terminalsSelectedBox[s].port}`;
        let uri = `/api/${replicationType}`;
        let reqParam = {login, password, personid: selectedBox[i].personid, terminal: terminalUri};
        fetch(uri, {
          method: 'POST',
          body: JSON.stringify({data: reqParam}),
          headers: {
            'Content-Type': 'application/json',
          }
        });
      }
    }
    handleClose();
  }

  return (
      <>

        <PanelAndFilter canAddUser={canAddUser} handleOpen={handleOpen} updateAfterRemoveCheckboxes={updateAfterRemoveCheckboxes} />

        <div style={{ height: '80vh' }}>
          <Modal
              open={open}
              onClose={handleClose}
              aria-labelledby="modal-modal-title"
              aria-describedby="modal-modal-description"
          >
            <Box sx={{...style}} style={{backgroundColor: 'white'}}>
              <h2 id="parent-modal-title" style={{marginLeft: '20px'}}>Список терминалов</h2><hr/>
              <div>
                <Select
                    labelId="demo-simple-select-helper-label"
                    id="demo-simple-select-helper"
                    value={replicationType}
                    onChange={changeReplicationType}
                    style={{width: '100%'}}
                >
                  <MenuItem value={'CopyAccsToTerminals'}>Тиражирование без фото</MenuItem>
                  <MenuItem value={'EditAccsToTerminals'}>Тиражирование без фото (изменение данных)</MenuItem>
                  <MenuItem value={'CopyAccsFacesToTerminals'}>Тиражирование с фото</MenuItem>
                  <MenuItem value={'EditAccsFacesToTerminals'}>Тиражирование с фото (изменение данных)</MenuItem>
                </Select>
                <FormHelperText>Тип тиражирования</FormHelperText>
              </div><br/>



              <DataGrid
                  style={{backgroundColor: 'white'}}
                  rows={terminalsData}
                  columns={tcolumns}
                  localeText={ruRU.components.MuiDataGrid.defaultProps.localeText}
                  checkboxSelection
                  onSelectionModelChange={(ids) => onTerminalsSelectionHandler(ids)}
                  disableSelectionOnClick
                />
                <div style={{backgroundColor: 'white'}}>
                  <Grid container justifyContent="flex-end">
                    <Button variant="contained" onClick={(_) => submitMassReplication()}>Подтвердить</Button>
                  </Grid>
                </div>
            </Box>
          </Modal>

          <DataGridPro
              rows={clients}
              onSelectionModelChange={(ids) => onRowsSelectionHandler(ids)}
              columns={columns}
              pageSize={pageSize}
              // autoHeight
              loading={loading}
              localeText={ruRU.components.MuiDataGrid.defaultProps.localeText}
              onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
              onPageChange={(newPage) => setPage(newPage)}
              // getRowId={(row) => row.id}

              // Для работы фильтра выше 100, в корневой папке node_modules необходимо изменить содержание по примеру ниже:
              // node_modules/@mui/x-data-grid/DataGrid/useDataGridProps.d.ts; Строчка 3, значение 100 изменить на 500
              // node_modules/@mui/x-data-grid/DataGrid/useDataGridProps.js; Строчка 19, значение 100 изменить на 500
              rowsPerPageOptions={[20, 50, 100, 200, 500]}
              checkboxSelection
              disableSelectionOnClick
              components={{ Toolbar: CustomToolbar, Pagination: CustomPagination }}
              componentsProps={
                {
                  // pagination: {
                  //   labelRowsPerPage: 'Количество на странице',
                  //   labelDisplayedRows: ({ from, to, count, page }: any) => {
                  //     return `Страница ${page + 1} из ${Math.ceil(count / pageSize)}`;
                  //   },
                  //   // count: 1,
                  //   // page: 0,
                  //   // component: 'div', // here
                  //   // onPageChange: () => {},
                  //   // onRowsPerPageChange: () => {},
                  //   // nextIconButtonProps: {
                  //   //   disabled: true,
                  //   // },
                  // },
                }
              }
          />
        </div>
        <ModalEdit func={getFolks}/>
      </>
  );
};

export default VisitorsGrid;

import React, {useEffect, useState} from 'react';
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
import {Avatar, Box, Card, CardContent, CircularProgress, IconButton, Typography} from '@mui/material';
import {IStudent} from './log-list.interfaces';
import {LocalizationProvider} from "@mui/x-date-pickers/LocalizationProvider";
import {AdapterDayjs} from "@mui/x-date-pickers/AdapterDayjs";
import {DateTimePicker} from "@mui/x-date-pickers/DateTimePicker";
import TextField from "@mui/material/TextField";
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import MoneyIcon from "@mui/icons-material/Money";
import InsertChartIcon from "@mui/icons-material/InsertChartOutlined";
import PeopleIcon from "@mui/icons-material/PeopleOutlined";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import ArrowOutwardIcon from "@mui/icons-material/ArrowOutward";
import PersonIcon from "@mui/icons-material/Person";
import Modal from "@mui/material/Modal";

const style = {
    position: 'absolute' as 'absolute',
    top: '15%',
    left: '12%',
    width: '76%',
    height: '70%',
};

let stateColumn: any[] = [];
const getFormatedColumn = (filteredColumn: any[]) => {
    stateColumn = [];
    filteredColumn.map((cs: any) => {
        if (Boolean(cs.hide) === true) return;
        if (cs.key === 'dt_log') {
            stateColumn.push({
                field: cs.key,
                headerName: cs.nameColumn,
                width: cs.width,
                hide: false, //
                renderCell: (params: any) => (
                    <span>{moment(params.value).format('DD.MM.YYYY  HH:mm:ss')}</span>
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
            <GridToolbarColumnsButton/>
            <GridToolbarFilterButton/>
            <GridToolbarDensitySelector/>
            <GridToolbarExport csvOptions={{utf8WithBom: true, delimiter: ';'}}/>
        </GridToolbarContainer>
    );
}

const LogGrid = () => {
    const [userList, setUserList] = useState<IStudent[]>([]);

    //Примитивный роутинг
    const [limit, setLimit] = useState();
    const [offset, setOffset] = useState<number>(0);
    const [columns, setColumns] = useState<any[]>([]);
    const [pageSize, setPageSize] = useState<number>(20);
    const [maxRetry, setMaxretry] = useState<number>(0);
    const [startDate, setStartDate] = useState(moment().startOf('day'));
    const [endDate, setEndDate] = useState(moment());
    const [totalUserPeriod, setTotalUserPeriod] = useState<any>(0);
    const [totalUserPeriodEntry, setTotalUserPeriodEntry] = useState<any>(0);
    const [totalUserPeriodExit, setTotalUserPeriodExit] = useState<any>(0);
    const [totalPersons, setTotalPersons] = useState<any>(0);
    const [open, setOpen] = useState<any>(false);
    const [modalData, setModalData] = useState<any>({});

    const getLogs = async () => {
        // if (maxRetry >= 3) return false; // TODO ???
        let login = sessionStorage.getItem('login');
        let password = sessionStorage.getItem('password');
        const res = await fetch('/api/getLogRecognition', {
            method: 'POST',
            body: JSON.stringify({
                login,
                password,
                limit,
                offset,
                getimg: false,
                from_d: startDate.format('DD.MM.YYYY HH:mm:ss'),
                to_d: endDate.format('DD.MM.YYYY HH:mm:ss'),
            }),
            headers: {
                'Content-Type': 'application/json',
            },
        }).then((result) => result.json());
        setTotalUserPeriod(res.curcnt);
        let entry = 0;
        let exit = 0;
        res.logs.forEach(el => {
            if (el.inout === 'Вход') entry += 1;
            if (el.inout === 'Выход') exit += 1;
        })
        setTotalUserPeriodExit(exit)
        setTotalUserPeriodEntry(entry)

        const columnsReq = await fetch('/api/column-names', {
            method: 'POST',
            body: JSON.stringify({login, password}),
            headers: {
                'Content-Type': 'application/json',
            },
        });
        const column = await columnsReq.json();
        const filteredColumn = column?.clmns.filter(
            (item: any) => item.keyTable === 'log_identify'
        );
        setMaxretry(maxRetry + 1);
        let formated = await getFormatedColumn(filteredColumn);
        // let formated = [{"field":"dt_log","headerName":"Дата распознования","width":160,"hide":false}, {"field":"fio","headerName":"ФИО","width":240,"hide":false}, {"field":"id","headerName":"ид.лог","width":60,"hide":false}, {"field":"identifyType","headerName":"Результат распозн.","width":140,"hide":false}, {"field":"local_ip_terminal","headerName":"IP-адрес","width":120,"hide":false}, {"field":"local_ip_terminal","headerName":"IP-адрес","width":120,"hide":false}, {"field":"maskState","headerName":"Наличие маски","width":120,"hide":false}, {"field":"personId","headerName":"Ид. персоны UFACE","width":280,"hide":false}, {"field":"std_temperature","headerName":"Стд. темп.","width":90,"hide":false}, {"field":"temperature","headerName":"Темп.","width":60,"hide":false}, {"field":"temperatureState","headerName":"Сост. по темп.","width":120,"hide":false}, {"field":"tempUnit","headerName":"ЕИ темп.","width":90,"hide":false}, {"field":"terminal_key","headerName":"S/N терминала","width":160,"hide":false}, {"field":"title_terminal","headerName":"Наименование терминала","width":270,"hide":false}];
        // let formated = [{"field":"aliveType","headerName":"Реальность лица","width":130,"hide":true},{"field":"base64","headerName":"base64","width":140,"hide":true},{"field":"data","headerName":"данные","width":140,"hide":true},{"field":"dt_log","headerName":"Дата распознования","width":160,"hide":false},{"field":"fio","headerName":"ФИО","width":240,"hide":false},{"field":"hasPhoto","headerName":"наличие фото","width":60,"hide":true},{"field":"id","headerName":"ид.лог","width":60,"hide":false},{"field":"idcardNum","headerName":"ид. карты","width":60,"hide":true},{"field":"identifyType","headerName":"Результат распозн.","width":140,"hide":false},{"field":"id_terminal","headerName":"вн. ключ на ид. терминала","width":100,"hide":true},{"field":"local_ip_terminal","headerName":"IP-адрес","width":120,"hide":false},{"field":"maskState","headerName":"Наличие маски","width":120,"hide":false},{"field":"model","headerName":"Модел распознавания","width":180,"hide":true},{"field":"passTimeType","headerName":"Провера на период","width":175,"hide":true},{"field":"path","headerName":"Путь к файлу","width":160,"hide":true},{"field":"permissionTimeType","headerName":"Полномочия на период","width":175,"hide":true},{"field":"personId","headerName":"Ид. персоны UFACE","width":280,"hide":false},{"field":"qrCode","headerName":"QR-код","width":140,"hide":true},{"field":"recModeType","headerName":"Режим распознавания","width":280,"hide":true},{"field":"recType","headerName":"Способ распознавания","width":250,"hide":true},{"field":"std_temperature","headerName":"Стд. темп.","width":90,"hide":false},{"field":"temperature","headerName":"Темп.","width":60,"hide":false},{"field":"temperatureState","headerName":"Сост. по темп.","width":120,"hide":false},{"field":"tempUnit","headerName":"ЕИ темп.","width":90,"hide":false},{"field":"terminal_key","headerName":"S/N терминала","width":160,"hide":false},{"field":"title_terminal","headerName":"Наименование терминала","width":270,"hide":false},{"field":"type","headerName":"Тип метода распознавания","width":250,"hide":true}]
        const formatedWithButtons = [
            {
                field: 'action',
                headerName: 'Данные',
                width: 80, //test
                sortable: false,
                renderCell: (params: any) => {
                    const perSettings = async (e: any) => {
                        e.stopPropagation();
                        await updatePersonUserData(params.row.personId, params.row.id, params.row.dt_log)
                        setOpen(true)
                    };

                    return (
                        <>
                            <IconButton aria-label='Персональный настройки' onClick={perSettings}>
                                <PersonIcon/>
                            </IconButton>
                        </>
                    );
                },
            },
            ...formated,
        ];
        setColumns(formatedWithButtons);
        if (res.status === 'success') {
            setUserList(res.logs);
        }
    };

    async function updatePersonUserData(personId, id, dt_log) {
        let login = sessionStorage.getItem('login');
        let password = sessionStorage.getItem('password');
        const user = {login, password, pid: personId};
        const folks = await fetch('/api/folks', {
            method: 'POST',
            body: JSON.stringify({user}),
            headers: {
                'Content-Type': 'application/json',
            },
        });

        const dataFolks = await folks.json();
        const userData = { login, password, height: 200, pid: personId };
        const resPhoto = await fetch('/api/getPhotoFolk', {
            method: 'POST',
            body: JSON.stringify({ userData }),
            headers: {
                'Content-Type': 'application/json',
            },
        });
        const photo: any = await resPhoto.json();

       const logPhoto = await fetch('/api/getLogRecognition', {
            method: 'POST',
            body: JSON.stringify({ login, password, limit, offset, getimg: true, id: id}),
            headers: {
                'Content-Type': 'application/json',
            },
        }).then((result) => result.json());

        setModalData({
            // value: params?.value,
            value: logPhoto.logs?.[0].image,
            id: dataFolks?.folks?.[0]?.id,
            fio: dataFolks?.folks?.[0]?.fio,
            base_photo: (photo.status === 'success') ? photo?.photos[0]?.base64 || '' : '',
            phone: dataFolks?.folks?.[0]?.phone,
            email: dataFolks?.folks?.[0]?.email,
            dt_log: moment(dt_log).format('DD.MM.YYYY HH:mm:ss'),
            dateborn: moment(dataFolks?.folks?.[0]?.dateborn).format('DD.MM.YYYY')
        });
    }

    // useEffect(() => {
    //     getLogs();
    // }, [offset, userList, limit]);
    // }, [offset, userList, limit]);

    return (
        <div>

            <Modal
                open={open}
                onClose={() => {
                    setOpen(false)
                }}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={{...style}} style={{backgroundColor: 'white'}}>
                    <h2 id="parent-modal-title" style={{marginLeft: '20px'}}>ID: {modalData.id}</h2>
                    <hr/>
                    <Grid container spacing={0}>
                        <Grid item xs={4} style={{marginLeft: '20px'}}>
                            {modalData.value !== '<empty>' ? (
                            <img src={modalData.value} style={{height: '80%', width: '80%'}}/>
                            ) : (
                              <img src = '/images/img_usr.png' style={{height: '80%', width: '80%'}}/>
                              // <span>Отсутствует фото с терминала</span>
                            )}
                        </Grid>
                        <Grid item xs={4}>
                            {modalData.base_photo !== '' ? (
                                <img src={modalData.base_photo} style={{height: '80%', width: '80%'}}/>
                            ) : (
                                // <span>Нет в базе</span>
                              <img src = '/images/img_usr.png' style={{height: '80%', width: '80%'}}/>
                            )}
                        </Grid>
                        <Grid item xs={3} style={{marginLeft: '20px'}}>
                            <Typography sx={{wordBreak: "break-word"}}>
                                <strong>Распознование:</strong><br/>{(modalData.fio === undefined) ? 'Не распознан' : 'Распознан'}
                            </Typography><br/>
                            <Typography sx={{wordBreak: "break-word"}}>
                                <strong> ФИО: </strong><br/>{modalData?.fio || null}
                            </Typography><br/>
                            <Typography sx={{wordBreak: "break-word"}}>
                                <strong>Дата распознования: </strong><br/>{modalData?.dt_log || null}
                            </Typography><br/>
                            <Typography sx={{wordBreak: "break-word"}}>
                                <strong> Телефон: </strong> <br/>{modalData?.phone || null}
                            </Typography><br/>
                            <Typography sx={{wordBreak: "break-word"}}>
                                <strong>Email:</strong><br/> {modalData?.email || null}
                            </Typography><br/>
                            <Typography sx={{wordBreak: "break-word"}}>
                                <strong>Дата рождения: </strong><br/>{modalData?.dateborn || null}
                            </Typography>
                        </Grid>
                    </Grid>
                </Box>
            </Modal>

            <Grid container spacing={6}>
                <Grid item xs={8} md={8}>
                    <h1>Последние проходы</h1>
                    <br/>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DateTimePicker
                            inputFormat={'DD.MM.YYYY HH:mm'}
                            label="C:"
                            ampm={false}
                            value={startDate}
                            onChange={(val) => {
                                setStartDate(moment(val['$d']))
                            }}
                            renderInput={(params) => <TextField {...params} size="small"/>}
                        />&nbsp;&nbsp;&nbsp;
                        <DateTimePicker
                            inputFormat={'DD.MM.YYYY HH:mm'}
                            label="По:"
                            ampm={false}
                            value={endDate}
                            onChange={(val) => {
                                setEndDate(moment(val['$d']))
                            }}
                            renderInput={(params) => <TextField {...params} size="small"/>}
                        />
                    </LocalizationProvider>&nbsp;&nbsp;&nbsp;
                    <Button variant="contained" size="small" onClick={getLogs}
                            style={{marginTop: '5px'}}>Отобразить</Button>
                    <br/><br/>
                </Grid>
                <Grid item xs={4} md={4}>
                    <Grid container spacing={5}>


                        <Grid item xs={6} md={6}>
                            <Card
                                sx={{height: '80%'}}
                            >
                                <CardContent>
                                    <Grid
                                        container
                                        spacing={3}
                                        sx={{justifyContent: 'space-between'}}
                                    >
                                        <Grid item>
                                            <Typography
                                                color="textSecondary"
                                                gutterBottom
                                                variant="overline"
                                                fontSize={8}
                                            >
                                                Количество распознаваний
                                            </Typography><br/><br/>
                                            <Grid container>
                                                <Grid sx={6} md={6}>
                                                    <Typography
                                                        color="textPrimary"
                                                        //variant="h4"
                                                        fontSize={14}
                                                    >
                                                        {totalUserPeriod}
                                                    </Typography>
                                                </Grid>
                                                <Grid sx={6} md={6}>
                                                    <Avatar style={{float: 'right'}}
                                                            sx={{
                                                                backgroundColor: '#ee1445',
                                                                height: 30,
                                                                width: 30
                                                            }}
                                                    >
                                                        <MoneyIcon/>
                                                    </Avatar>
                                                </Grid>
                                            </Grid>
                                        </Grid>
                                        <Grid item>
                                        </Grid>
                                    </Grid>
                                </CardContent>
                            </Card>
                        </Grid>
                        <Grid item xs={6} md={6}>
                            <Card
                                sx={{height: '80%'}}
                            >
                                <CardContent>
                                    <Grid
                                        container
                                        spacing={3}
                                        sx={{justifyContent: 'space-between'}}
                                    >
                                        <Grid item>
                                            <Typography
                                                color="textSecondary"
                                                gutterBottom
                                                variant="overline"
                                                fontSize={8}
                                            >
                                                Количество на ВХОД
                                            </Typography><br/><br/>
                                            <Grid container>
                                                <Grid sx={6} md={6}>
                                                    <Typography
                                                        color="textPrimary"
                                                        //variant="h4"
                                                        fontSize={14}
                                                    >
                                                        {totalUserPeriodEntry}
                                                    </Typography>
                                                </Grid>
                                                <Grid sx={6} md={6}>
                                                    <Avatar style={{float: 'right'}}
                                                            sx={{
                                                                backgroundColor: 'success.main',
                                                                height: 30,
                                                                width: 30
                                                            }}
                                                    >
                                                        <InsertChartIcon/>
                                                    </Avatar>
                                                </Grid>
                                            </Grid>
                                        </Grid>
                                        <Grid item>
                                        </Grid>
                                    </Grid>
                                </CardContent>
                            </Card>
                        </Grid>
                        <Grid item style={{marginTop: '-10%'}} xs={6} md={6}>
                            <Card
                                sx={{height: '80%'}}
                            >
                                <CardContent>
                                    <Grid
                                        container
                                        spacing={3}
                                        sx={{justifyContent: 'space-between'}}
                                    >
                                        <Grid item>
                                            <Typography
                                                color="textSecondary"
                                                gutterBottom
                                                variant="overline"
                                                fontSize={8}
                                            >
                                                Количество на ВЫХОД
                                            </Typography><br/><br/>
                                            <Grid container>
                                                <Grid sx={6} md={6}>
                                                    <Typography
                                                        color="textPrimary"
                                                        //variant="h4"
                                                        fontSize={14}
                                                    >
                                                        {totalUserPeriodExit}
                                                    </Typography>
                                                </Grid>
                                                <Grid sx={6} md={6}>
                                                    <Avatar style={{float: 'right'}}
                                                            sx={{
                                                                backgroundColor: 'warning.main',
                                                                height: 30,
                                                                width: 30
                                                            }}
                                                    >
                                                        <InsertChartIcon/>
                                                    </Avatar>
                                                </Grid>
                                            </Grid>
                                        </Grid>
                                        <Grid item>
                                        </Grid>
                                    </Grid>
                                </CardContent>
                            </Card>
                        </Grid>
                        {/*<Grid item style={{marginTop: '-10%'}} xs={6}  md={6}>*/}
                        {/*    <Card*/}
                        {/*        sx={{ height: '80%' }}*/}
                        {/*    >*/}
                        {/*        <CardContent>*/}
                        {/*            <Grid*/}
                        {/*                container*/}
                        {/*                spacing={3}*/}
                        {/*                sx={{ justifyContent: 'space-between' }}*/}
                        {/*            >*/}
                        {/*                <Grid item>*/}
                        {/*                    <Typography*/}
                        {/*                        color="textSecondary"*/}
                        {/*                        gutterBottom*/}
                        {/*                        variant="overline"*/}
                        {/*                        fontSize={8}*/}
                        {/*                    >*/}
                        {/*                        Общее количество пользователей*/}
                        {/*                    </Typography><br/><br/>*/}
                        {/*                    <Grid container>*/}
                        {/*                        <Grid sx={6} md={6}>*/}
                        {/*                            <Typography*/}
                        {/*                                color="textPrimary"*/}
                        {/*                                //variant="h4"*/}
                        {/*                                fontSize={14}*/}
                        {/*                            >*/}
                        {/*                                {totalPersons}*/}
                        {/*                            </Typography>*/}
                        {/*                        </Grid>*/}
                        {/*                        <Grid sx={6} md={6}>*/}
                        {/*                            <Avatar style={{float: 'right'}}*/}
                        {/*                                    sx={{*/}
                        {/*                                        backgroundColor: 'primary.main',*/}
                        {/*                                        height: 30,*/}
                        {/*                                        width: 30*/}
                        {/*                                    }}*/}
                        {/*                            >*/}
                        {/*                                <PeopleIcon />*/}
                        {/*                            </Avatar>*/}
                        {/*                        </Grid>*/}
                        {/*                    </Grid>*/}
                        {/*                </Grid>*/}
                        {/*                <Grid item>*/}
                        {/*                </Grid>*/}
                        {/*            </Grid>*/}
                        {/*        </CardContent>*/}
                        {/*    </Card>*/}
                        {/*</Grid>*/}

                    </Grid>
                </Grid>
            </Grid>
            <div style={{height: '80vh'}}>
                {/*{userList.length === 0 ? <CircularProgress style={{marginLeft: '50%', marginTop: '10%'}}/> :*/}
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
                    components={{Toolbar: CustomToolbar}}
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
                            labelDisplayedRows: ({from, to, count, page}: any) =>
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
                />}
            </div>
        </div>
    );
};

export default LogGrid;

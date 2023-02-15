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
import { CircularProgress } from '@mui/material';

import {IStudent} from './log-list.interfaces';

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
    const [limit, setLimit] = useState(1000);
    const [offset, setOffset] = useState<number>(0);
    const [columns, setColumns] = useState<any[]>([]);
    const [pageSize, setPageSize] = useState<number>(20);
    const [maxRetry, setMaxretry] = useState<number>(0);

    const getLogs = async () => {
        console.log('new')
        if (maxRetry >= 3) return false; // TODO ???
        let login = sessionStorage.getItem('login');
        let password = sessionStorage.getItem('password');
        const res = await fetch('/api/getLogRecognition', {
            method: 'POST',
            body: JSON.stringify({login, password, limit, offset, getimg: false}),
            headers: {
                'Content-Type': 'application/json',
            },
        }).then((result) => result.json());

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
        setColumns(formated);
        if (res.status === 'success') {
            setUserList(res.logs);
        }
    };

    useEffect(() => {
        getLogs();
    }, [offset, userList, limit]);
    // }, [offset, userList, limit]);

    return (
        <div>
            <h1>Последние проходы</h1>
            <div style={{height: '80vh'}}>
                {userList.length === 0 ? <CircularProgress style={{ marginLeft: '50%', marginTop: '10%'}}/> :
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
                /> }
            </div>
        </div>
    );
};

export default LogGrid;

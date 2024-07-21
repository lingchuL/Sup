'use client'
import {Autocomplete, TextField} from "@mui/material";
import * as React from "react";
import {useEffect} from "react";
import Button from "@mui/material/Button";
import {CallDatabasePost} from "@/app/api/route_api";
import {TableData} from "@/app/utils/cells_table";

import Box from '@mui/material/Box';
import {DataGrid, GridColDef, GridFilterModel, GridLogicOperator, useGridApiRef} from '@mui/x-data-grid';
import {ResultResp} from "@/app/utils/util_def";

interface TbNamesResp {
    result: string[]
    status_code: string
}

interface JDBResp {
    result: TableData,
    status_code: string
}

interface JDBProps {
    filterModel?: GridFilterModel
}

function getTbCol(columns: GridColDef[], key_name: string) {
    for (let i = 0; i < columns.length; i++) {
        if (key_name == columns[i].field){
            return columns[i]
        }
    }
}

function transformTbColumns(columns: GridColDef[]): GridColDef[] {
    let editedCols = []
    editedCols.push({...getTbCol(columns, "index"), ...{"width": 90, "editable": true, "type": "number"}})
    editedCols.push({...getTbCol(columns, "firstName"), ...{"width": 150, "editable": true}})
    editedCols.push({...getTbCol(columns, "lastName"), ...{"width": 150, "editable": true,
            "renderCell": (params: any) => (
                <div style={{whiteSpace: "pre-line", lineHeight: "normal"}}>
                    {params.value}
                </div>
            ),
            renderEditCell: (params: any) => {
                const handleKeyDown = (event: any) => {
                    if (event.key === "Enter" && event.shiftKey) {
                        event.stopPropagation()
                    }
                }
                return (
                    <div style={{whiteSpace: "pre-line", lineHeight: "1.5"}}>
                        <textarea
                            value={params.value}
                            onChange={(v) => {
                                const vp = {"id": params.id, "field": params.field, "value": v.target.value}
                                params.api.setEditCellValue(vp)
                            }}
                            onKeyDown={handleKeyDown}
                        />
                    </div>
                )
            }
        }})
    editedCols.push({...getTbCol(columns, "age"), ...{"type": "number", "width": 110, "editable": true}})

    let columnsForShow = [...columns]
    for (let i = 0; i < editedCols.length; i++) {
        for (let j = 0; j < columnsForShow.length; j++) {
            if (columnsForShow[j].field === editedCols[i].field) {
                // @ts-ignore
                columnsForShow[j] = editedCols[i]
            }
        }
    }
    return columnsForShow
}

export default function JsonDatabaseUIPage(props: JDBProps) {
    const [dbNames, setDbNames] = React.useState<string[]>([])
    const [dbName, setDbName] = React.useState("")
    const [inputDbName, setInputDbName] = React.useState("")
    const [tbNames, setTbNames] = React.useState<string[]>([])
    const [tbName, setTbName] = React.useState("")
    const [inputTbName, setInputTbName] = React.useState("")
    const [filterModel, setFilterModel] = React.useState<GridFilterModel>({items: [{"field": "field", "operator": "=", "value": "value"}]})

    const [tbColumns, setTbColumns] = React.useState<GridColDef[]>([])
    const [tbColumnsForShow, setTbColumnsForShow] = React.useState<GridColDef[]>([])
    const [rows, setRows] = React.useState<[]>([])

    const [colName, setColName] = React.useState("")
    const [colWidth, setColWidth] = React.useState(100)

    const apiRef = useGridApiRef()

    useEffect(() => {
        getAllJDB()
        console.log(props)
        if (props != undefined && props.filterModel != undefined) setFilterModel(props.filterModel);
    }, []);

    function addJDBDb() {
        let params = new Map<string, string>()
        params.set("action", "add_jdb_db")
        params.set("db_name", dbName)
        let post_params = new FormData()
        CallDatabasePost(params, post_params).then((res) => {
            console.log(res)
            const resp: ResultResp = JSON.parse(res);
            // console.log(resp.result)
        })
    }

    function addJDBTb() {
        let params = new Map<string, string>()
        params.set("action", "add_jdb_tb")
        params.set("db_name", dbName)
        params.set("tb_name", tbName)
        let post_params = new FormData()
        CallDatabasePost(params, post_params).then((res) => {
            console.log(res)
            const resp: ResultResp = JSON.parse(res);
            // console.log(resp.result)
        })
    }

    function getAllJDB() {
        let params = new Map<string, string>()
        params.set("action", "get_jdb_db_names")
        let post_params = new FormData()
        CallDatabasePost(params, post_params).then((res) => {
            console.log(res)
            const resp: TbNamesResp = JSON.parse(res);
            console.log(resp.result)
            setDbNames(resp.result)
            setDbName(resp.result[0])
        })
    }

    function queryJDB(in_db_name=dbName) {
        let params = new Map<string, string>()
        params.set("action", "get_jdb_db_tb_names")
        params.set("db_name", in_db_name)
        let post_params = new FormData()
        CallDatabasePost(params, post_params).then((res) => {
            console.log(res)
            const resp: TbNamesResp = JSON.parse(res);
            console.log(resp.result)
            setTbNames(resp.result)
            setTbName(resp.result[0])
        })
    }

    function queryTable(in_tb_name=tbName) {
        let params = new Map<string, string>()
        params.set("action", "get_jdb_tb_data")
        params.set("db_name", dbName)
        params.set("tb_name", in_tb_name)
        let post_params = new FormData()
        CallDatabasePost(params, post_params).then((res) => {
            console.log(res)
            const resp: JDBResp = JSON.parse(res);
            console.log(resp.result)
            let queryResults = resp.result
            setTbColumns(queryResults.columns)
            setTbColumnsForShow(transformTbColumns(queryResults.columns))
            setRows(queryResults.rows)
        })
    }

    function saveTable(newRows: any) {
        let params = new Map<string, string>()
        params.set("action", "save_jdb_tb_data")
        params.set("db_name", dbName)
        params.set("tb_name", tbName)
        let post_params = new FormData()
        console.log(rows)
        post_params.set("tb_data", JSON.stringify({"columns": tbColumns, "rows": newRows}))
        CallDatabasePost(params, post_params).then((res) => {
            console.log(res)
            const resp: JDBResp = JSON.parse(res);
            console.log(resp.result)
            let queryResults = resp.result
            setTbColumns(queryResults.columns)
            setTbColumnsForShow(transformTbColumns(queryResults.columns))
            setRows(queryResults.rows)
        })
    }

    function addRow() {
        let params = new Map<string, string>()
        params.set("action", "add_jdb_row")
        params.set("db_name", dbName)
        params.set("tb_name", tbName)
        let post_params = new FormData()
        CallDatabasePost(params, post_params).then((res) => {
            console.log(res)
            const resp: JDBResp = JSON.parse(res);
            console.log(resp.result)
            let queryResults = resp.result
            setTbColumns(queryResults.columns)
            setTbColumnsForShow(transformTbColumns(queryResults.columns))
            setRows(queryResults.rows)
        })
    }
    function removeSelectedRows() {
        let params = new Map<string, string>()
        params.set("action", "remove_jdb_row")
        params.set("db_name", dbName)
        params.set("tb_name", tbName)
        let post_params = new FormData()
        let remove_rows = Array.from(apiRef.current.getSelectedRows().values())
        console.log(remove_rows)
        post_params.set("remove_rows", JSON.stringify(remove_rows))
        CallDatabasePost(params, post_params).then((res) => {
            console.log(res)
            const resp: JDBResp = JSON.parse(res);
            console.log(resp.result)
            let queryResults = resp.result
            setTbColumns(queryResults.columns)
            setTbColumnsForShow(transformTbColumns(queryResults.columns))
            setRows(queryResults.rows)
        })
    }
    function addColumn() {
        let params = new Map<string, string>()
        params.set("action", "add_jdb_column")
        params.set("db_name", dbName)
        params.set("tb_name", tbName)
        params.set("col_name", colName)
        let post_params = new FormData()
        CallDatabasePost(params, post_params).then((res) => {
            console.log(res)
            const resp: JDBResp = JSON.parse(res);
            console.log(resp.result)
            let queryResults = resp.result
            setTbColumns(queryResults.columns)
            setTbColumnsForShow(transformTbColumns(queryResults.columns))
            setRows(queryResults.rows)
        })
    }
    function removeColumn() {
        let params = new Map<string, string>()
        params.set("action", "remove_jdb_column")
        params.set("db_name", dbName)
        params.set("tb_name", tbName)
        params.set("col_name", colName)
        let post_params = new FormData()
        CallDatabasePost(params, post_params).then((res) => {
            console.log(res)
            const resp: JDBResp = JSON.parse(res);
            console.log(resp.result)
            let queryResults = resp.result
            setTbColumns(queryResults.columns)
            setTbColumnsForShow(transformTbColumns(queryResults.columns))
            setRows(queryResults.rows)
        })
    }
    function setJDBColWidth(inColName: string, inWidth: number) {
        let params = new Map<string, string>()
        params.set("action", "set_jdb_col_width")
        params.set("db_name", dbName)
        params.set("tb_name", tbName)
        params.set("col_name", inColName)
        params.set("width", inWidth.toString())
        let post_params = new FormData()
        CallDatabasePost(params, post_params).then((res) => {
            // console.log(res)
        })
    }

    function jdbToXlsx() {
        let params = new Map<string, string>()
        params.set("action", "jdb_to_xlsx")
        params.set("db_name", dbName)
        let post_params = new FormData()
        CallDatabasePost(params, post_params).then((res) => {
            // console.log(res)
        })
    }

    function xlsxToJDB() {
        let params = new Map<string, string>()
        params.set("action", "xlsx_to_jdb")
        params.set("db_name", dbName)
        let post_params = new FormData()
        CallDatabasePost(params, post_params).then((res) => {
            // console.log(res)
        })
    }
    function openXlsx() {
        let params = new Map<string, string>()
        params.set("action", "open_jdb_xlsx")
        params.set("db_name", dbName)
        let post_params = new FormData()
        CallDatabasePost(params, post_params).then((res) => {
            // console.log(res)
        })
    }

    // @ts-ignore
    return (
        <div>
            <Autocomplete
                // disableClearable
                freeSolo
                id="dbName-box"
                sx={{ width: 300}}
                value={dbName} onChange={(event, newValue)=>{newValue?setDbName(newValue):setDbName("")}}
                renderInput={(params) =>
                    <TextField label="Database Name" {...params}/>
                } options={dbNames}
            />
            <Button onClick={() => {
                queryJDB()
            }}>
                Query Db
            </Button>
            <Button onClick={() => {
                addJDBDb()
            }}>
                Add JDB
            </Button>
            <Button onClick={() => {
                jdbToXlsx()
            }}>
                JDB To Xlsx
            </Button>
            <Button onClick={() => {
                xlsxToJDB()
            }}>
                Xlsx To JDB
            </Button>
            <Button onClick={() => {
                openXlsx()
            }}>
                Open Xlsx
            </Button>
            <div>
                <Autocomplete
                    // disableClearable
                    freeSolo
                    id="tbName-box"
                    sx={{ width: 300}}
                    value={tbName} onChange={(event, newValue)=>{newValue?setTbName(newValue):setTbName("")}}
                    inputValue={inputTbName}
                    onInputChange={(event, newInputValue) => {
                        setInputTbName(newInputValue);
                    }}
                    renderInput={(params) =>
                        <TextField label="Table Name" {...params}/>
                    } options={tbNames}
                    onBlur={(event)=>{
                        // @ts-ignore
                        setTbName(event.target.value)
                    }}
                />
                {/*{tbName}*/}
                <Button onClick={() => {
                    // queryJDB()
                    queryTable()
                }}>
                    Query Table
                </Button>
                <Button onClick={() => {
                    addJDBTb()
                }}>
                    Add Table
                </Button>
            </div>
            <Button onClick={() => {
                addRow()
            }}>
                Add Row
            </Button>
            <Button onClick={() => {
                removeSelectedRows()
            }}>
                Remove Selected Rows
            </Button>
            <TextField variant="outlined" value={colName} onChange={(v) => {
                setColName(v.target.value)
            }}/>
            <Button onClick={() => {
                addColumn()
            }}>
                Add Column
            </Button>
            <Button onClick={() => {
                removeColumn()
            }}>
                Remove Column
            </Button>

            <Box sx={{ height: 400, width: '100%' }}>
                <DataGrid
                    apiRef={apiRef}
                    rows={rows}
                    columns={tbColumnsForShow}
                    filterModel={filterModel}
                    initialState={{
                        pagination: {
                            paginationModel: {
                                pageSize: 10,
                            },
                        },
                        columns: {
                            columnVisibilityModel: {id: false}
                        }
                    }}
                    pageSizeOptions={[10]}
                    checkboxSelection
                    disableRowSelectionOnClick
                    autoHeight={true}
                    processRowUpdate={(newRow, oldRow) => {
                        console.log("new", newRow)
                        // @ts-ignore
                        let newRows = rows.map((row) => (row.id === newRow.id ? newRow : row))
                        // @ts-ignore
                        setRows(newRows)
                        console.log(rows)
                        saveTable(newRows)
                        return newRow
                    }}
                    onColumnHeaderClick={(params, event, details) => {
                        setColName(params.field)
                    }}
                    onColumnWidthChange={(params, event, details) => {
                        // console.log(params.colDef.field)
                        setColName(params.colDef.field)
                        setColWidth(params.width)
                        setJDBColWidth(params.colDef.field, params.width)
                    }}
                />
            </Box>
        </div>
    )
}
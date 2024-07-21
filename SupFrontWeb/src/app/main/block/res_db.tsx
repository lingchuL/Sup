'use client'

import * as React from "react";
import {CallCopilotAction, CallDatabasePost, CallPluginAction} from "@/app/api/route_api";
import Box from "@mui/material/Box";
import {Autocomplete, FormControl, InputLabel, MenuItem, Select, TextField} from "@mui/material";
import Button from "@mui/material/Button";
import {ResultResp} from "@/app/utils/util_def";
import {useEffect} from "react";
import {DataGrid, GridColDef} from "@mui/x-data-grid";
import JsonDatabaseUIPage from "@/app/main/database/jdb";
import {TableData} from "@/app/utils/cells_table";

interface KeywordsResp {
    result: string[],
    db_result: TableData,
    status_code: string
}

interface JDBResp {
    result: TableData,
    status_code: string
}

export default function ResDBPage() {
    const [typeName, setTypeName] = React.useState("Anim");
    const [keyword, setKeyword] = React.useState("");
    const [keywords, setKeywords] = React.useState<string[]>([]);
    const [finalKeyword, setFinalKeyword] = React.useState("");

    const [tbColumns, setTbColumns] = React.useState<GridColDef[]>([])
    const [rows, setRows] = React.useState<[]>([])

    function searchKeywords(typeName: string, keyword:string) {
        let arg_params = new Map<string, string>()
        arg_params.set("action", "search_keywords")
        arg_params.set("type_name", typeName)
        arg_params.set("keyword", keyword)
        let post_params = new FormData()
        CallDatabasePost(arg_params, post_params).then(value => {
            const resp: KeywordsResp = JSON.parse(value)
            console.log(resp.result)
            setKeywords(resp.result)
            setFinalKeyword(resp.result[0])
            setTbColumns(resp.db_result.columns)
            setRows(resp.db_result.rows)
        })
    }

    function searchFinalKeyword(typeName: string, final_keyword="") {
        let arg_params = new Map<string, string>()
        arg_params.set("action", "search_final_keyword")
        arg_params.set("type_name", typeName)
        arg_params.set("final_keyword", final_keyword)
        let post_params = new FormData()
        CallDatabasePost(arg_params, post_params).then(value => {
            const resp: JDBResp = JSON.parse(value);
            console.log(resp.result)
            let queryResults = resp.result
            setTbColumns(queryResults.columns)
            setRows(queryResults.rows)
        })
    }

    function updateEnJDB(typeName: string) {
        let arg_params = new Map<string, string>()
        arg_params.set("action", "update_en_jdb")
        arg_params.set("type_name", typeName)
        let post_params = new FormData()
        CallPluginAction(arg_params, post_params).then(value => {
            const resp: ResultResp = JSON.parse(value);
            console.log(resp.result)
        })
    }
    function updateSearchTagsChromaDb(typeName: string) {
        let arg_params = new Map<string, string>()
        arg_params.set("action", "update_search_tags_chromadb")
        arg_params.set("type_name", typeName)
        let post_params = new FormData()
        CallPluginAction(arg_params, post_params).then(value => {
            const resp: ResultResp = JSON.parse(value);
            console.log(resp.result)
        })
    }

    return (
        <Box>
            <FormControl>
                <InputLabel id="type-select-label">Type</InputLabel>
                <Select
                    labelId="type-select-label"
                    id="type-select"
                    value={typeName}
                    label="ResType"
                    onChange={(v) => {setTypeName(v.target.value) }}
                >
                    <MenuItem value={"UI"}>UI</MenuItem>
                    <MenuItem value={"Anim"}>动作</MenuItem>
                    <MenuItem value={"AudioEvent"}>音频Event</MenuItem>
                    <MenuItem value={"Model"}>模型</MenuItem>
                    <MenuItem value={"VFX"}>特效</MenuItem>
                </Select>
            </FormControl>
            <Button variant="outlined" onClick={()=>{
                updateEnJDB(typeName);
            }}>
                更新英文标注表（AI）
            </Button>
            <Button variant="outlined" onClick={()=>{
                updateSearchTagsChromaDb(typeName);
            }}>
                更新向量数据库
            </Button>
            <Box>
                <TextField variant="outlined" value={keyword} onChange={(v) => setKeyword(v.target.value)
                } label="搜索关键词（模糊）"/>
                <Button variant="outlined" onClick={()=>{
                    searchKeywords(typeName, keyword);
                }}>
                    搜索关键词
                </Button>
            </Box>
            <Autocomplete
                // disableClearable
                freeSolo
                id="tbName-box"
                sx={{ width: 300}}
                value={finalKeyword} onChange={(event, newValue)=>{
                newValue?setFinalKeyword(newValue):setFinalKeyword("");
            }}
                renderInput={(params) =>
                    <TextField label="联想关键词（精确）" {...params}/>
                } options={keywords}
            />
            <Box width="100%">
                <Button variant="outlined"
                        onClick={() => {
                            searchFinalKeyword(typeName, finalKeyword)
                        }}>
                    检索
                </Button>
                <Box sx={{ height: 400, width: '100%' }}>
                    <DataGrid
                        rows={rows}
                        columns={tbColumns}
                        // filterModel={{items: [{"field": "idx_name", "operator": "contains", "value": finalKeyword}]}}
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
                    />
                </Box>
            </Box>
        </Box>
    )
}
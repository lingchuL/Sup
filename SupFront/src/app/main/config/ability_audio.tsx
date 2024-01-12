'use client'

import {CircularProgress, Divider, IconButton, Snackbar, TextField} from "@mui/material";
import Container from "@mui/material/Container";
import {CallCfgAudioAction} from "@/app/api/route";
import SearchIcon from "@mui/icons-material/Search";
import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import * as React from "react";
import {useState} from "react";
import {Row, GetNewRows, formAttr, CfgProps, AttrProperty, AttrRowsArgs} from "@/app/main/config/audio_cfg";
import SaveIcon from "@mui/icons-material/Save";
import DeleteIcon from '@mui/icons-material/Delete';

interface ItemAttrArgs {
    project_dir: string
    rows: Row[],
    setAbilities: (rows: Row[]) => void
}

interface AbilityAttrArgs {
    project_dir: string
    rows: Row[],
    setAbilities: (rows: Row[]) => void
}

function ItemAttrRows({project_dir, rows, setAbilities}: ItemAttrArgs) {
    return (
        rows?.map((row) => (
            <Grid container direction="row" alignItems="center">
                <p>{row.key}</p>
                <Divider orientation="vertical" variant="middle" flexItem/>
                {
                    row.attr_names.map((attr_name: string, idx: number) => (
                        <Grid>
                            {idx <= 1 &&
                                <Grid container direction="row">
                                    <p>{row.attr_values.at(idx)}</p>
                                    <Divider orientation="vertical" variant="middle" flexItem/>
                                </Grid>
                            }
                            {idx > 1 && (
                                <Button variant="outlined"
                                        onClick={() => {
                                            let params = new Map<string, string>()
                                            params.set("type", "ability")
                                            params.set("action", "search_ability")
                                            params.set("projectDir", encodeURIComponent(project_dir))
                                            params.set("search", encodeURIComponent(row.key))
                                            params.set("action_name", attr_name)
                                            CallCfgAudioAction(params).then((value) => {
                                                const resp: Resp = JSON.parse(value)
                                                console.log(resp.result)
                                                setAbilities(resp.result)
                                            })
                                        }}>
                                    {row.attr_values.at(idx)}
                                </Button>
                            )}
                        </Grid>
                    ))
                }
                <Divider key={crypto.randomUUID()}/>
                <IconButton key={crypto.randomUUID()}
                            onClick={() => {
                                let params = new Map<string, string>()
                                params.set("type", "ability")
                                params.set("action", "search_ability")
                                params.set("projectDir", encodeURIComponent(project_dir))
                                params.set("search", encodeURIComponent(row.key))
                                CallCfgAudioAction(params).then((value) => {
                                    const resp: Resp = JSON.parse(value)
                                    console.log(resp.result)
                                    setAbilities(resp.result)
                                })
                            }}
                >
                    <SearchIcon/>
                </IconButton>
            </Grid>
        ))
    )
}

function AbilityAttrRows({project_dir, rows, setAbilities}: AbilityAttrArgs) {
    const [showInfo, setShowInfo] = useState(false)

    return (
        rows?.map((row) => (
            <Grid container direction="row">
                <p>{row.key}</p>
                <Divider orientation="vertical" variant="middle" flexItem/>
                {
                    row.attr_names.map((attr_name: string, idx: number) => (
                        <div>
                            {idx <= 2 &&
                                <Grid container direction="row">
                                    <p>{row.attr_values.at(idx)}</p>
                                    <Divider orientation="vertical" variant="middle" flexItem/>
                                </Grid>
                            }
                            {idx > 2 && (
                                <TextField variant="outlined" value={row.attr_values.at(idx)}
                                           onChange={(v) => {
                                               let newRows = GetNewRows(rows, row.key, attr_name, v.target.value)
                                               setAbilities(newRows)
                                           }}>
                                </TextField>
                            )}
                        </div>
                    ))
                }
                <Divider key={crypto.randomUUID()}/>
                <IconButton key={crypto.randomUUID()}
                            onClick={() => {
                                let params = new Map<string, string>()
                                params.set("type", "ability")
                                params.set("action", "write_save_ability")
                                params.set("projectDir", encodeURIComponent(project_dir))
                                params.set("search", encodeURIComponent(row.key))
                                params.set("desc", row.attr_values.at(0) as string)
                                params.set("castSfx", row.attr_values.at(-2) as string)
                                params.set("castSfxTime", row.attr_values.at(-1) as string)
                                CallCfgAudioAction(params).then((value) => {
                                    const resp: Resp = JSON.parse(value)
                                    console.log(resp.result)
                                    setShowInfo(true)
                                })
                            }}
                >
                    <SaveIcon/>
                </IconButton>
                <IconButton key={crypto.randomUUID()}
                            onClick={() => {
                                let params = new Map<string, string>()
                                params.set("type", "ability")
                                params.set("action", "delete_ability")
                                params.set("projectDir", encodeURIComponent(project_dir))
                                params.set("search", encodeURIComponent(row.key))
                                CallCfgAudioAction(params).then((value) => {
                                    const resp: Resp = JSON.parse(value)
                                    console.log(resp.result)
                                    setAbilities(resp.result)
                                    setShowInfo(true)
                                })
                            }}
                >
                    <DeleteIcon/>
                </IconButton>
                <Snackbar
                    open={showInfo}
                    autoHideDuration={5000}
                    message="成功"
                    onClose={()=>{setShowInfo(false)}}
                />
            </Grid>
        ))
    )
}


interface Resp {
    result: Row[]
    status: string
}


export default function AbilityAudioCfgPage(prop: CfgProps) {
    const [searchName, setSearchName] = React.useState("");
    const [itemRows, setItemRows] = React.useState<Row[]>([]);
    const [abilityRows, setAbilityRows] = React.useState<Row[]>([]);

    const [isLoading, setIsLoading] = React.useState(false);
    const [showInfo, setShowInfo] = useState(false)

    const projectDir = prop.project_dir

    return (
        <div>
            <Grid item xs={12} flexDirection='column' display='flex'>
                <Container>
                    <TextField variant="outlined" value={searchName} onChange={(v) => setSearchName(v.target.value)
                    }>
                    </TextField>
                    <IconButton color="primary" sx={{p: '10px'}} aria-label="directions"
                                onClick={() => {
                                    if (searchName == "") {
                                        return
                                    }
                                    let params = new Map<string, string>()
                                    params.set("type", "ability")
                                    params.set("action", "search_item")
                                    params.set("projectDir", encodeURIComponent(prop.project_dir))
                                    params.set("search", encodeURIComponent(searchName))
                                    CallCfgAudioAction(params).then(value => {
                                        const resp: Resp = JSON.parse(value)
                                        console.log(resp.result)
                                        setItemRows(resp.result)
                                        setAbilityRows([])
                                        console.log(itemRows)
                                    })
                                }}>
                        <SearchIcon/>
                    </IconButton>
                    <Button variant="outlined"
                            onClick={() => {
                                setIsLoading(true)
                                let params = new Map<string, string>()
                                params.set("type", "ability")
                                params.set("action", "convert_cfg")
                                params.set("projectDir", encodeURIComponent(prop.project_dir))
                                CallCfgAudioAction(params).then(value => {
                                    const resp: Resp = JSON.parse(value)
                                    console.log(resp.result)
                                    setIsLoading(false)
                                    setShowInfo(true)
                                })
                            }}>
                        转表
                    </Button>
                    {isLoading && <CircularProgress/>}
                    <Snackbar
                        open={showInfo}
                        autoHideDuration={5000}
                        message="转表成功"
                        onClose={() => {
                            setShowInfo(false)
                        }}
                    ></Snackbar>
                </Container>
                <p>
                    3_物品配置_RP
                </p>
                <Divider/>
                <Paper>
                    <ItemAttrRows project_dir={projectDir} rows={itemRows} setAbilities={setAbilityRows}/>
                </Paper>
                <p>
                    Ability
                </p>
                <Divider/>
                <Paper>
                    <AbilityAttrRows project_dir={projectDir} rows={abilityRows} setAbilities={setAbilityRows}/>
                </Paper>
            </Grid>
        </div>
    )
}

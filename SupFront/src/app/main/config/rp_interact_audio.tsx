'use client'

import Toolbar from "@mui/material/Toolbar";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import * as React from "react";
import {CircularProgress, Divider, FormControlLabel, IconButton, Snackbar, TextField} from "@mui/material";
import Button from "@mui/material/Button";
import Checkbox from "@mui/material/Checkbox";
import {CallFileAction, CallRPInteractAudioCfgAction} from "@/app/api/route";
import SearchIcon from "@mui/icons-material/Search";
import SaveIcon from '@mui/icons-material/Save';
import {useState} from "react";

interface Resp {
    result: Attr[]
    status: string
}

interface Attr {
    id_: string
    desc: string
    guid: string
    sfx_start: string
    sfx_end: string
}

interface AttrArray {
    attrs: Attr[]
    cfgPath: string
    setParam: (id: string, param_name: string, param_value: string) => void
}

function SearchedAttrs({attrs, cfgPath, setParam}: AttrArray) {
    const [showInfo, setShowInfo] = useState(false)

    return (
        attrs.map((attr) => (
            <div>
                <Grid container direction="row">
                    <p>
                        {attr.id_} {attr.desc} {attr.guid}
                    </p>
                    <TextField variant="outlined" value={attr.sfx_start} onChange={(v) => {
                        setParam(attr.id_, "sfx_start", v.target.value)
                    }}>
                    </TextField>
                    <TextField variant="outlined" value={attr.sfx_end} onChange={(v) => {
                        setParam(attr.id_, "sfx_end", v.target.value)
                    }}>
                    </TextField>
                    <Divider key={crypto.randomUUID()}/>
                    <IconButton key={crypto.randomUUID()}
                                onClick={()=> {
                                    let params = new Map<string, string>()
                                    params.set("action", "write_save_id")
                                    params.set("cfgFilePath", encodeURIComponent(cfgPath))
                                    params.set("search", encodeURIComponent(attr.id_))
                                    params.set("sfx_start", attr.sfx_start)
                                    params.set("sfx_end", attr.sfx_end)
                                    CallRPInteractAudioCfgAction(params).then((value)=>{
                                        console.log(value)
                                        setShowInfo(true)
                                    })
                                }}>
                        <SaveIcon />
                    </IconButton>
                    <Snackbar
                        open={showInfo}
                        autoHideDuration={5000}
                        message="成功"
                        onClose={()=>{setShowInfo(false)}}
                        ></Snackbar>
                </Grid>
            </div>
        ))
    )
}


function AudioCfg() {
    const [cfgFilePath, setCfgFilePath] = React.useState("e:\\Workflow\\Block-wangjunyi.42-trunk\\Client\\Data\\JungoTownRP\\1_体素配置_RP.xlsx");
    const [searchName, setSearchName] = React.useState("");
    const [searchAttrs, setSearchAttrs] = React.useState<Attr[]>([]);

    const [isLoading, setIsLoading] = React.useState(false);
    const [showInfo, setShowInfo] = useState(false)

    function setSoundParam(id: string, param_name: string, param_value: string) {
        let newAttrs = []
        for (let attr of searchAttrs) {
            if (attr.id_ == id) {
                if (param_name == "sfx_start") {
                    attr.sfx_start = param_value
                } else if (param_name == "sfx_end") {
                    attr.sfx_end = param_value
                }
            }
            newAttrs.push(attr)
        }
        // console.log(newAttrs)
        setSearchAttrs(newAttrs)
    }

    return (
        <div>
            <Grid item xs={12} flexDirection='column' display='flex'>
                <TextField variant="outlined" value={cfgFilePath} onChange={(v) => setCfgFilePath(v.target.value)
                }>
                </TextField>
                <Container>
                    <TextField variant="outlined" value={searchName} onChange={(v) => setSearchName(v.target.value)
                    }>
                    </TextField>
                    <IconButton color="primary" sx={{ p: '10px' }} aria-label="directions"
                                onClick={()=> {
                                    let params = new Map<string, string>()
                                    params.set("action", "search")
                                    params.set("cfgFilePath", encodeURIComponent(cfgFilePath))
                                    params.set("search", encodeURIComponent(searchName))
                                    CallRPInteractAudioCfgAction(params).then(value => {
                                        const resp : Resp = JSON.parse(value)
                                        console.log(resp.result)
                                        setSearchAttrs(resp.result)
                                    })
                                }}>
                        <SearchIcon />
                    </IconButton>
                    <Button variant="outlined"
                        onClick={()=> {
                            setIsLoading(true)
                            let params = new Map<string, string>()
                            params.set("action", "convert_rp_cfg")
                            params.set("cfgFilePath", encodeURIComponent(cfgFilePath))
                            CallRPInteractAudioCfgAction(params).then(value => {
                                const resp : Resp = JSON.parse(value)
                                console.log(resp.result)
                                setIsLoading(false)
                                setShowInfo(true)
                            })
                        }}>
                        RP转表
                    </Button>
                    {isLoading && <CircularProgress />}
                    <Snackbar
                        open={showInfo}
                        autoHideDuration={5000}
                        message="转表成功"
                        onClose={()=>{setShowInfo(false)}}
                    ></Snackbar>
                </Container>
                <Paper>
                    <SearchedAttrs attrs={searchAttrs} cfgPath={cfgFilePath} setParam={setSoundParam}/>
                </Paper>
            </Grid>
        </div>
    )
}

export function RPInteractAudioCfgPage() {
    return (
        <Box
            component="main"
            sx={{
                backgroundColor: (theme) =>
                    theme.palette.mode === 'light'
                        ? theme.palette.grey[100]
                        : theme.palette.grey[900],
                flexGrow: 1,
                height: '100vh',
                overflow: 'auto',
            }}
        >
            <Toolbar />
            <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
                <Grid container spacing={3}>
                    {/* Chart */}
                    <Grid item xs={12}>
                        <Paper
                            sx={{
                                p: 2,
                                display: 'flex',
                                flexDirection: 'column',
                                // height: 240,
                            }}
                        >
                            <AudioCfg />
                        </Paper>
                    </Grid>
                </Grid>
            </Container>
        </Box>
    )
}
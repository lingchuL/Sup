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
import {CallDirFileGet, CallCfgAudioAction} from "@/app/api/route";
import SearchIcon from "@mui/icons-material/Search";
import SaveIcon from '@mui/icons-material/Save';
import {useState} from "react";
import {CfgProps} from "@/app/main/block/audio_cfg";

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
    projectDir: string
    setParam: (id: string, param_name: string, param_value: string) => void
}

function SearchedAttrs({attrs, projectDir, setParam}: AttrArray) {
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
                                    params.set("type", "rp_interact")
                                    params.set("action", "write_save_id")
                                    params.set("projectDir", encodeURIComponent(projectDir))
                                    params.set("search", encodeURIComponent(attr.id_))
                                    params.set("sfx_start", attr.sfx_start)
                                    params.set("sfx_end", attr.sfx_end)
                                    CallCfgAudioAction(params).then((value)=>{
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


function AudioCfg(prop: CfgProps) {
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
                <Container>
                    <TextField variant="outlined" value={searchName} onChange={(v) => setSearchName(v.target.value)
                    }>
                    </TextField>
                    <IconButton color="primary" sx={{ p: '10px' }} aria-label="directions"
                                onClick={()=> {
                                    if (searchName == "") {
                                        return
                                    }
                                    let params = new Map<string, string>()
                                    params.set("type", "rp_interact")
                                    params.set("action", "search")
                                    params.set("projectDir", encodeURIComponent(prop.project_dir))
                                    params.set("search", encodeURIComponent(searchName))
                                    CallCfgAudioAction(params).then(value => {
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
                            params.set("type", "rp_interact")
                            params.set("action", "convert_rp_cfg")
                            params.set("projectDir", encodeURIComponent(prop.project_dir))
                            CallCfgAudioAction(params).then(value => {
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
                    <SearchedAttrs attrs={searchAttrs} projectDir={prop.project_dir} setParam={setSoundParam}/>
                </Paper>
            </Grid>
        </div>
    )
}

export function RPInteractAudioCfgPage(prop: CfgProps) {
    return (
        <Grid item xs={12}>
            <AudioCfg project_dir={prop.project_dir}/>
        </Grid>
    )
}
'use client'


import Toolbar from "@mui/material/Toolbar";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import * as React from "react";
import {Divider, IconButton, Snackbar, TextField} from "@mui/material";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import {useState} from "react";
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import {CallRPInteractAudioCfgAction} from "@/app/api/route";
import SaveIcon from "@mui/icons-material/Save";

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

export default function AudioSearch() {
    const [searchText, setSearchText] = useState("")
    const [searchResults, setSearchResults] = useState([])

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
                    {/* Note - Freq */}
                    <Grid item xs={12} md={8} lg={9}>
                        <Paper
                            sx={{
                                p: 2,
                                display: 'flex',
                                flexDirection: 'column',
                                height: 240,
                            }}
                        >
                            <React.Fragment>
                                <TextField variant="outlined" value={searchText} onChange={(v) => {
                                    setSearchText(v.target.value)
                                }
                                }>
                                </TextField>
                                <Button
                                    variant="outlined"
                                    onClick={()=> {

                                    }}>
                                    Freq
                                </Button>
                            </React.Fragment>
                        </Paper>
                    </Grid>
                </Grid>
            </Container>
        </Box>
    )
}
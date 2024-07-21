'use client'

import {useState} from "react";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import * as React from "react";
import {TextField} from "@mui/material";
import Button from "@mui/material/Button";
import {CallAudioGet} from "@/app/api/route_api";
import {ResultResp} from "@/app/utils/util_def";

export default function NoteBPMPage() {
    const [note, setNote] = useState("A4")
    const [freq, setFreq] = useState("")

    const [bpm, setBPM] = useState("60")
    const [spb, setSPB] = useState("")

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
                                <TextField variant="outlined" value={note} onChange={(v) => {
                                    setNote(v.target.value)
                                    setFreq("")
                                }
                                }>
                                </TextField>
                                <TextField variant="outlined" value={freq} onChange={(v) => {
                                    setNote("")
                                    setFreq(v.target.value)
                                }}>
                                </TextField>
                                <Button
                                    variant="outlined"
                                    onClick={()=> {
                                        let params = new Map<string, string>()
                                        let action = note == "" ? "freq_to_note": "note_to_freq"
                                        params.set("action", action)
                                        params.set("note", note)
                                        params.set("freq", freq)
                                        CallAudioGet(params).then(value => {
                                            const text = value
                                            console.log(text)
                                            const resp: ResultResp = JSON.parse(text);
                                            console.log(resp)
                                            if (action == "note_to_freq") setFreq(resp.result)
                                            else setNote(resp.result)
                                        })
                                    }}>
                                    Freq
                                </Button>
                            </React.Fragment>
                        </Paper>
                    </Grid>
                    {/* BPM - SPB */}
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
                                <TextField variant="outlined" value={bpm} onChange={(v) => {
                                    setBPM(v.target.value)
                                    setSPB("")
                                }}>
                                </TextField>
                                <TextField variant="outlined" value={spb} onChange={(v) => {
                                    setBPM("")
                                    setSPB(v.target.value)
                                }}>
                                </TextField>
                                <Button
                                    variant="outlined"
                                    onClick={()=> {
                                        let params = new Map<string, string>()
                                        let action = bpm == "" ? "spb_to_bpm": "bpm_to_spb"
                                        params.set("action", action)
                                        params.set("bpm", bpm)
                                        params.set("spb", spb)
                                        CallAudioGet(params).then(value => {
                                            const text = value
                                            console.log(text)
                                            const resp: ResultResp = JSON.parse(text);
                                            console.log(resp)
                                            if (action == "spb_to_bpm") setBPM(resp.result)
                                            else setSPB(resp.result)
                                        })
                                    }}>
                                    BPM
                                </Button>
                            </React.Fragment>
                        </Paper>
                    </Grid>
                </Grid>
            </Container>
        </Box>
    );
}
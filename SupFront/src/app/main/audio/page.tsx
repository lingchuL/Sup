'use client'
import * as React from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import MuiDrawer from '@mui/material/Drawer';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Badge from '@mui/material/Badge';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Link from '@mui/material/Link';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import NotificationsIcon from '@mui/icons-material/Notifications';
import AlertDialog from "@/app/main/AlertDialog";
import Toolbar from "@mui/material/Toolbar";
import Button from "@mui/material/Button";
import {Get_Json, TransBPMSPB, TransNoteFreq} from "@/app/api/route";
import {Dialog, TextField} from "@mui/material";
import FileSizeList from "@/app/main/file_size_list";
import {useState} from "react";

interface NoteFreq {
    note: string;
    freq: string
}
interface BPMSPB {
    bpm: string;
    spb: string
}

function Copyright(props: any) {
    return (
        <Typography variant="body2" color="text.secondary" align="center" {...props}>
            {'Copyright © '}
            <Link color="inherit" href="https://mui.com/">
                Your Website
            </Link>{' '}
            {new Date().getFullYear()}
            {'.'}
        </Typography>
    );
}

export default function Dashboard() {
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
                                        TransNoteFreq(note, freq).then(value => {
                                            const text = value
                                            console.log(text)
                                            const note_freq: NoteFreq = JSON.parse(text);
                                            console.log(note_freq)
                                            setNote(note_freq.note)
                                            setFreq(note_freq.freq)
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
                                        TransBPMSPB(bpm, spb).then(value => {
                                            const text = value
                                            console.log(text)
                                            const bpm_trans: BPMSPB = JSON.parse(text);
                                            console.log(bpm_trans)
                                            setBPM(bpm_trans.bpm)
                                            setSPB(bpm_trans.spb)
                                        })
                                    }}>
                                    BPM
                                </Button>
                            </React.Fragment>
                        </Paper>
                    </Grid>
                </Grid>
                <Copyright sx={{ pt: 4 }} />
            </Container>
        </Box>
    );
}
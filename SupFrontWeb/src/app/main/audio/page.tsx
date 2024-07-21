'use client'
import * as React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Toolbar from "@mui/material/Toolbar";
import {Tab, Tabs, TextField} from "@mui/material";
import {useState} from "react";
import NoteBPMPage from "@/app/main/audio/note_bpm";
import TTSPage from "@/app/main/audio/tts";
import SourceSeparatePage from "@/app/main/audio/source_separate";
import AudioDiffusionPage from "@/app/main/audio/audio_diffusion";
import {CustomTabPanel, a11yProps} from "@/app/utils/tab_panel";

export default function AudioTabs() {
    const [value, setValue] = useState(0)

    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
    };

    return (
        <Box sx={{ width: '100%' }}>
            <Toolbar />
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
                    <Tab label="Note BPM" {...a11yProps(0)} />
                    <Tab label="TTS" {...a11yProps(1)} />
                    <Tab label="Source Separate" {...a11yProps(2)} />
                    <Tab label="Audio Diffusion" {...a11yProps(3)} />
                </Tabs>
            </Box>
            <CustomTabPanel value={value} index={0}>
                <NoteBPMPage/>
            </CustomTabPanel>
            <CustomTabPanel value={value} index={1}>
                <TTSPage/>
            </CustomTabPanel>
            <CustomTabPanel value={value} index={2}>
                <SourceSeparatePage/>
            </CustomTabPanel>
            <CustomTabPanel value={value} index={3}>
                <AudioDiffusionPage/>
            </CustomTabPanel>
        </Box>
    );
}
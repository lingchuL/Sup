'use client'

import {useState} from "react";
import * as React from "react";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Grid from "@mui/material/Grid";
import {Tab, Tabs, TextField} from "@mui/material";
import {EnvTreeCfgPage} from "@/app/main/block/env_tree";
import {RPInteractAudioCfgPage} from "@/app/main/block/rp_interact_audio";
import AbilityAudioCfgPage from "@/app/main/block/ability_audio";
import AudioSearch from "@/app/main/block/audio_resource_search";
import Typography from "@mui/material/Typography";
import FileSearchPage from "@/app/main/dir_file/file_search";
import PicHandlePage from "@/app/main/dir_file/pic_handle";
import MoveFilePage from "@/app/main/dir_file/move_handle";

interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
}

function CustomTabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box sx={{ p: 3 }}>
                    <Typography>{children}</Typography>
                </Box>
            )}
        </div>
    );
}

function a11yProps(index: number) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}

export default function DirFileHandleTabs() {
    const [value, setValue] = useState(0)

    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
    };

    return (
        <Box sx={{ width: '100%' }}>
            <Toolbar />
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
                    <Tab label="File_Search" {...a11yProps(0)} />
                    <Tab label="Pic_Handle" {...a11yProps(1)} />
                    <Tab label="MOVE_Handle" {...a11yProps(2)} />
                </Tabs>
            </Box>
            <CustomTabPanel value={value} index={0}>
                <FileSearchPage/>
            </CustomTabPanel>
            <CustomTabPanel value={value} index={1}>
                <PicHandlePage/>
            </CustomTabPanel>
            <CustomTabPanel value={value} index={2}>
                <MoveFilePage/>
            </CustomTabPanel>
        </Box>
    );
}
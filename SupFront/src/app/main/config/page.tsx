'use client'
import * as React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import {EnvTreeCfgPage} from "@/app/main/config/env_tree"
import {Tab, Tabs, TextField} from "@mui/material";
import Toolbar from "@mui/material/Toolbar";
import {RPInteractAudioCfgPage} from "@/app/main/config/rp_interact_audio";
import AudioSearch from "@/app/main/config/audio_resource_search";
import AbilityAudioCfgPage from "@/app/main/config/ability_audio";
import {useState} from "react";
import Grid from "@mui/material/Grid";

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

export default function BasicTabs() {
    const [value, setValue] = useState(0)
    const [projectDir, setProjectDir] = useState("e:\\Workflow\\Block-wangjunyi.42-trunk")

    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
    };

    return (
        <Box sx={{ width: '100%' }}>
            <Toolbar />
            <Grid item xs={12} flexDirection='column' display='flex'>
                <TextField variant="outlined" value={projectDir} onChange={(v) => setProjectDir(v.target.value)
                }>
                </TextField>
            </Grid>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
                    <Tab label="决策树配置" {...a11yProps(0)} />
                    <Tab label="RP物品交互音效配置" {...a11yProps(1)} />
                    <Tab label="Ability音效配置" {...a11yProps(2)} />
                    <Tab label="AudioGPT" {...a11yProps(3)} />
                </Tabs>
            </Box>
            <CustomTabPanel value={value} index={0}>
                <EnvTreeCfgPage />
            </CustomTabPanel>
            <CustomTabPanel value={value} index={1}>
                <RPInteractAudioCfgPage />
            </CustomTabPanel>
            <CustomTabPanel value={value} index={2}>
                <AbilityAudioCfgPage project_dir={projectDir} />
            </CustomTabPanel>
            <CustomTabPanel value={value} index={3}>
                <AudioSearch />
            </CustomTabPanel>
        </Box>
    );
}
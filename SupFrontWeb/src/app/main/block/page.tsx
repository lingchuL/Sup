'use client'
import * as React from 'react';
import Box from '@mui/material/Box';
import {EnvTreeCfgPage} from "@/app/main/block/env_tree"
import {Tab, Tabs, TextField} from "@mui/material";
import Toolbar from "@mui/material/Toolbar";
import {RPInteractAudioCfgPage} from "@/app/main/block/rp_interact_audio";
import AbilityAudioCfgPage from "@/app/main/block/ability_audio";
import {useState} from "react";
import Grid from "@mui/material/Grid";
import {PackageInstallPage} from "@/app/main/block/package_install";
import WaapiPage from "@/app/main/block/waapi";
import {CustomTabPanel, a11yProps} from "@/app/utils/tab_panel";
import ResDBPage from "@/app/main/block/res_db";


export default function BasicTabs() {
    const [value, setValue] = useState(0)
    const [projectDir, setProjectDir] = useState("f:\\Workflow\\Block-wangjunyi.42-trunk")

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
                    <Tab label="资产搜索" {...a11yProps(0)} />
                    <Tab label="PackageInstall" {...a11yProps(1)} />
                    <Tab label="Waapi" {...a11yProps(2)} />
                </Tabs>
            </Box>
            <CustomTabPanel value={value} index={0}>
                <ResDBPage />
            </CustomTabPanel>
            <CustomTabPanel value={value} index={1}>
                <PackageInstallPage />
            </CustomTabPanel>
            <CustomTabPanel value={value} index={2}>
                <WaapiPage />
            </CustomTabPanel>
        </Box>
    );
}
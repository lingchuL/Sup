'use client'

import {Tab, Tabs, TextField} from "@mui/material";
import * as React from "react";
import Toolbar from "@mui/material/Toolbar";
import Box from "@mui/material/Box";
import {useState} from "react";
import CopilotPage from "@/app/main/copilot/copilot";
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
                    <Tab label="SupCopilot" {...a11yProps(0)} />
                </Tabs>
            </Box>
            <CustomTabPanel value={value} index={0}>
                <CopilotPage/>
            </CustomTabPanel>
        </Box>
    );
}
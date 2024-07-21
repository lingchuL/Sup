'use client'

import {useState} from "react";
import * as React from "react";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import {Tab, Tabs} from "@mui/material";
import ChromadbUIPage from "@/app/main/database/chromadb_ui";
import {CustomTabPanel, a11yProps} from "@/app/utils/tab_panel";
import JsonDatabaseUIPage from "@/app/main/database/jdb";

export default function DatabaseTabs() {
    const [value, setValue] = useState(0)

    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
    };

    return (
        <Box sx={{ width: '100%' }}>
            <Toolbar />
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
                    <Tab label="Chormadb" {...a11yProps(0)} />
                    <Tab label="Json Database" {...a11yProps(1)} />
                </Tabs>
            </Box>
            <CustomTabPanel value={value} index={0}>
                <ChromadbUIPage/>
            </CustomTabPanel>
            <CustomTabPanel value={value} index={1}>
                <JsonDatabaseUIPage/>
            </CustomTabPanel>
        </Box>
    );
}
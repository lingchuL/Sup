'use client'

import {useState} from "react";
import * as React from "react";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import {Tab, Tabs} from "@mui/material";
import FileSearchPage from "@/app/main/dir_file/file_search";
import PicHandlePage from "@/app/main/dir_file/pic_handle";
import MoveFilePage from "@/app/main/dir_file/move_handle";
import VideoPage from "@/app/main/dir_file/video";
import {CustomTabPanel, a11yProps} from "@/app/utils/tab_panel";

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
                    <Tab label="Move_Handle" {...a11yProps(2)} />
                    <Tab label="Video" {...a11yProps(3)} />
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
            <CustomTabPanel value={value} index={3}>
                <VideoPage/>
            </CustomTabPanel>
        </Box>
    );
}
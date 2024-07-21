'use client'

import {FormControl, FormControlLabel, InputLabel, MenuItem, Select, Tab, Tabs, TextField} from "@mui/material";
import * as React from "react";
import Toolbar from "@mui/material/Toolbar";
import Box from "@mui/material/Box";
import {useState} from "react";
import Button from "@mui/material/Button";
import {CallVersionAction} from "@/app/api/route_api";
import Checkbox from "@mui/material/Checkbox";
import {CustomTabPanel, a11yProps} from "@/app/utils/tab_panel";
import {SnackBarInfo} from "@/app/utils/SnackBar";

export default function AudioTabs() {
    const [value, setValue] = useState(0)
    const [outputDir, setOutputDir] = useState("")
    const [buildName, setBuildName] = useState("")
    const [isForceBuild, setIsForceBuild] = useState(false)
    const [showSnackBar, setShowSnackBar] = useState(false)

    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
    };

    return (
        <Box sx={{ width: '100%' }}>
            <Toolbar />
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
                    <Tab label="Settings" {...a11yProps(0)} />
                </Tabs>
            </Box>
            <CustomTabPanel value={value} index={0}>
                <TextField fullWidth label="OutputDir" value={outputDir} onChange={(v) => setOutputDir(v.target.value)}/>
                <FormControl fullWidth>
                    <InputLabel id="buildName-select-label">BuildName</InputLabel>
                    <Select
                        labelId="buildName-select-label"
                        id="buildName-select"
                        value={buildName}
                        label="BuildName"
                        onChange={(v) => {setBuildName(v.target.value) }}
                    >
                        <MenuItem value={"next"}>next</MenuItem>
                        <MenuItem value={"electron"}>electron</MenuItem>
                        <MenuItem value={"supfront"}>supfront</MenuItem>
                        <MenuItem value={"supback"}>supback</MenuItem>
                        <MenuItem value={"all"}>all</MenuItem>
                    </Select>
                </FormControl>
                <FormControlLabel control={
                    <Checkbox defaultChecked={false} value={isForceBuild} onChange={(v)=>setIsForceBuild(v.target.checked)}/>
                } label="Force Build">
                </FormControlLabel>
                <Button onClick={() => {
                    console.log(history)
                    let arg_params = new Map<string, string>()
                    arg_params.set("action", "build")
                    arg_params.set("output_dir", encodeURIComponent(outputDir))
                    arg_params.set("force_build", String(isForceBuild))
                    arg_params.set("name", buildName)
                    let post_params = new FormData()
                    // post_params.set("message", encodeURIComponent(message))
                    CallVersionAction(arg_params, post_params).then(value => {
                        console.log(value)
                        // const resp: Resp = JSON.parse(value)
                        // console.log(resp.result)
                        setShowSnackBar(true)
                    })
                }}>
                    打包
                </Button>
                <SnackBarInfo autoHideDuration={5000} infoContent={"打包完成"} shouldShow={showSnackBar} setShouldShow={setShowSnackBar} />
            </CustomTabPanel>
        </Box>
    );
}
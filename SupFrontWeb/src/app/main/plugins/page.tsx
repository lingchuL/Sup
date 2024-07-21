'use client'

import {FormControlLabel, Tab, Tabs, TextField} from "@mui/material";
import * as React from "react";
import Toolbar from "@mui/material/Toolbar";
import Box from "@mui/material/Box";
import {useState} from "react";
import Button from "@mui/material/Button";
import {CallPluginAction} from "@/app/api/route_api";
import Checkbox from "@mui/material/Checkbox";
import {CustomTabPanel, a11yProps} from "@/app/utils/tab_panel";
import {SnackBarInfo} from "@/app/utils/SnackBar";

export default function AudioTabs() {
    const [value, setValue] = useState(0)
    const [pluginName, setPluginName] = useState("")
    const [isForceExec, setIsForceExec] = useState(false)
    const [showSnack, setShowSnack] = useState(false)

    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
    };

    return (
        <Box sx={{ width: '100%' }}>
            <Toolbar />
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
                    <Tab label="Plugins" {...a11yProps(0)} />
                </Tabs>
            </Box>
            <CustomTabPanel value={value} index={0}>
                <TextField fullWidth label="PluginName" value={pluginName} onChange={(v) => setPluginName(v.target.value)}/>
                {/*<FormControl fullWidth>*/}
                {/*    <InputLabel id="pluginName-select-label">PluginName</InputLabel>*/}
                {/*    <Select*/}
                {/*        labelId="pluginName-select-label"*/}
                {/*        id="buildName-select"*/}
                {/*        value={pluginName}*/}
                {/*        label="PluginName"*/}
                {/*        onChange={(v) => {setPluginName(v.target.value) }}*/}
                {/*    >*/}
                {/*        <MenuItem value={"next"}>next</MenuItem>*/}
                {/*        <MenuItem value={"electron"}>electron</MenuItem>*/}
                {/*        <MenuItem value={"supfront"}>supfront</MenuItem>*/}
                {/*        <MenuItem value={"supback"}>supback</MenuItem>*/}
                {/*        <MenuItem value={"all"}>all</MenuItem>*/}
                {/*    </Select>*/}
                {/*</FormControl>*/}
                <FormControlLabel control={
                    <Checkbox defaultChecked={false} value={isForceExec} onChange={(v)=>setIsForceExec(v.target.checked)}/>
                } label="isForceExec">
                </FormControlLabel>
                <Button onClick={() => {
                    console.log(history)
                    let arg_params = new Map<string, string>()
                    arg_params.set("action", "create_plugin")
                    arg_params.set("name", pluginName)
                    arg_params.set("is_force_execute", String(isForceExec))
                    let post_params = new FormData()
                    // post_params.set("message", encodeURIComponent(message))
                    CallPluginAction(arg_params, post_params).then(value => {
                        console.log(value)
                        // const resp: Resp = JSON.parse(value)
                        // console.log(resp.result)
                    })
                }}>
                    创建新插件
                </Button>
                <SnackBarInfo autoHideDuration={5000} infoContent={"测试成功"} shouldShow={showSnack} setShouldShow={setShowSnack}/>
                <Button onClick={() => {
                    // console.log(history)
                    let arg_params = new Map<string, string>()
                    arg_params.set("action", "plugin_test")
                    let post_params = new FormData()
                    // post_params.set("message", encodeURIComponent(message))
                    CallPluginAction(arg_params, post_params).then(value => {
                        console.log(value)
                        setShowSnack(true)
                        // console.log(showSnack)
                    })
                }}>
                    测试插件
                </Button>
            </CustomTabPanel>
        </Box>
    );
}
'use client'

import React, {useState} from "react";
import {FormControl, FormControlLabel, InputLabel, MenuItem, Select, TextField} from "@mui/material";
import {CallPluginAction} from "@/app/api/route_api";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Checkbox from "@mui/material/Checkbox";
import {FileSize} from "@/app/utils/util_def";
import {DropFileArea} from "@/app/utils/dropfile";

export default function WaapiPage() {
    const [filePath, setFilePath] = useState("")
    const [fileList, setFileList] = useState<FileSize[]>([])
    const [wwiseProjDir, setWwiseProjDir] = useState("")
    const [outputType, setOutputType] = useState("")
    const [model, setModel] = useState("")

    const [isTwoStems, setIsTwoStems] = useState(false)
    const [twoStemName, setTwoStemName] = useState("vocals")

    const [shiftNums, setShiftNums] = useState("2")
    const [jobNums, setJobNums] = useState("8")

    return (
        <Box width="100%">
            <DropFileArea setFilePathList={setFileList} tipContent={"Drop audio files here."} children={null}/>
            <TextField fullWidth label="OutputDir" value={wwiseProjDir} onChange={(v) => setWwiseProjDir(v.target.value)}/>
            <FormControl fullWidth>
                <InputLabel id="outputType-select-label">OutputType</InputLabel>
                <Select
                    labelId="outputType-select-label"
                    id="outputType-select"
                    value={outputType}
                    label="OutputType"
                    onChange={(v) => {setOutputType(v.target.value) }}
                >
                    <MenuItem value={"mp3"}>mp3</MenuItem>
                    <MenuItem value={"wav"}>wav</MenuItem>
                    <MenuItem value={"flac"}>flac</MenuItem>
                </Select>
            </FormControl>
            <FormControl fullWidth>
                <InputLabel id="demo-simple-select-label">Model</InputLabel>
                <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={model}
                    label="Model"
                    onChange={(v) => {setModel(v.target.value) }}
                >
                    <MenuItem value={"htdemucs_6s"}>htdemucs_6s</MenuItem>
                    <MenuItem value={"htdemucs"}>htdemucs</MenuItem>
                    <MenuItem value={"mdx_extra_q"}>mdx_extra_q</MenuItem>
                </Select>
            </FormControl>
            <FormControlLabel control={
                <Checkbox defaultChecked={false} value={isTwoStems} onChange={(v)=>setIsTwoStems(v.target.checked)}/>
            } label="isTwoStems">
            </FormControlLabel>
            {
                isTwoStems&&
                <FormControl>
                    <InputLabel id="twoStemName-select-label">TwoStemName</InputLabel>
                    <Select
                        labelId="twoStemName-select-label"
                        id="twoStemName-select"
                        value={twoStemName}
                        label="TwoStemName"
                        onChange={(v) => {setTwoStemName(v.target.value) }}
                    >
                        <MenuItem value={"bass"}>bass</MenuItem>
                        <MenuItem value={"guitar"}>guitar</MenuItem>
                        <MenuItem value={"other"}>other</MenuItem>
                        <MenuItem value={"piano"}>piano</MenuItem>
                        <MenuItem value={"vocals"}>vocals</MenuItem>
                    </Select>
                </FormControl>
            }
            <TextField label="ShiftNums" value={shiftNums} onChange={(v) => setShiftNums(v.target.value)}/>
            <TextField label="JobNums" value={jobNums} onChange={(v) => setJobNums(v.target.value)}/>
            <Button
                variant="outlined"
                onClick={()=> {
                    console.log(fileList)
                    let params = new Map<string, string>()
                    params.set("action", "transform_pic")
                    let post_params = new FormData()
                    post_params.set("file_list", JSON.stringify(fileList))
                    console.log(JSON.stringify(fileList))
                    CallPluginAction(params, post_params).then((v) => {
                        console.log(v)
                    })
                }}>
                Import Audio
            </Button>
        </Box>
    )
}

'use client'

import React, {useCallback, useState} from "react";
import {FormControl, FormControlLabel, InputLabel, MenuItem, Select, TextField} from "@mui/material";
import {CallAudioGet, CallAudioPost, CallDirFilePost} from "@/app/api/route_api";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import {DropFileArea} from "@/app/utils/dropfile";
import Checkbox from "@mui/material/Checkbox";
import {FileSize} from "@/app/utils/util_def";

export default function SourceSeparatePage() {
    const [filePathList, setFilePathList] = useState<FileSize[]>([])
    const [outputDir, setOutputDir] = useState("")
    const [outputType, setOutputType] = useState("")
    const [model, setModel] = useState("")

    const [isTwoStems, setIsTwoStems] = useState(false)
    const [twoStemName, setTwoStemName] = useState("vocals")

    const [shiftNums, setShiftNums] = useState("2")
    const [jobNums, setJobNums] = useState("8")

    return (
        <Box width="100%">
            <DropFileArea setFilePathList={setFilePathList} tipContent={"Drop audio file here."} children={null}/>
            <TextField fullWidth label="OutputDir" value={outputDir} onChange={(v) => setOutputDir(v.target.value)}/>
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
                    let params = new Map<string, string>()
                    params.set("action", "source_separate")
                    params.set("file_path", filePathList[0].file_full_path)
                    params.set("model", model)
                    params.set("output_dir", outputDir)
                    params.set("output_type", outputType)
                    params.set("is_two_stems", String(isTwoStems))
                    params.set("two_stem_name", twoStemName)
                    params.set("shift_nums", shiftNums)
                    params.set("job_nums", jobNums)
                    CallAudioGet(params).then(value => {
                        console.log(value)
                    })
                }}>
                Source Separate
            </Button>
        </Box>
    )
}

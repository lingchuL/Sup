'use client'

import React, {useState} from "react";
import {FormControl, FormControlLabel, InputLabel, MenuItem, Select, TextField} from "@mui/material";
import {CallAudioGet} from "@/app/api/route_api";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Checkbox from "@mui/material/Checkbox";
import {ResultResp} from "@/app/utils/util_def";

export default function AudioDiffusionPage() {
    const [filePath, setFilePath] = useState("")
    const [outputDir, setOutputDir] = useState("")
    const [model, setModel] = useState("")
    const [prompt, setPrompt] = useState("")
    const [negPrompt, setNegPrompt] = useState("Low quality, average quality.")

    const [seed, setSeed] = useState("0")
    const [iterNums, setIterNums] = useState("30")

    const [useGPU, setUseGPU] = useState(false)

    const [audioSRSeed, setAudioSRSeed] = useState("0")

    return (
        <Box width="100%">
            <TextField fullWidth label="OutputDir" value={outputDir} onChange={(v) => setOutputDir(v.target.value)}/>
            <FormControl fullWidth>
                <InputLabel id="demo-simple-select-label">Model</InputLabel>
                <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={model}
                    label="Model"
                    onChange={(v) => {setModel(v.target.value) }}
                >
                    <MenuItem value={"AudioLDM2_16k"}>AudioLDM2_16k</MenuItem>
                    <MenuItem value={"AudioLDM2_48k"}>AudioLDM2_48k</MenuItem>
                    <MenuItem value={"Auffusion_16k"}>Auffusion_16k</MenuItem>
                </Select>
            </FormControl>
            <TextField fullWidth label="Prompt" value={prompt} onChange={(v) => setPrompt(v.target.value)}/>
            <TextField fullWidth label="NegPrompt" value={negPrompt} onChange={(v) => setNegPrompt(v.target.value)}/>
            <TextField label="Seed" value={seed} onChange={(v) => setSeed(v.target.value)}/>
            <TextField label="IterNums" value={iterNums} onChange={(v) => setIterNums(v.target.value)}/>
            <FormControlLabel control={
                <Checkbox defaultChecked={false} value={useGPU} onChange={(v)=>setUseGPU(v.target.checked)}/>
            } label="useGPU">
            </FormControlLabel>
            <Button
                variant="outlined"
                onClick={()=> {
                    let params = new Map<string, string>()
                    params.set("action", "audio_generate")
                    params.set("model", model)
                    params.set("output_dir", outputDir)
                    params.set("prompt", prompt)
                    params.set("neg_prompt", negPrompt)
                    params.set("seed", seed)
                    params.set("iter_nums", iterNums)
                    CallAudioGet(params).then(value => {
                        console.log(value)
                        const resp: ResultResp = JSON.parse(value);
                        console.log(resp)
                        setFilePath(resp.result)
                    })
                }}>
                Generate
            </Button>
            {
                filePath!=""&&
                <div>
                    <div>{filePath}</div>
                    <TextField label="Seed" value={audioSRSeed} onChange={(v) => setAudioSRSeed(v.target.value)}/>
                    <Button
                        variant="outlined"
                        onClick={()=> {
                            let params = new Map<string, string>()
                            params.set("action", "to_48k")
                            params.set("file_path", filePath)
                            params.set("output_dir", outputDir)
                            params.set("seed", audioSRSeed)
                            CallAudioGet(params).then(value => {
                                console.log(value)
                            })
                        }}>
                        Generate
                    </Button>
                </div>
            }
        </Box>
    )
}

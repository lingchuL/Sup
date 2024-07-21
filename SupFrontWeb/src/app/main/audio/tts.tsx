'use client'

import React, {useState} from "react";
import {FormControl, InputLabel, MenuItem, Select, TextField} from "@mui/material";
import {CallAudioPost} from "@/app/api/route_api";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import {ResultResp} from "@/app/utils/util_def";

export default function TTSPage() {
    const [text, setText] = useState("")
    const [model, setModel] = useState("")

    return (
        <Box width="100%">
            <TextField variant="outlined" value={text} onChange={(v) => {setText(v.target.value)}} fullWidth={true}/>
            <FormControl fullWidth>
                <InputLabel id="demo-simple-select-label">Model</InputLabel>
                <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={model}
                    label="Model"
                    onChange={(v) => {setModel(v.target.value) }}
                >
                    <MenuItem value={"OpenAI"}>OpenAI</MenuItem>
                    <MenuItem value={"Bytedance"}>Bytedance</MenuItem>
                </Select>
            </FormControl>
            <Button
                variant="outlined"
                onClick={()=> {
                    let params = new Map<string, string>()
                    params.set("action", "tts")
                    params.set("model", encodeURIComponent(model))
                    let post_params = new FormData()
                    post_params.set("text", encodeURIComponent(text))
                    CallAudioPost(params, post_params).then(value => {
                        const text = value
                        console.log(text)
                        const resp: ResultResp = JSON.parse(text);
                        console.log(resp)
                    })
                }}>
                TTS
            </Button>
        </Box>
    )
}
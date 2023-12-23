'use client'
import * as React from 'react';
import {Divider, FormControlLabel, IconButton, Paper, TextField} from "@mui/material";
import SearchIcon from '@mui/icons-material/Search';
import Button from "@mui/material/Button";
import {CallFileAction} from "@/app/api/route";
import Checkbox from "@mui/material/Checkbox";
import Grid from "@mui/material/Grid";

interface Answer {
    answer: FileSize[]
    total_size: string
    status: string
}

interface FileSize {
    file_full_path: string
    file_size: string
}
interface FileSizeArray {
    filesize: FileSize[]
}

function FileList({filesize}: FileSizeArray) {
    // const [fileList, setFileList] = React.useState<FileSize[]>([]);

    return (
        filesize.map((file_size) => (
            <Grid key={crypto.randomUUID()} container direction="row">
                <p key={crypto.randomUUID()}>
                    {file_size.file_full_path} {file_size.file_size}
                </p>
                <Divider key={crypto.randomUUID()}/>
                <Button key={crypto.randomUUID()}
                    onClick={()=> {
                        let params = new Map<string, string>()
                        params.set("path", encodeURIComponent(file_size.file_full_path))
                        params.set("action", "open_file")
                        params.set("recursively", "false")
                        CallFileAction(params).then((value)=>{
                            console.log(value)
                        })
                    }}>
                        Open
                </Button>
            </Grid>
        ))
    )
}

export default function FileSizeList() {
    const [path, setPath] = React.useState("wtf");
    const [searchName, setSearchName] = React.useState("");
    const [isRecursively, setIsRecursively] = React.useState(true);
    const [fileArray, setFileArray] = React.useState<FileSize[]>(
        []
    )
    const [totalSize, setTotalSize] = React.useState("");

    return (
        <Paper
            component="form">
            <TextField variant="outlined" value={path} onChange={(v) => setPath(v.target.value)
            }>
            </TextField>
            <FormControlLabel control={
                <Checkbox defaultChecked={true} value="Recursively" onChange={(v)=>setIsRecursively(v.target.checked)}/>
            } label="Recursively">
            </FormControlLabel>
            <IconButton color="primary" sx={{ p: '10px' }} aria-label="directions"
                onClick={()=> {
                    let params = new Map<string, string>()
                    params.set("path", encodeURIComponent(path))
                    params.set("action", "get_file_size_list")
                    params.set("recursively", isRecursively.toString())
                    CallFileAction(params).then(value => {
                        const resp_content : Answer = JSON.parse(value)
                        setTotalSize(resp_content.total_size)
                        const filesize_array : FileSize[] = resp_content.answer
                        console.log(filesize_array)
                        setFileArray([])
                        for (let i = 0; i < filesize_array.length; i++) {
                            let filesize: FileSize = {
                                file_full_path: filesize_array[i].file_full_path,
                                file_size: filesize_array[i].file_size
                            }
                            setFileArray(current => [...current, filesize])
                        }
                        console.log(fileArray)
                    })}}>
                <SearchIcon />
            </IconButton>
            <TextField variant="outlined" value={searchName} onChange={(v) => setSearchName(v.target.value)
            }>
            </TextField>
            <IconButton color="primary" sx={{ p: '10px' }} aria-label="directions"
                onClick={()=> {
                    let params = new Map<string, string>()
                    params.set("path", encodeURIComponent(path))
                    params.set("action", "get_search_file_size_list")
                    params.set("search", encodeURIComponent(searchName))
                    params.set("recursively", isRecursively.toString())
                    CallFileAction(params).then(value => {
                        const resp_content : Answer = JSON.parse(value)
                        setTotalSize(resp_content.total_size)
                        const filesize_array : FileSize[] = resp_content.answer
                        console.log(filesize_array)
                        setFileArray([])
                        for (let i = 0; i < filesize_array.length; i++) {
                            let filesize: FileSize = {
                                file_full_path: filesize_array[i].file_full_path,
                                file_size: filesize_array[i].file_size
                            }
                            setFileArray(current => [...current, filesize])
                        }
                        console.log(fileArray)
                    })}}>
                <SearchIcon />
            </IconButton>
            <p>Total Size: {totalSize}</p>
            <FileList filesize={fileArray}/>

        </Paper>

    )
}

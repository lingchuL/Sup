'use client'
import * as React from 'react';
import {Divider, FormControlLabel, IconButton, Paper, TextField} from "@mui/material";
import SearchIcon from '@mui/icons-material/Search';
import Button from "@mui/material/Button";
import {CallFileAction} from "@/app/api/route";
import Checkbox from "@mui/material/Checkbox";

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
            <div key={crypto.randomUUID()}>
                <p key={crypto.randomUUID()}>
                    {file_size.file_full_path} {file_size.file_size}
                </p>
                <Divider key={crypto.randomUUID()}/>
                <Button key={crypto.randomUUID()}
                    onClick={()=> {
                    CallFileAction(file_size.file_full_path, "open_file", false).then((value)=>{
                        console.log(value)
                    })
                }}>
                    Open
                </Button>
            </div>
        ))
    )
}

export default function FileSizeList() {
    const [path, setPath] = React.useState("wtf");
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
                    CallFileAction(path, "get_file_size_list", isRecursively).then(value => {
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

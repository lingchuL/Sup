'use client'
import * as React from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import MuiDrawer from '@mui/material/Drawer';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Badge from '@mui/material/Badge';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Link from '@mui/material/Link';
import MenuIcon from '@mui/icons-material/Menu';
import AlertDialog from "@/app/main/dir_file/AlertDialog";
import Toolbar from "@mui/material/Toolbar";
import {useCallback, useState} from "react";
import {FileListPage, FileSize} from "@/app/main/dir_file/file_size_list";
import Button from "@mui/material/Button";
import {CallDirFilePost} from "@/app/api/route";

function DropFile() {
    const [dragOver, setDragOver] = useState(false)
    const [fileList, setFileList] = useState<FileSize[]>([])

    const handleDragOver = useCallback((event: any) => {
        event.preventDefault()
        setDragOver(true)
        console.log("drag over")
    }, [])

    const handleDrop = useCallback((event: any) => {
        event.preventDefault()
        setDragOver(false)
        if (event.dataTransfer.files) {
            let fileSizeList = new Array<FileSize>()
            for (const filesKey in event.dataTransfer.files) {
                let file = event.dataTransfer.files[filesKey]
                if (file.path == undefined) continue
                let fileSize = {"file_full_path": file.path, "file_size": ""}
                fileSizeList.push(fileSize)
                setFileList(fileSizeList)
            }
        }
    }, [])

    return (
        <Paper
            onDragOver={handleDragOver}
            onDrop={handleDrop}>
            wtf
            <Box>
                <Button
                    onClick={() => {
                        console.log(fileList)
                        let params = new Map<string, string>()
                        params.set("action", "transform_pic")
                        let post_params = new FormData()
                        post_params.set("file_list", JSON.stringify(fileList))
                        console.log(JSON.stringify(fileList))
                        CallDirFilePost(params, post_params).then((v) => {
                            console.log(v)
                        })
                    }}>
                    Transform
                </Button>
            </Box>
            <FileListPage filesize={fileList}/>
        </Paper>
    )
}

export default function PicHandlePage() {
    return (
        <div>
            <Toolbar/>
            <Grid item xs={12} flexDirection='column' display='flex'>
                <Container>
                    <DropFile/>
                </Container>
            </Grid>
        </div>
    );
}
'use client'


import {useCallback, useState} from "react";
import {FileListPage, FileSize} from "@/app/main/dir_file/file_size_list";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import {CallDirFilePost} from "@/app/api/route";
import * as React from "react";

function DropFile() {
    const [dragOver, setDragOver] = useState(false)
    const [fileList, setFileList] = useState<FileSize[]>([])
    const [apkPath, setApkPath] = useState("")

    const handleDragOver = useCallback((event: any) => {
        event.preventDefault()
        setDragOver(true)
        console.log("drag over")
    }, [])

    const handleDrop = useCallback((event: any) => {
        event.preventDefault()
        setDragOver(false)
        if (event.dataTransfer.files && event.dataTransfer.files[0]) {
            setApkPath(event.dataTransfer.files[0].path)
            setFileList([{file_full_path: event.dataTransfer.files[0].name, file_size: ""}])
        }
    }, [])

    return (
        <Paper
            onDragOver={handleDragOver}
            onDrop={handleDrop}>
            drop android apk file here
            <Box>
                <Button
                    onClick={() => {
                        let params = new Map<string, string>()
                        params.set("action", "install_block")
                        let post_params = new FormData()
                        post_params.set("apk_path", encodeURIComponent(apkPath))
                        CallDirFilePost(params, post_params).then((v) => {
                            console.log(v)
                        })
                    }}>
                    Install
                </Button>
            </Box>
            <FileListPage filesize={fileList}/>
        </Paper>
    )
}

export function PackageInstallPage() {
    return (
        <div>
            <DropFile/>
        </div>
    )
}
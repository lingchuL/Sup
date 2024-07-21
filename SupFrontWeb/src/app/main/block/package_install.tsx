'use client'


import {useCallback, useState} from "react";
import {FileListPage} from "@/app/main/dir_file/file_size_list";
import {FileSize} from "@/app/utils/util_def";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import {CallDirFilePost} from "@/app/api/route_api";
import * as React from "react";
import {SnackBarInfo} from "@/app/utils/SnackBar";
import {DropFileArea} from "@/app/utils/dropfile";

function DropFile() {
    const [fileList, setFileList] = useState<FileSize[]>([])
    const [showLog, setShowLog] = useState(false)

    return (
        <DropFileArea setFilePathList={setFileList} tipContent={"Drag apk files here."}>
            <Box>
                <Button
                    onClick={() => {
                        let params = new Map<string, string>()
                        params.set("action", "install_block")
                        let post_params = new FormData()
                        post_params.set("apk_path", encodeURIComponent(fileList[0].file_full_path))
                        CallDirFilePost(params, post_params).then((v) => {
                            console.log(v)
                            setShowLog(true)
                        })
                    }}>
                    Install
                </Button>
            </Box>
            <SnackBarInfo autoHideDuration={5000} infoContent={"安装完成"} shouldShow={showLog} setShouldShow={setShowLog}/>
        </DropFileArea>
    )
}

export function PackageInstallPage() {
    return (
        <div>
            <DropFile/>
        </div>
    )
}
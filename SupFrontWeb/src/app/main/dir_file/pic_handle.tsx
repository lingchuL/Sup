'use client'
import * as React from 'react';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Toolbar from "@mui/material/Toolbar";
import {useState} from "react";
import Button from "@mui/material/Button";
import {CallDirFileGet, CallDirFilePost} from "@/app/api/route_api";
import Divider from "@mui/material/Divider";
import {TextField} from "@mui/material";
import {DropFileArea} from "@/app/utils/dropfile";
import {FileSize} from "@/app/utils/util_def";
import {SnackBarInfo} from "@/app/utils/SnackBar";

interface Resp {
    result: ScreenShotImgInfo
    status_code: string
}

interface ScreenShotImgInfo {
    img_uri: string,
    path: string
}

function PicHandle() {
    const [outputDir, setOutputDir] = useState("D:\\AFolderForImage")
    const [fileName, setFileName] = useState("")
    const [fileList, setFileList] = useState<FileSize[]>([])
    const [screenShotImgUri, setScreenShotImgUri] = useState("")
    const [showSnackBar, setShowSnackBar] = useState(false)

    return (
        <div>
            <DropFileArea
                setFilePathList={setFileList}
                tipContent={"Drop pic file here."}
                children={
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
                                    setShowSnackBar(true)
                                })
                            }}>
                            Transform
                        </Button>
                        <SnackBarInfo autoHideDuration={3000} infoContent={"转换完成"} shouldShow={showSnackBar} setShouldShow={setShowSnackBar}/>
                    </Box>
                }
            />
            <DropFileArea
                setFilePathList={setFileList}
                tipContent={"Drop audio file here."}
                children={
                    <Box>
                        <Button
                            onClick={() => {
                                console.log(fileList)
                                let params = new Map<string, string>()
                                params.set("action", "transform_audio")
                                let post_params = new FormData()
                                post_params.set("file_list", JSON.stringify(fileList))
                                console.log(JSON.stringify(fileList))
                                CallDirFilePost(params, post_params).then((v) => {
                                    console.log(v)
                                    setShowSnackBar(true)
                                })
                            }}>
                            Transform
                        </Button>
                        <SnackBarInfo autoHideDuration={3000} infoContent={"转换完成"} shouldShow={showSnackBar} setShouldShow={setShowSnackBar}/>
                    </Box>
                }
            />
            <Divider/>
            <TextField fullWidth label="OutputDir" value={outputDir} onChange={(v) => setOutputDir(v.target.value)}/>
            <TextField fullWidth label="FileName" value={fileName} onChange={(v) => setFileName(v.target.value)}/>
            <Button
                onClick={() => {
                    console.log(fileList)
                    let params = new Map<string, string>()
                    params.set("action", "save_screenshot")
                    params.set("out_dir", encodeURIComponent(outputDir))
                    params.set("name", encodeURIComponent(fileName))
                    CallDirFileGet(params).then((v) => {
                        console.log(v)
                        const resp: Resp = JSON.parse(v)
                        setScreenShotImgUri(resp.result.img_uri)
                        let fileSizeList = new Array<FileSize>()
                        let fileSize = {"file_full_path": resp.result.path, "file_size": ""}
                        fileSizeList.push(fileSize)
                        setFileList(fileSizeList)
                    })
                }}>
                Save ScreenShot
            </Button>
            <img src={screenShotImgUri} width="1080"/>
        </div>
    )
}

export default function PicHandlePage() {
    return (
        <div>
            <Toolbar/>
            <Grid item xs={12} flexDirection='column' display='flex'>
                <Container>
                    <PicHandle/>
                </Container>
            </Grid>
        </div>
    );
}
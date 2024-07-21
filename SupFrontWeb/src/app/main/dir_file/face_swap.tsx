'use client'

import {useState} from "react";
import * as React from "react";
import Container from "@mui/material/Container";
import {PicVideoArea} from "@/app/main/dir_file/pic_video_area";
import Button from "@mui/material/Button";
import {CallVisionPost} from "@/app/api/route_api";
import {Tab, Tabs, TextField} from "@mui/material";
import Toolbar from "@mui/material/Toolbar";
import Box from "@mui/material/Box";
import {CustomTabPanel, a11yProps} from "@/app/utils/tab_panel";


function FaceSwap(outDir: string, dstImgUri: string, srcImgUriList: string[], swapFaceNames: string[], srcFaceNames: string[], srcFaceIdxList: number[]) {
    let faceMapList = new Array<Map<string, string>>()
    let dstFaceIdxList = new Array<string>()
    let srcFaceList = new Array<string>()
    let swapFaceContentList = new Array<string>()

    // 遍历swapFaceNames 只有这部分需要变换
    for (let i = 0; i < swapFaceNames.length; i++) {
        if (swapFaceNames[i] == "") continue

        // src寻找到同名的就记录两者的idx
        let faceMap = new Map<string, string>()
        let found_in_src_img = false
        for (let i_src = 0; i_src < srcFaceNames.length; i_src++) {
            if (swapFaceNames[i] == srcFaceNames[i_src]) {
                faceMap.set(i.toString(), i_src.toString())
                faceMapList.push(faceMap)
                dstFaceIdxList.push(i.toString())
                swapFaceContentList.push(i_src.toString())
                srcFaceList.push(srcImgUriList[i_src])
                found_in_src_img = true
                break
            }
        }
        // src中没找到就直接记录idx和填入的名字
        if (!found_in_src_img) {
            faceMap.set(i.toString(), swapFaceNames[i])
            dstFaceIdxList.push(i.toString())
            swapFaceContentList.push(swapFaceNames[i])
            faceMapList.push(faceMap)
        }
    }
    let params = new Map<string, string>()
    params.set("action", "face_swap")
    params.set("out_dir", outDir)
    params.set("dst_face_idx_list", JSON.stringify(dstFaceIdxList))
    params.set("swap_face_list", JSON.stringify(swapFaceContentList))
    params.set("src_face_idx_list", JSON.stringify(srcFaceIdxList))
    let postParams = new FormData()
    postParams.set("dst_img_uri", dstImgUri)
    postParams.set("src_img_uri_list", JSON.stringify(srcImgUriList))
    CallVisionPost(params, postParams).then((res) => {
        console.log(res)
    })
}

export default function VideoPage() {
    const [dstImgUriList, setDstImgUriList] = useState<string[]>([])
    const [dstFaceNames, setDstFaceNames] = useState<string[]>([])
    const [srcImgUriList, setSrcImgUriList] = useState<string[]>([])
    const [srcFaceNames, setSrcFaceNames] = useState<string[]>([])
    const [srcFaceIdxList, setSrcFaceIdxList] = useState<number[]>([])
    const [stateUpdateNums, setStateUpdateNums] = useState(0)
    const [srcFullImgUri, setSrcFullImgUri] = useState("")
    const [dstFullImgUri, setDstFullImgUri] = useState("")

    const [outDir, setOutDir] = useState("D:\\ATemp\\roop\\faceswap_release_1.1.0\\output")

    const [value, setValue] = useState(0)

    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
    };

    return (
        <Container>
            <TextField variant="outlined" value={outDir} onChange={(v) => setOutDir(v.target.value)
            }>
            </TextField>
            <Button onClick={() => {
                FaceSwap(outDir, dstImgUriList[0], srcImgUriList, dstFaceNames, srcFaceNames, srcFaceIdxList)
            }}>
                FaceSwap
            </Button>
            <Box sx={{ width: '100%' }}>
                <Toolbar />
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
                        <Tab label="Dst" {...a11yProps(0)} />
                        <Tab label="Src" {...a11yProps(1)} />
                    </Tabs>
                </Box>
                <CustomTabPanel value={value} index={0}>
                    <PicVideoArea fullImgUri={srcFullImgUri} setFullImgUri={setSrcFullImgUri}
                                  setFullImgUriList={setDstImgUriList} setFaceNames={setDstFaceNames}
                                  setSrcFaceIdxList={setSrcFaceIdxList} setStateUpdateNums={setStateUpdateNums}/>
                </CustomTabPanel>
                <CustomTabPanel value={value} index={1}>
                    <PicVideoArea fullImgUri={dstFullImgUri} setFullImgUri={setDstFullImgUri}
                                  setFullImgUriList={setSrcImgUriList} setFaceNames={setSrcFaceNames}
                                  setSrcFaceIdxList={setSrcFaceIdxList} setStateUpdateNums={setStateUpdateNums}/>
                </CustomTabPanel>
            </Box>
        </Container>
    )
}
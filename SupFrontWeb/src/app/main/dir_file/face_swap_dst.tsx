
import {useCallback, useRef, useState} from "react";
import ReactPlayer from "react-player";
import {IsImageFile, IsVideoFile} from "@/app/main/dir_file/utils";
import Paper from "@mui/material/Paper";
import Divider from "@mui/material/Divider";
import {Autocomplete, TextField} from "@mui/material";
import Button from "@mui/material/Button";
import {CallDirFileGet, CallVisionPost} from "@/app/api/route_api";
import captureVideoFrame from "capture-video-frame";
import {auto} from "@popperjs/core";
import * as React from "react";
import {ResultResp} from "@/app/utils/util_def";

interface FaceSwapResp {
    result: string[]
    status_code: string
}

interface FaceRowsProps {
    img_uri_list: string[]
    ori_img_uri: string
    setFaceNames: (faceNames: string[]) => void
}

function FaceRows({img_uri_list, ori_img_uri, setFaceNames}: FaceRowsProps) {
    const i_range = Array.from(Array(img_uri_list.length).keys())
    const init_names = new Array<string>(img_uri_list.length).fill("")
    const [selectedNames, setSelectedNames] = useState<string[]>(init_names)
    const [promptNames, setPromptNames] = useState<string[]>(["test"])
    let testNames = new Array<string>(img_uri_list.length).fill("")

    return (
        i_range.map((i_uri) => (
            <div key={crypto.randomUUID()}>
                <Paper>
                    <img src={img_uri_list[i_uri]} height="100"/>
                    <Autocomplete
                        disablePortal
                        id="combo-box-demo"
                        freeSolo={true}
                        onChange={(event, value, reason, details) => {
                            let new_names: string[] = selectedNames
                            new_names[i_uri] = value as string
                            setSelectedNames(new_names)
                            setFaceNames(new_names)
                            testNames = new_names
                            console.log(new_names)
                            console.log(testNames)
                        }}
                        options={promptNames}
                        sx={{ width: 300 }}
                        renderInput={(params) => <TextField {...params} label="FaceName" />}
                    />
                    <Button onClick={() => {
                        let params = new Map<string, string>()
                        params.set("action", "remember_face")
                        console.log(selectedNames)
                        console.log(testNames)
                        params.set("face_name", encodeURIComponent(testNames[i_uri]))
                        params.set("face_idx", i_uri.toString())
                        let postParams = new FormData()
                        postParams.set("imgUri", ori_img_uri)
                        CallVisionPost(params, postParams).then((value) => {
                            console.log(value)
                        })
                    }}>
                        Remember Face
                    </Button>
                    <Button onClick={() => {
                        let new_names: string[] = selectedNames
                        img_uri_list.splice(i_uri, 1)
                        new_names.splice(i_uri, 1)
                        setSelectedNames(new_names)
                        setFaceNames(new_names)
                        testNames = new_names
                        console.log(new_names)
                        console.log(testNames)
                    }}>
                        Delete
                    </Button>
                </Paper>
            </div>
        ))
    )
}

interface PicVideoAreaProps {
    fullImgUri: string
    setFullImgUri: (imgUri: string) => void
    setFullImgUriList: (imgUriList: string[]) => void
    setFaceNames: (faceNames: string[]) => void
    setSrcFaceIdxList: (srcFaceIdxList: number[]) => void
    setStateUpdateNums: (nums: number) => void
}

export function PicVideoArea({fullImgUri, setFullImgUri, setFullImgUriList, setFaceNames, setSrcFaceIdxList, setStateUpdateNums}: PicVideoAreaProps) {
    const playerRef = useRef<ReactPlayer>(null)

    const [dragOver, setDragOver] = useState(false)
    const [isPlaying, setIsPlaying] = useState(false)
    const [isLoop, setIsLoop] = useState(false)
    const [videoFilePath, setVideoFilePath] = useState("");
    const [filePath, setFilePath] = useState("");
    const [exportedFilePath, setExportedFilePath] = useState("");
    const [outDirPath, setOutDirPath] = useState("D:\\AEOut");
    const [currentSeconds, setCurrentSeconds] = useState(0);
    const [startSeconds, setStartSeconds] = useState("0");
    const [endSeconds, setEndSeconds]= useState("");
    const [logDuration, setLogDuration] = useState(0);

    const [isCheckPlay, setIsCheckPlay] = useState(false);

    const [isVideoFile, setIsVideoFile] = useState(false);
    const [imgFile, setImgFile] = useState<File>(new File([], ""))
    const [oriImgUri, setOriImgUri] = useState("")
    const [faceImgUriList, setFaceImgUriList] = useState<string[]>([])

    const [fullImgUris, setFullImgUris] = useState<string[]>([])
    const [stateUpdateTimes, setStateUpdateTimes] = useState(0)

    const [srcIdxList, setSrcIdxList] = useState<number[]>([])

    const handleDragOver = useCallback((event: any) => {
        event.preventDefault()
        setDragOver(true)
    }, [])

    const handleDrop = useCallback((event: any) => {
        event.preventDefault()
        setDragOver(false)
        const file = event.dataTransfer.files[0]
        let objectURL = URL.createObjectURL(file)
        console.log(file)
        console.log(objectURL)
        if (IsVideoFile(file.name)) {
            setVideoFilePath(objectURL)
            setFullImgUri("")
            setIsPlaying(true)
            setIsVideoFile(true)
        }
        else if (IsImageFile(file.name)) {
            setFullImgUri(objectURL)
            setVideoFilePath("")
            setImgFile(file)
            setIsVideoFile(false)
        }
        setFilePath(file.path)
    }, [])

    const handleVideoUpload = (event: any) => {
        const [file] = event.target.files;
        console.log(typeof file)
        setVideoFilePath(URL.createObjectURL(file));
        setIsPlaying(true)
    };

    const handleOnProgress = (progress: any) => {
        console.log(progress)
        setCurrentSeconds(progress.playedSeconds)
        if (isCheckPlay && currentSeconds > parseFloat(endSeconds)) {
            if (playerRef.current != null) {
                playerRef.current.seekTo(parseFloat(startSeconds), "seconds")
            }
        }
    }
    const handleOnDuration = (duration: any) => {
        console.log(duration)
        setLogDuration(duration)
        setEndSeconds(duration.toString())
    }
    const handleOnPause = () => {
        setIsCheckPlay(false)
    }
    const handleOnSeek = () => {
        setIsPlaying(false)
    }

    return (
        <div>
            <Paper
                onDragOver={handleDragOver}
                onDrop={handleDrop}
            >
                Drag and drop video file here
                <input type="file" onChange={handleVideoUpload}/>
                <Divider/>
                <TextField variant="outlined" value={startSeconds} onChange={(v) => {
                    setStartSeconds(v.target.value)
                    if (playerRef.current != null) {
                        playerRef.current.seekTo(parseFloat(v.target.value), "seconds")
                        setIsPlaying(false)
                    }
                }}/>
                <Button onClick={() => {
                    setStartSeconds(currentSeconds.toString())
                }}>
                    Use Current Seconds
                </Button>
                <TextField variant="outlined" value={endSeconds} onChange={(v) => {
                    setEndSeconds(v.target.value)
                    if (playerRef.current != null) {
                        playerRef.current.seekTo(parseFloat(v.target.value), "seconds")
                        setIsPlaying(false)
                    }
                }}/>
                <Button onClick={() => {
                    setEndSeconds(currentSeconds.toString())
                }}>
                    Use Current Seconds
                </Button>
                {currentSeconds}
                <Button onClick={() => {
                    if (playerRef.current != null) {
                        // playerRef.current.seekTo(parseFloat(startSeconds), "seconds")
                        setIsCheckPlay(true)
                        setIsPlaying(true)
                    }
                }}>
                    CheckPlay
                </Button>
                <Button onClick={() => {
                    let params = new Map<string, string>()
                    params.set("action", "export_cut_video")
                    params.set("path", encodeURIComponent(filePath))
                    params.set("start_seconds", startSeconds)
                    params.set("end_seconds", endSeconds)
                    params.set("out_dir", outDirPath)
                    CallDirFileGet(params).then((value) => {
                        console.log(value)
                        const resp: ResultResp = JSON.parse(value);
                        console.log(resp.result)
                        setExportedFilePath(resp.result)
                    })
                }}>
                    Export
                </Button>
                <Button onClick={() => {
                    let params = new Map<string, string>()
                    params.set("action", "export_video_screenshot")
                    params.set("path", encodeURIComponent(filePath))
                    params.set("start_seconds", currentSeconds.toString())
                    params.set("out_dir", outDirPath)
                    CallDirFileGet(params).then((value) => {
                        console.log(value)
                        const resp: ResultResp = JSON.parse(value);
                        console.log(resp.result)
                        setExportedFilePath(resp.result)
                    })
                }}>
                    ScreenShot
                </Button>
                <Button onClick={() => {
                    let imgUri = ""
                    if (isVideoFile) {
                        if (playerRef.current == null) return []
                        const frame = captureVideoFrame(playerRef.current.getInternalPlayer())
                        // console.log(frame)
                        imgUri = frame.dataUri
                        let imgUris = fullImgUris
                        imgUris.push(imgUri)
                        setFullImgUris(imgUris)
                        setFullImgUriList(imgUris)

                        let params = new Map<string, string>()
                        params.set("action", "face_detect")
                        let postParams = new FormData()
                        postParams.set("imgUri", imgUri)
                        console.log(imgFile)
                        CallVisionPost(params, postParams).then((value) => {
                            console.log(value)
                            const resp: FaceSwapResp = JSON.parse(value);
                            console.log(resp.result)
                            let faceImgList: string[] = faceImgUriList
                            let srcFaceIdxList: number[] = srcIdxList
                            for (let i = 0; i < resp.result.length; i++) {
                                faceImgList.push(resp.result[i])
                                srcFaceIdxList.push(i)
                            }
                            setFaceImgUriList(faceImgList)
                            setStateUpdateTimes(stateUpdateTimes + 1)
                            setStateUpdateNums(stateUpdateTimes)
                            setSrcIdxList(srcFaceIdxList)
                            setSrcFaceIdxList(srcFaceIdxList)
                        })
                    }
                    else {
                        let reader = new FileReader();
                        reader.readAsDataURL(imgFile);
                        reader.onload = function (e) {
                            let imgUri = reader.result
                            if (typeof imgUri != "string") return
                            setOriImgUri(imgUri)
                            let imgUris = fullImgUris
                            imgUris.push(imgUri)
                            setFullImgUris(imgUris)
                            setFullImgUriList(imgUris)

                            let params = new Map<string, string>()
                            params.set("action", "face_detect")
                            let postParams = new FormData()
                            postParams.set("imgUri", imgUri)
                            console.log(imgFile)
                            CallVisionPost(params, postParams).then((value) => {
                                console.log(value)
                                const resp: FaceSwapResp = JSON.parse(value);
                                console.log(resp.result)
                                let faceImgList: string[] = faceImgUriList
                                let srcFaceIdxList: number[] = srcIdxList
                                for (let i = 0; i < resp.result.length; i++) {
                                    faceImgList.push(resp.result[i])
                                    srcFaceIdxList.push(i)
                                }
                                setFaceImgUriList(faceImgList)
                                setStateUpdateTimes(stateUpdateTimes + 1)
                                setStateUpdateNums(stateUpdateTimes)
                                setSrcIdxList(srcFaceIdxList)
                                setSrcFaceIdxList(srcFaceIdxList)
                            })
                        }
                    }

                }}>
                    Face Detect
                </Button>
                <TextField variant="outlined" value={outDirPath} onChange={(v) => {
                    setOutDirPath(v.target.value)
                }}/>
                {exportedFilePath}
                <Button onClick={() => {
                    let params = new Map<string, string>()
                    params.set("action", "open_file")
                    params.set("path", encodeURIComponent(exportedFilePath))
                    CallDirFileGet(params).then((value) => {
                        console.log(value)
                    })
                }}>
                    Open
                </Button>
                <Divider/>
                <FaceRows img_uri_list={faceImgUriList} ori_img_uri={oriImgUri} setFaceNames={setFaceNames}/>
                {
                    !isVideoFile && <img src={fullImgUri} height="600"/>
                }
                {
                    isVideoFile &&
                    <ReactPlayer url={videoFilePath}
                           width={auto} height="720px"
                           controls={true} playing={isPlaying} loop={isLoop} progressInterval={50}
                           onProgress={handleOnProgress}
                           onDuration={handleOnDuration}
                           onPause={handleOnPause}
                           onSeek={handleOnSeek}
                           ref={playerRef}
                           config={{
                               file: {
                                   attributes: {
                                       crossorigin: "anonymous"
                                   }
                               }
                           }}
                    />
                }

            </Paper>
        </div>
    )
}
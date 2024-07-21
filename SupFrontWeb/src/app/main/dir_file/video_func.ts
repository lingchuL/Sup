import captureVideoFrame from "capture-video-frame";
import {CallVisionPost} from "@/app/api/route_api";
import ReactPlayer from "react-player";
import * as React from "react";

interface FaceSwapResp {
    result: string[]
    status_code: string
}

interface ImgUriList {
    img_uri_list: string[]
}

export function VideoFaceDetect(playerRef: React.RefObject<ReactPlayer>): string[] {
    if (playerRef.current == null) return []
    const frame = captureVideoFrame(playerRef.current.getInternalPlayer())
    // console.log(frame)
    let params = new Map<string, string>()
    params.set("action", "face_detect")
    let postParams = new FormData()
    postParams.set("imgUri", frame.dataUri)
    CallVisionPost(params, postParams).then((value) => {
        console.log(value)
        const resp: FaceSwapResp = JSON.parse(value);
        console.log(resp.result)
        return resp.result
    })
    return []
}

export function ImageFaceDetect(imgFile: File): string[] {
    let reader = new FileReader();
    reader.readAsDataURL(imgFile);
    reader.onload = function (e) {
        let imgUri = reader.result
        if (typeof imgUri == "string") {
            let params = new Map<string, string>()
            params.set("action", "face_detect")
            let postParams = new FormData()
            postParams.set("imgUri", imgUri)
            console.log(imgFile)
            CallVisionPost(params, postParams).then((value) => {
                console.log(value)
                const resp: FaceSwapResp = JSON.parse(value);
                console.log(resp.result)
                return resp.result
            })
        }
    }
    return []
}
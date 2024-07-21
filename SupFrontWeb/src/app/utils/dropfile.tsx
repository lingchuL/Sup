import React, {useCallback, useState} from "react";
import {FileListPage} from "@/app/main/dir_file/file_size_list";
import {FileSize} from "@/app/utils/util_def";
import Paper from "@mui/material/Paper";
import is from "@sindresorhus/is";
import set = is.set;

// 拖入文件区域组件

interface DropFileProps {
    setFilePathList: (filePathList: FileSize[]) => void
    children: React.ReactNode
    tipContent: string
}

export function DropFileArea({setFilePathList, children, tipContent}: DropFileProps) {
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
                // 更新父组件内容
                setFilePathList(fileSizeList)
                // 保持自身更新
                setFileList(fileSizeList)
            }
        }
    }, [])

    return (
        <Paper
            onDragOver={handleDragOver}
            onDrop={handleDrop}>
            {tipContent}
            <FileListPage filesize={fileList}/>
            {children}
        </Paper>
    )
}
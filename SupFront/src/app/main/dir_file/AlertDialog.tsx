'use client'
import * as React from "react";
import Button from "@mui/material/Button";
import {CallDirFileGet, Get_Json} from "@/app/api/route";
import {Dialog, TextField} from "@mui/material";
import FileSizeList from "@/app/main/dir_file/file_size_list";
import {useEffect} from "react";

interface Resp {
    answer: string
}

export default function AlertDialog() {
    const [open, setOpen] = React.useState(false);
    const [content, setContent] = React.useState("wtf");

    const handleClickOpen = () => {
        setOpen(true);
    };
    const handleClose = () => {
        setOpen(false);
    };
    const setText = (data: string) => {
        setContent(data);
    };

    return (
        <React.Fragment>
            <Button
                variant="outlined"
                onClick={()=> {
                    Get_Json().then(value => {
                        const resp: Resp = JSON.parse(value);
                        console.log(resp.answer)
                        setText(resp.answer)
                        handleClickOpen()
                    })
                }}>
                Fuck
            </Button>
            <Dialog
                open={open}
                onClose={handleClose}
            >
                {content}
            </Dialog>
            <FileSizeList></FileSizeList>
        </React.Fragment>
    );
}
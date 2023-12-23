'use client'
import * as React from "react";
import Button from "@mui/material/Button";
import {CallFileAction, Get_Json} from "@/app/api/route";
import {Dialog, TextField} from "@mui/material";
import FileSizeList from "@/app/main/file_size_list";
import {useEffect} from "react";

interface Answer {
    answer: string;
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
                        const text = value
                        console.log(text)
                        const text_answer: Answer = JSON.parse(text);
                        console.log(text_answer)
                        setText(text_answer.answer)
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
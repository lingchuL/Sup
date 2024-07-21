'use client'
import * as React from "react";
import Button from "@mui/material/Button";
import {Get_Json} from "@/app/api/route_api";
import {Dialog} from "@mui/material";
import FileSizeList from "@/app/main/dir_file/file_size_list";
import {ResultResp} from "@/app/utils/util_def";

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
                        const resp: ResultResp = JSON.parse(value);
                        console.log(resp.result)
                        setText(resp.result)
                        handleClickOpen()
                    })
                }}>
                Test
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
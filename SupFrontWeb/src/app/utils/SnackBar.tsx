import {Snackbar} from "@mui/material";
import * as React from "react";

interface SnackBarInfoProps {
    autoHideDuration: number
    infoContent: string
    shouldShow: boolean
    setShouldShow: (shouldShow: boolean)=>void
}

export function SnackBarInfo({autoHideDuration, infoContent, shouldShow, setShouldShow}: SnackBarInfoProps) {
    return (
        <Snackbar
            open={shouldShow}
            autoHideDuration={autoHideDuration}
            message={infoContent}
            onClose={()=>{setShouldShow(false)}}
        />
    )
}

'use client'

import Grid from "@mui/material/Grid";
import Container from "@mui/material/Container";
import {CircularProgress, IconButton, Snackbar, TextField} from "@mui/material";
import {CallCopilotAction} from "@/app/api/route";
import SearchIcon from "@mui/icons-material/Search";
import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";
import * as React from "react";
import Toolbar from "@mui/material/Toolbar";

interface Resp {
    result: string,
    status_code: string
}

export default function CopilotPage() {
    const [message, setMessage] = React.useState("");
    const [answer, setAnswer] = React.useState("");

    return (
        <Grid container spacing={2}>
            <Toolbar />
            <Container maxWidth="lg">
                <TextField variant="outlined" value={message} onChange={(v) => setMessage(v.target.value)
                }>
                </TextField>
                <Button variant="outlined"
                        onClick={() => {
                            let params = new Map<string, string>()
                            params.set("action", "handle_message")
                            params.set("message", encodeURIComponent(message))
                            CallCopilotAction(params).then(value => {
                                const resp: Resp = JSON.parse(value)
                                console.log(resp.result)
                                setAnswer(resp.result)
                            })
                        }}>
                    Send
                </Button>
                {answer}
            </Container>
        </Grid>
    )
}
'use client'

import {TextField} from "@mui/material";
import {CallCopilotAction} from "@/app/api/route";
import Button from "@mui/material/Button";
import * as React from "react";
import Toolbar from "@mui/material/Toolbar";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";

interface Resp {
    result: string,
    status_code: string
}

export default function CopilotPage() {
    const [message, setMessage] = React.useState("");
    const [answer, setAnswer] = React.useState("");

    return (
        <Box width="100%">
            <Toolbar />
            <Box width="100%">
                <TextField variant="outlined" value={message} onChange={(v) => setMessage(v.target.value)
                } fullWidth={true}/>
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
            </Box>
        </Box>
    )
}
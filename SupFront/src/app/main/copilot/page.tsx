'use client'

import {TextField} from "@mui/material";
import {CallCopilotAction} from "@/app/api/route";
import Button from "@mui/material/Button";
import * as React from "react";
import Toolbar from "@mui/material/Toolbar";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import {useEffect, useState} from "react";

interface Resp {
    result: string,
    status_code: string
}

interface chatHistory {
    messages: string[]
}

function ChatHistory({messages}: chatHistory){
    return (
        messages.map((msg: string) => {
            return (
                <p key={crypto.randomUUID()}>{msg}</p>
            )
        })
    )
}

export default function CopilotPage() {
    const [message, setMessage] = React.useState("");
    const [chatHistory, setChatHistory] = React.useState<string[]>([]);
    const [chatDialogue, setChatDialogue]= React.useState("");
    const [num, setNum] = useState(0);

    function sendMessage(message: string, history: string, log: string[]) {
        console.log(history)
        history += "user: " + message + "\n"
        log.push("user: " + message)
        let params = new Map<string, string>()
        params.set("action", "handle_message")
        params.set("message", encodeURIComponent(message))
        CallCopilotAction(params).then(value => {
            const resp: Resp = JSON.parse(value)
            console.log(resp.result)
            history += "copilot: " + resp.result + "\n"
            log.push("copilot: " + resp.result)
            console.log(history)
            setChatDialogue(history)
            setChatHistory(log)
            console.log(chatDialogue)
        })
    }

    return (
        <Box width="100%">
            <Toolbar />
            <Box width="100%">
                <TextField variant="outlined" value={message} onChange={(v) => setMessage(v.target.value)
                } fullWidth={true}/>
                <Button variant="outlined"
                        onClick={() => {
                            // AddChat("user", message)
                            setNum(num + 1)
                            setChatDialogue(chatDialogue + "user: " + message + "\n")
                            sendMessage(message, chatDialogue, chatHistory)
                        }}>
                    Send
                </Button>
                <ChatHistory messages={chatHistory} />
                {/*<Container>*/}
                {/*    {chatDialogue}*/}
                {/*</Container>*/}
            </Box>
        </Box>
    )
}
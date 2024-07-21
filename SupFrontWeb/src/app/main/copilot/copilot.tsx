'use client'

import * as React from "react";
import {CallCopilotAction, CallDatabasePost} from "@/app/api/route_api";
import Box from "@mui/material/Box";
import {Autocomplete, FormControl, InputLabel, MenuItem, Select, TextField} from "@mui/material";
import Button from "@mui/material/Button";
import {ResultResp} from "@/app/utils/util_def";
import {useEffect} from "react";

interface chatHistory {
    messages: string[]
}

interface ChatLogsResp {
    result: string[]
    status_code: string
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

    const [model, setModel] = React.useState("openai gpt-3.5-turbo");
    const [chatLogs, setChatLogs] = React.useState<string[]>([]);
    const [chatLogName, setChatLogName] = React.useState("");

    useEffect(() => {
        getChatLogs()
    }, []);

    useEffect(() => {
        return () => {
            if (chatDialogue.length > 0) {
                newTopic()
            }
        }
    }, []);

    function sendMessage(message: string, model: string, history: string, log: string[]) {
        console.log(history)
        history += "user: " + message + "\n"
        log.push("user: " + message)
        let arg_params = new Map<string, string>()
        arg_params.set("action", "handle_message")
        arg_params.set("model", model)
        let post_params = new FormData()
        post_params.set("message", encodeURIComponent(message))
        CallCopilotAction(arg_params, post_params).then(value => {
            const resp: ResultResp = JSON.parse(value)
            console.log(resp.result)
            history += "copilot: " + resp.result + "\n"
            log.push("copilot: " + resp.result)
            console.log(history)
            setChatDialogue(history)
            setChatHistory(log)
            console.log(chatDialogue)
        })
    }

    function newTopic() {
        let arg_params = new Map<string, string>()
        arg_params.set("action", "new_topic")
        let post_params = new FormData()
        CallCopilotAction(arg_params, post_params).then(value => {
            const resp: ResultResp = JSON.parse(value)
            console.log(resp.result)
        })
    }

    function getChatLogs() {
        let arg_params = new Map<string, string>()
        arg_params.set("action", "get_jdb_db_tb_names")
        arg_params.set("db_name", "copilot_chat_log")
        let post_params = new FormData()
        CallDatabasePost(arg_params, post_params).then(value => {
            const resp: ChatLogsResp = JSON.parse(value)
            console.log(resp.result)
            setChatLogs(resp.result)
        })
    }

    function loadChatLogs(in_chat_log_name=chatLogName) {
        let arg_params = new Map<string, string>()
        arg_params.set("action", "load_chat_log")
        arg_params.set("chat_log_name", chatLogName)
        let post_params = new FormData()
        CallCopilotAction(arg_params, post_params).then(value => {
            const resp: ResultResp = JSON.parse(value)
            console.log(resp.result)
            setChatDialogue(resp.result)
            setChatHistory(resp.result.split("\n"))
        })
    }

    return (
        <Box>
            <FormControl>
                <InputLabel id="model-select-label">OutputType</InputLabel>
                <Select
                    labelId="model-select-label"
                    id="model-select"
                    value={model}
                    label="Model"
                    onChange={(v) => {setModel(v.target.value) }}
                >
                    <MenuItem value={"openai gpt-3.5-turbo"}>OpenAI GPT-3.5-Turbo</MenuItem>
                    <MenuItem value={"openai gpt-4"}>OpenAI GPT-4</MenuItem>
                    <MenuItem value={"moonshot kimi"}>Moonshot Kimi</MenuItem>
                </Select>
            </FormControl>
            <Autocomplete
                // disableClearable
                freeSolo
                id="tbName-box"
                sx={{ width: 300}}
                value={chatLogName} onChange={(event, newValue)=>{
                    newValue?setChatLogName(newValue):setChatLogName("");
                }}
                renderInput={(params) =>
                    <TextField label="Chat Logs" {...params}/>
                } options={chatLogs}
            />
            <Button variant="outlined" onClick={()=>{
                // newTopic();
                loadChatLogs(chatLogName);
            }}>
                Load Chat Log
            </Button>
            <Box width="100%">
                <TextField variant="outlined" value={message} onChange={(v) => setMessage(v.target.value)
                } fullWidth={true}/>
                <Button variant="outlined"
                        onClick={() => {
                            setChatDialogue(chatDialogue + "user: " + message + "\n")
                            sendMessage(message, model, chatDialogue, chatHistory)
                        }}>
                    Send
                </Button>
                <Button variant="outlined"
                        onClick={() => {
                            setChatHistory([])
                            setChatDialogue("")
                            setMessage("")
                            newTopic()
                        }}>
                    New Topic
                </Button>
                <ChatHistory messages={chatHistory} />
            </Box>
        </Box>
    )
}
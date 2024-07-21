'use client'
import {Divider, TextField} from "@mui/material";
import * as React from "react";
import Button from "@mui/material/Button";
import {CallDatabasePost} from "@/app/api/route_api";
import Grid from "@mui/material/Grid";

interface Resp {
    result: DocResult[]
    status_code: string
}

interface DocResultArray {
    docResults: DocResult[]
    dbName: string
}

interface DocResult {
    ids: string
    metadatas: Map<string, string>
    documents: string
}

export function QueryResult({docResults, dbName}: DocResultArray) {
    if (docResults) {
        return (
            docResults.map((docResult) => (
                <Grid key={crypto.randomUUID()} container direction="row">
                    <div>
                        {docResult.ids} {docResult.documents}
                    </div>
                    <div>
                        {Object.entries(docResult.metadatas).map(([key, value]) => (
                            <div key={crypto.randomUUID()}>
                                {key}: {value}
                            </div>
                        ))
                        }
                    </div>
                    <Divider/>
                    <Button
                            onClick={()=> {
                                let params = new Map<string, string>()
                                params.set("action", "delete")
                                params.set("db_name", dbName)
                                params.set("ids", docResult.ids)
                                let post_params = new FormData()
                                CallDatabasePost(params, post_params).then((value)=>{
                                    console.log(value)
                                })
                            }}>
                        Delete
                    </Button>
                </Grid>
            ))
        )
    }
    return (
        <div/>
    )
}

export default function ChromadbUIPage() {
    const [dbName, setDbName] = React.useState("")
    const [docResults, setDocResults] = React.useState<DocResult[]>([])

    return (
        <div>
            <TextField variant="outlined" value={dbName} onChange={(v) => {
                setDbName(v.target.value)
            }}/>
            <Button onClick={() => {
                let params = new Map<string, string>()
                params.set("action", "query_all_chromadb")
                params.set("db_name", dbName)
                let post_params = new FormData()
                CallDatabasePost(params, post_params).then((res) => {
                    console.log(res)
                    const resp: Resp = JSON.parse(res);
                    console.log(resp.result)
                    let queryResults = resp.result
                    setDocResults(queryResults)
                })
            }}>
                Query
            </Button>
            <QueryResult docResults={docResults} dbName={dbName}/>
        </div>
    )
}
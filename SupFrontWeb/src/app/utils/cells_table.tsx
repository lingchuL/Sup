import {TextField} from "@mui/material";
import * as React from "react";
import {GridColDef} from "@mui/x-data-grid";

export interface TableUIProps {
    tb_data: TableData
}

// export interface TableData {
//     tb_head_list: string[]
//     tb_data: OneLineData[]
// }
export interface TableData {
    columns: GridColDef[]
    rows: []
}

interface OneLineData {
    line_id: string
    cells: CellData[]
}

interface CellData {
    attr_key: string
    value: string
}

function Cell(data: CellData) {
    return (
        <div>
            <TextField variant="outlined" value={data.value} onChange={(v) => {
                console.log("here!")
                console.log(v.target.value)
            }}/>
        </div>
    )
}

function OneLine(data: OneLineData) {
    return (
        <div>
            <Cell attr_key={data.cells[0].attr_key} value={data.cells[0].value}></Cell>
        </div>
    )
}

export function TableUI({tb_data}: TableUIProps) {
    // const [headList, setHeadList] = React.useState<string[]>(tb_head_list)
    // const [tbData, setTbData] = React.useState<OneLineData[]>(tb_data)

    return (
        <div>
            {/*<div>*/}
                {/*{tb_data.tb_head_list.map((v, i) => {*/}
                {/*    return <p>{v}</p>*/}
                {/*})}*/}
            {/*</div>*/}
            {/*{tb_data.tb_data.length > 0 && <div>*/}
                {/*<p>{tb_data.tb_head_list[0]}</p>*/}
                {/*<OneLine line_id={tb_data.tb_data[0].line_id} cells={tb_data.tb_data[0].cells}></OneLine>*/}
            {/*</div>}*/}
        </div>
    )
}
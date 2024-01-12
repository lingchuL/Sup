import {useState} from "react";
import Grid from "@mui/material/Grid";
import {Divider, IconButton, Snackbar, TextField} from "@mui/material";
import {CallCfgAudioAction} from "@/app/api/route";
import SaveIcon from "@mui/icons-material/Save";
import * as React from "react";

export interface CfgProps {
    project_dir: string
}

export interface AttrProperty {
    attr_value: string
    is_editable: boolean
}

export interface RowAttr {

}

export interface Row {
    key: string,
    attr_names: string[],
    attr_values: string[],
    attr_is_editable: boolean[]
}

export function formAttr(id_: string, param_name: string, param_value: string, is_editable: boolean = true) {
    return {key: id_, attr_names: [param_name], attr_values: [param_value], attr_is_editable: [is_editable]} as Row
}

export function GetNewRows(rows: Row[], key: string, in_attr_name: string, in_attr_value: string) {
    let newRows: Row[] = []
    // 遍历属性列表，修改同key的一行属性的值
    rows.forEach(row => {
        let newRow: Row = row
        // 修改可编辑属性的值
        if (row.key == key) {
            row.attr_names.map((attr_name, idx) => {
                newRow.attr_names[idx] = attr_name
                newRow.attr_values[idx]= row.attr_values.at(idx) as string
                newRow.attr_is_editable[idx] = row.attr_is_editable.at(idx) as boolean

                if (attr_name == in_attr_name) {
                    newRow.attr_values[idx] = in_attr_value
                    newRow.attr_is_editable[idx] = true
                }
            })
        }
        newRows.push(newRow)
    })
    return newRows
}

export interface AttrRowsArgs {
    project_dir: string,
    rows: Row[]
}


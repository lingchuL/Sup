'use client'
import * as React from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import Grid from '@mui/material/Grid';
import Button from "@mui/material/Button";
import AlertDialog from "@/app/AlertDialog";
import {Dialog} from "@mui/material";
import FileSizeList from "@/app/file_size_list";
import Dashboard from "@/app/Dashboard";



export default function MainPage() {
    return (
        <div>
            {/*<AlertDialog></AlertDialog>*/}
            <Dashboard></Dashboard>
        </div>
    );
}
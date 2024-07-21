'use client'
import * as React from 'react';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Toolbar from "@mui/material/Toolbar";
import {useState} from "react";
import {TextField} from "@mui/material";
import BarChart from "@/app/utils/LinePlot";
import ForceChart from "@/app/utils/Force";

export default function MoveFilePage() {
    const [destDir, setDestDir] = useState("")

    return (
        <div>
            <Toolbar/>
            <Grid item xs={12} flexDirection='column' display='flex'>
                <Container>
                    <TextField variant="outlined" value={destDir} onChange={(v) => setDestDir(v.target.value)
                    }/>
                </Container>
                {/*<ForceChart/>*/}
                <BarChart/>
            </Grid>
        </div>
);
}
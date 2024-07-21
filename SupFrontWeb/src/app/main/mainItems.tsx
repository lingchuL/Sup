'use client'
import * as React from "react";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import GraphicEqIcon from '@mui/icons-material/GraphicEq';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import ArticleIcon from '@mui/icons-material/Article';
import CropDinIcon from '@mui/icons-material/CropDin';

import { useRouter } from 'next/navigation'
import {Storage} from "@mui/icons-material";

export default function MainItems() {
    const router = useRouter()

    return (
        <React.Fragment>
            <ListItemButton onClick={() => router.push("/main")}>
                <ListItemIcon>
                    <ArticleIcon/>
                </ListItemIcon>
                <ListItemText primary="DirFile"/>
            </ListItemButton>
            <ListItemButton onClick={() => router.push("/main/audio")}>
                <ListItemIcon>
                    <GraphicEqIcon/>
                </ListItemIcon>
                <ListItemText primary="Audio"/>
            </ListItemButton>
            <ListItemButton onClick={() => router.push("/main/block")}>
                <ListItemIcon>
                    <CropDinIcon/>
                </ListItemIcon>
                <ListItemText primary="Config"/>
            </ListItemButton>
            <ListItemButton onClick={() => router.push("/main/copilot")}>
                <ListItemIcon>
                    <SmartToyIcon/>
                </ListItemIcon>
                <ListItemText primary="Copilot"/>
            </ListItemButton>
            <ListItemButton onClick={() => router.push("/main/database")}>
                <ListItemIcon>
                    <Storage/>
                </ListItemIcon>
                <ListItemText primary="Database"/>
            </ListItemButton>
        </React.Fragment>
    )
}
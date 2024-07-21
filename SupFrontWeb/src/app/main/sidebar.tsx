import * as React from 'react';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import SettingsIcon from '@mui/icons-material/Settings';
import {Extension} from "@mui/icons-material";
import {useRouter} from "next/navigation";

export default function SecondaryListItems() {
    const router = useRouter()

    return (
        <React.Fragment>
            {/*<ListSubheader component="div" inset>*/}
            {/*    Saved reports*/}
            {/*</ListSubheader>*/}
            <ListItemButton onClick={() => router.push("/main/plugins")}>
                <ListItemIcon>
                    <Extension />
                </ListItemIcon>
                <ListItemText primary="Plugins"/>
            </ListItemButton>
            <ListItemButton onClick={() => router.push("/main/settings")}>
                <ListItemIcon>
                    <SettingsIcon />
                </ListItemIcon>
                <ListItemText primary="Settings"/>
            </ListItemButton>
        </React.Fragment>
    )
}

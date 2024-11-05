import React, { useState } from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import DrawerCustom from './DrawerCustom';
import LogoutIcon from '@mui/icons-material/Logout';
import { colors } from '../Constant/Colors';

const Header = () => {
    const [open, setOpen] = useState(false);
    return (
        <Box sx={{ flexGrow: 0 }}>
            <AppBar position="static" sx={{ backgroundColor: colors.primary }} elevation={2} >
                <Toolbar variant="dense">
                    <Box className="flex items-center flex-1" >
                        <IconButton edge="start" aria-label="menu" sx={{ mr: 2 }} onClick={() => setOpen(true)}>
                            <MenuIcon sx={{ color: colors.third }} />
                        </IconButton>
                        <Typography variant="h6" color="inherit" component="div">
                            AhaNex
                        </Typography>
                    </Box>
                    <Box className="flex items-center">
                        <IconButton edge="start" color="inherit" aria-label="menu" sx={{ mr: 2 }}>
                            <LogoutIcon color='primary' />
                        </IconButton>
                    </Box>
                </Toolbar>
            </AppBar>
            <DrawerCustom open={open} setOpen={setOpen} />
        </Box>
    )
}

export default Header
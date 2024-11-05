import React, { useState } from 'react'
import IconButton from '@mui/joy/IconButton';
import Drawer from '@mui/joy/Drawer';
import Input from '@mui/joy/Input';
import List from '@mui/joy/List';
import ListItemButton from '@mui/joy/ListItemButton';
import ListItem from '@mui/joy/ListItem';
import Typography from '@mui/joy/Typography';
import ModalClose from '@mui/joy/ModalClose';
import Menu from '@mui/icons-material/Menu';
import Search from '@mui/icons-material/Search';
import Divider from '@mui/joy/Divider';
import { Home, KeyboardArrowDown, KeyboardArrowRight, OpenInNew, ReceiptLong } from '@mui/icons-material';
import ListItemDecorator from '@mui/joy/ListItemDecorator';
import ListItemContent from '@mui/joy/ListItemContent';
import ToggleOffIcon from '@mui/icons-material/ToggleOff';
import SettingsIcon from '@mui/icons-material/Settings';
import { useNavigate } from 'react-router-dom';

const DrawerMenu = ({ item }) => {

    const navigate = useNavigate()
    const [open, setOpen] = useState(false);

    return (
        <List
            nested="true"
            size="sm"
            sx={{
                "--ListItem-minHeight": "27px",
                "--ListItemDecorator-size": "28px",
                "--ListItem-radius": "5px",
                "--List-gap": "3px",
                "--List-padding": "2px",
                "--ListItem-paddingLeft": "5px",
                "--ListItem-paddingRight": "5px",
                "--ListItem-paddingY": "2px",
                "--List-nestedInsetStart": "2px",
                "fontSize": "13px"
            }}
        >
            <ListItem
                nested
                sx={{ mx: 1, }}
            >
                <ListItem onClick={() => setOpen(!open)} >
                    <ListItemButton variant="soft" sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }} >
                        <ListItemDecorator>
                            {/* <Home fontSize='small' className='flex text-[#636b74]' /> */}
                            {item.icon}
                        </ListItemDecorator>
                        <ListItemContent  >{item.name}</ListItemContent>
                        <KeyboardArrowRight sx={{ transform: open ? 'rotate(-90deg)' : 'rotate(90deg)' }} />
                    </ListItemButton>
                </ListItem>
                {open && (
                    <List sx={{ "--List-nestedInsetStart": "0px" }}>
                        {
                            item?.submenu?.map((item, index) => {
                                return (
                                    <ListItem key={index} >
                                        <ListItemButton onClick={() => navigate(item.navigate)} >
                                            <ListItemDecorator>
                                                <ToggleOffIcon fontSize='small' className='text-[#636b74]' />
                                            </ListItemDecorator>
                                            {item.name}
                                        </ListItemButton>
                                    </ListItem>
                                )
                            })
                        }
                    </List>
                )}
            </ListItem>
        </List>
    )
}

export default DrawerMenu
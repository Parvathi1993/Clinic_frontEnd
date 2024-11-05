import React from 'react'
import Box from '@mui/joy/Box';
import IconButton from '@mui/joy/IconButton';
import Drawer from '@mui/joy/Drawer';
import Typography from '@mui/joy/Typography';
import ModalClose from '@mui/joy/ModalClose';
import Divider from '@mui/joy/Divider';
import { Home, OpenInNew } from '@mui/icons-material';
import DrawerMenu from './DrawerMenu';
import SettingsIcon from '@mui/icons-material/Settings';
import LogoutIcon from '@mui/icons-material/Logout';
import SummarizeIcon from '@mui/icons-material/Summarize';
import MedicationIcon from '@mui/icons-material/Medication';

const DrawerCustom = ({ open, setOpen }) => {

    const menuName = [
        {
            slno: 1,
            name: 'OP Billing',
            icon: <Home fontSize='small' className='flex text-[#636b74]' />,
            submenu: [
                {
                    slno: 1,
                    name: 'Registration',
                    icon: <OpenInNew fontSize='small' className='text-[#636b74]' />,
                    navigate: 'Registration'
                },
                {
                    slno: 2,
                    name: 'Revisit',
                    icon: <OpenInNew fontSize='small' className='text-[#636b74]' />,
                    navigate: 'Revisit'
                },
                {
                    slno: 3,
                    name: 'Billing',
                    icon: <OpenInNew fontSize='small' className='text-[#636b74]' />,
                    navigate: 'Billing'
                },
                {
                    slno: 4,
                    name: 'Appoinment',
                    icon: <OpenInNew fontSize='small' className='text-[#636b74]' />,
                    navigate: 'Appoinment'
                },
                {
                    slno: 5,
                    name: 'Ip Billing',
                    icon: <OpenInNew fontSize='small' className='text-[#636b74]' />,
                    navigate: 'IpBilling'
                },
            ]
        },
        {
            slno: 2,
            name: 'Stock Management',
            icon: <MedicationIcon fontSize='small' className='flex text-[#636b74]' />,
            submenu: [
                {
                    slno: 1,
                    name: 'Stock Inward ',
                    icon: <OpenInNew fontSize='small' className='text-[#636b74]' />,
                    navigate: 'StockInward'
                },

            ]
        },
        {
            slno: 3,
            name: 'Master',
            icon: <SettingsIcon fontSize='small' className='flex text-[#636b74]' />,
            submenu: [
                {
                    slno: 1,
                    name: 'Doctor',
                    icon: <OpenInNew fontSize='small' className='text-[#636b74]' />,
                    navigate: 'Doctor'
                },
                {
                    slno: 2,
                    name: 'Settings',
                    icon: <OpenInNew fontSize='small' className='text-[#636b74]' />,
                    navigate: 'Settings'
                },
                {
                    slno: 3,
                    name: 'Procedure Master',
                    icon: <OpenInNew fontSize='small' className='text-[#636b74]' />,
                    navigate: 'ProcedureMaster'
                },
                {
                    slno: 4,
                    name: 'Procedure Category',
                    icon: <OpenInNew fontSize='small' className='text-[#636b74]' />,
                    navigate: 'ProcedureCategoryMaster'
                },
                {
                    slno: 5,
                    name: 'Item Master',
                    icon: <OpenInNew fontSize='small' className='text-[#636b74]' />,
                    navigate: 'ItemMaster'
                },
                {
                    slno: 6,
                    name: 'Supplier Master',
                    icon: <OpenInNew fontSize='small' className='text-[#636b74]' />,
                    navigate: 'SupplierMaster'
                },
                {
                    slno: 7,
                    name: 'User Creation',
                    icon: <OpenInNew fontSize='small' className='text-[#636b74]' />,
                    navigate: 'UserCreation'
                },

            ]
        },

        {
            slno: 4,
            name: 'Report',
            icon: <SummarizeIcon fontSize='small' className='flex text-[#636b74]' />,
            submenu: [
                {
                    slno: 1,
                    name: 'Cash Close',
                    icon: <OpenInNew fontSize='small' className='text-[#636b74]' />,
                    navigate: 'CashClose'
                },
                {
                    slno: 2,
                    name: 'Bill Search',
                    icon: <OpenInNew fontSize='small' className='text-[#636b74]' />,
                    navigate: 'BillSearch'
                },
                {
                    slno: 3,
                    name: 'Procedure Category Report',
                    icon: <OpenInNew fontSize='small' className='text-[#636b74]' />,
                    navigate: 'ProcedurCatgryWiseReport'
                },
            ]
        },
    ]

    return (
        <Drawer
            open={open}
            onClose={() => setOpen(!open)}
            size="sm"
            variant="persistent"
            sx={{
                backdropFilter: 'blur(0px)',
                transition: '0.5s',
                border: 'none',
                borderRadius: '0px',
                boxShadow: 'none',
            }}
        >
            <Box
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 0.5,
                    ml: 'auto',
                    mt: 1,
                    mr: 2,
                    // backgroundColor: colors.primary,
                }}
            >
                <Typography
                    component="label"
                    htmlFor="close-icon"
                    fontSize="sm"
                    fontWeight="lg"
                    sx={{ cursor: 'pointer' }}
                    color="primary"
                >
                    Close
                </Typography>
                <ModalClose id="close-icon" sx={{ position: 'initial' }} color='primary' />
            </Box>
            <Divider orientation="horizontal" sx={{ my: 1 }} />
            <Box className="flex flex-1 flex-col justify-between" >
                <Box>
                    {
                        menuName?.map((item) => (
                            <DrawerMenu
                                key={item.slno}
                                item={item}
                            />
                        ))
                    }
                </Box>
                <Box>
                    <Divider orientation="horizontal" sx={{ my: 0 }} />
                    <Box className="flex flex-1  items-center justify-between m-2" >
                        <Box className="flex flex-1 items-center justify-center" >
                            <Typography level='body-md' color='primary' fontWeight='lg'>User Name</Typography>
                        </Box>
                        <IconButton size='sm' color='primary' >
                            <LogoutIcon fontSize='small' />
                        </IconButton>
                    </Box>
                </Box>
            </Box>

        </Drawer>
    )
}

export default DrawerCustom
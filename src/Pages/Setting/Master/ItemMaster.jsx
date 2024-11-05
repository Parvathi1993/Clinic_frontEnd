import React, { useCallback, memo, useState, useMemo, Fragment } from 'react'
import { Box } from '@mui/joy'
import { Paper } from '@mui/material'
import Typography from '@mui/joy/Typography'
import CustomInput from '../../../Components/CustomInput'
import CusCheckbox from '../../../Components/CusCheckbox'
import Button from '@mui/material/Button';
import { axioslogin } from '../../../AxiosConfig/Axios'
import { ToastContainer } from 'react-toastify'
import { succesNotify, warningNotify } from '../../../Components/CommonCode'
import { useNavigate } from 'react-router-dom'
import ItemMasterTable from './ItemMasterTable'

const ItemMaster = () => {
    const navigate = useNavigate()
    const [itemMaster, setItemMaster] = useState({
        item_slno: '',
        item_hsn_code: '',
        item_name: '',
        item_category: '',
        item_status: false
    })
    //Destructuring
    const { item_slno, item_hsn_code, item_name, item_category, item_status } = itemMaster
    const updateItemMaster = useCallback((e) => {
        const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
        setItemMaster({ ...itemMaster, [e.target.name]: value })
    }, [itemMaster])


    const postData = useMemo(() => {
        return {
            item_hsn_code: item_hsn_code,
            item_name: item_name,
            item_category: item_category,
            item_status: item_status === true ? 1 : 0
        }
    }, [item_hsn_code, item_name, item_category, item_status])


    const patchdata = useMemo(() => {
        return {
            item_hsn_code: item_hsn_code,
            item_name: item_name,
            item_category: item_category,
            item_status: item_status === true ? 1 : 0,
            item_slno: item_slno
        }
    }, [item_hsn_code, item_name, item_category, item_status, item_slno])


    const reset = useCallback(() => {
        const resetfrm = {
            item_slno: '',
            item_hsn_code: '',
            item_name: '',
            item_category: '',
            item_status: ''
        }
        setItemMaster(resetfrm)
    }, [])
    const submit = useCallback(() => {

        const InsertFun = async (postData) => {
            const result = await axioslogin.post('/ItemMaster', postData);
            const { success, message } = result.data

            if (success === 1) {
                reset()
                succesNotify(message)
            } else {
                warningNotify(message)
            }
        }

        const updateDoctorMAst = async (patchdata) => {
            const result = await axioslogin.patch('/ItemMaster', patchdata);
            const { success, message } = result.data
            if (success === 1) {
                reset()
                succesNotify(message)
            } else {
                warningNotify(message)
            }
        }


        if (item_hsn_code !== '' && item_name !== '') {
            if (editFlag === 2) {
                updateDoctorMAst(patchdata)
            } else {
                InsertFun(postData)
            }

        } else {
            warningNotify("Please enter Item Name and HSN Code")
        }

    }, [postData, item_hsn_code, patchdata, item_name])

    const [editFlag, setEditFlag] = useState(0)
    const viewdata = useCallback(() => {
        setEditFlag(1)
    }, [])

    const rowSelect = useCallback((value) => {
        setEditFlag(2)
        const { item_slno, item_hsn_code, item_name, item_category, item_status } = value
        const resetfrm = {
            item_hsn_code: item_hsn_code,
            item_status: item_status === 1 ? true : false,
            item_name: item_name,
            item_category: item_category,
            item_slno: item_slno
        }
        setItemMaster(resetfrm)
    }, [])
    const CloseFnctn = useCallback(() => {
        setEditFlag(0)
    }, [])
    const CloseMAster = useCallback(() => {
        navigate('/Home')
    }, [])

    return (
        <Fragment>

            <ToastContainer />
            {editFlag === 1 ? <ItemMasterTable rowSelect={rowSelect} CloseFnctn={CloseFnctn} /> :
                <Paper className='w-full flex flex-1 flex-col m-5 p-2  items-center justify-center gap-1 ' >
                    <Box sx={{ width: '100%', display: 'flex', justifyContent: "center" }}>
                        <Typography level='body-md' fontWeight='lg' sx={{ pb: 2 }} >Item Master</Typography>
                    </Box>
                    <Box className="flex justify-center items-center w-3/4">
                        <Box className="flex-1 ml-2 " >
                            <Typography level='body-md' fontWeight='lg' >Item HSN Code</Typography>
                        </Box>
                        <Box className="flex-1" >
                            <CustomInput placeholder={'Enter HSN Code'}
                                type="text"
                                size="sm"
                                name="item_hsn_code"
                                value={item_hsn_code}
                                handleChange={updateItemMaster}

                            />
                        </Box>
                    </Box>
                    <Box className="flex justify-center items-center w-3/4">
                        <Box className="flex-1 ml-2 " >
                            <Typography level='body-md' fontWeight='lg' >Item Name</Typography>
                        </Box>
                        <Box className="flex-1" >
                            <CustomInput placeholder={'Enter Item Name'}
                                type="text"
                                size="sm"
                                name="item_name"
                                value={item_name}
                                handleChange={updateItemMaster}

                            />
                        </Box>
                    </Box>
                    <Box className="flex justify-center items-center w-3/4">
                        <Box className="flex-1 ml-2 " >
                            <Typography level='body-md' fontWeight='lg' >Item Category</Typography>
                        </Box>
                        <Box className="flex-1" >
                            <CustomInput placeholder={'Enter Item Category'}
                                type="text"
                                size="sm"
                                name="item_category"
                                value={item_category}
                                handleChange={updateItemMaster}

                            />
                        </Box>
                    </Box>
                    <Box className="flex justify-center items-center w-3/4">
                        <Box className="flex-1 ml-2 " >
                            <Typography level='body-md' fontWeight='lg' >Item Status</Typography>
                        </Box>
                        <Box className="flex-1 ml-2 " >
                            <CusCheckbox
                                color="primary"
                                size="md"
                                fontWeight='lg'
                                name="item_status"
                                value={item_status}
                                checked={item_status}
                                onCheked={updateItemMaster}

                            ></CusCheckbox>
                        </Box>
                    </Box>
                    <Box className="flex justify-center items-center w-3/4">
                        <Box sx={{ pl: 2 }}>
                            <Button color="primary" variant="contained" onClick={submit} >Save</Button>
                        </Box>
                        <Box sx={{ pl: 2 }}>
                            <Button color="primary" variant="contained" onClick={viewdata}>view</Button>
                        </Box>
                        <Box sx={{ pl: 2 }}>
                            <Button color="primary" variant="contained" onClick={CloseMAster}>Close</Button>
                        </Box>
                    </Box>
                </Paper>
            }
        </Fragment >
    )
}

export default memo(ItemMaster)
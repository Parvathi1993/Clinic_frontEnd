import React, { useEffect, memo, useState, useCallback, useMemo } from 'react'
import { axioslogin } from '../../../AxiosConfig/Axios'
import { warningNotify } from '../../../Components/CommonCode'
import { Box, } from '@mui/material'
import { CssVarsProvider } from '@mui/joy/'
import Table from '@mui/joy/Table';
import { Paper } from '@mui/material'
import EditIcon from '@mui/icons-material/Edit';
import CustomInput from '../../../Components/CustomInput'
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import CusIconButton from '../../../Components/CusIconButton'
import CloseIcon from '@mui/icons-material/Close';
import RefreshIcon from '@mui/icons-material/Refresh';

const ItemMasterTable = ({ rowSelect, CloseFnctn }) => {
    const [tableData, setTabledata] = useState([])
    const [itemMaster, setItemMaster] = useState({
        item_hsn_code: '',
        item_name: '',
    })
    //Destructuring
    const { item_hsn_code, item_name } = itemMaster
    const updateDocMaster = useCallback((e) => {
        const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
        setItemMaster({ ...itemMaster, [e.target.name]: value })
    }, [itemMaster])

    useEffect(() => {
        const getItemList = async () => {
            const result = await axioslogin.get('/ItemMaster')
            const { success, data } = result.data
            if (success === 1) {
                setTabledata(data)
            } else {
                warningNotify("No Item added")
            }
        }
        getItemList();
    }, [])

    const postData = useMemo(() => {
        return {
            item_hsn_code: item_hsn_code,
            item_name: item_name
        }
    }, [item_hsn_code, item_name])
    const searchbyCondtn = useCallback(() => {
        const getByHSNCode = async (postdata) => {
            const result = await axioslogin.post('/ItemMaster/searchHSNCode', postdata)
            const { data, success } = result.data
            if (success === 1) {
                setTabledata(data)
            }
            else {
                warningNotify("No Doctor Found in given condition")
            }
        }

        const getByItemName = async (postdata) => {
            const result = await axioslogin.post('/ItemMaster/searchItemName', postdata)
            const { data, success } = result.data
            if (success === 1) {
                setTabledata(data)
            }
            else {
                warningNotify("No Item Found in given condition")
            }
        }
        const getByHsnCodeItemNameName = async (postdata) => {
            const result = await axioslogin.post('/ItemMaster/searchHSNCodeItemNameName', postdata)
            const { data, success } = result.data
            if (success === 1) {
                setTabledata(data)
            }
            else {
                warningNotify("No Item Found in given condition")
            }
        }

        if (item_hsn_code === '' && item_name === '') {
            warningNotify("Please Select any condition before search")
        } else if (item_hsn_code !== '' && item_name === '') {
            getByHSNCode(postData)
        } else if (item_hsn_code === '' && item_name !== '') {
            getByItemName(postData)
        } else if (item_hsn_code !== '' && item_name !== '') {
            getByHsnCodeItemNameName(postData)
        }

    }, [postData, item_hsn_code, item_name])

    const RefreshFunctn = useCallback(() => {
        const resetfrm = {
            item_hsn_code: '',
            item_name: '',
        }
        setItemMaster(resetfrm)
        const getDoctorList = async () => {
            const result = await axioslogin.get('/ItemMaster')
            const { success, data } = result.data
            if (success === 1) {
                setTabledata(data)
            } else {
                warningNotify("No Item added")
            }
        }
        getDoctorList();
    }, [])

    return (
        <Paper className='w-full flex flex-1 flex-col m-5 p-5  items-center justify-center gap-1 ' >
            <Box className="flex justify-center items-center p-3 ">
                <Box sx={{
                    width: "100%",
                    display: "flex",
                    flexDirection: "column"
                }}>

                    <Box sx={{
                        width: "100%",
                        display: "flex",
                        flexDirection: "row", pb: 2
                    }}>
                        <Box sx={{ pl: 0.8, width: "30%", cursor: "pointer" }}>
                            <CustomInput placeholder={"Item Name"}
                                type="text"
                                size="sm"
                                name="item_name"
                                value={item_name}
                                handleChange={updateDocMaster}
                            />
                        </Box>

                        <Box sx={{ pl: 0.8, width: "30%", cursor: "pointer" }}>
                            <CustomInput placeholder={"Item HSN Code"}
                                type="text"
                                size="sm"
                                name="item_hsn_code"
                                value={item_hsn_code}
                                handleChange={updateDocMaster}
                            />
                        </Box>
                        <Box sx={{ width: '3%', pl: 2, }}>
                            <CusIconButton size="sm" variant="outlined" clickable="true" onClick={searchbyCondtn} >
                                <SearchOutlinedIcon color='primary' fontSize='small' />
                            </CusIconButton>
                        </Box>
                        <Box sx={{ width: '2%', pl: 1, pr: 1 }}>
                            <CusIconButton size="sm" variant="outlined" clickable="true" onClick={RefreshFunctn} >
                                <RefreshIcon color='primary' fontSize='small' />
                            </CusIconButton>
                        </Box>
                        <Box sx={{ width: '3%', pl: 2 }}>
                            <CusIconButton size="sm" variant="outlined" clickable="true" onClick={CloseFnctn} >
                                <CloseIcon color='primary' fontSize='small' />
                            </CusIconButton>
                        </Box>
                    </Box>
                    <Box sx={{
                        borderBottom: 1, borderWidth: 0.1, borderColor: 'black', minHeight: 300, maxHeight: 600,
                        overflow: 'auto'
                    }} >
                        <CssVarsProvider>
                            <Table stickyHeader>
                                <thead>
                                    <tr>
                                        <th style={{ width: '15%', align: "center" }}>Sl No</th>
                                        <th style={{ width: '20%', align: "center" }}>HSN Code</th>
                                        <th style={{ width: '25%', align: "center" }}>Item Name </th>
                                        <th style={{ width: '20%', align: "center" }}>Category</th>
                                        <th style={{ width: '10%', align: "center" }}>Status </th>
                                        <th style={{ width: '10%', align: "center" }}>Edit</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {tableData && tableData.map((val, index) => {
                                        return <tr
                                            key={index}
                                            sx={{
                                                '&:last-child td, &:last-child th': { border: 0 }, maxHeight: 60,
                                                minHeight: 5
                                            }}
                                        >
                                            <td> {index + 1}</td>
                                            <td> {val.item_hsn_code}</td>
                                            <td> {val.item_name}</td>
                                            <td> {val.item_category}</td>
                                            <td> {val.status1}</td>
                                            <td>
                                                <EditIcon size={6} color='primary' onClick={() => rowSelect(val)} />
                                            </td>
                                        </tr>
                                    })}
                                </tbody>
                            </Table>
                        </CssVarsProvider>
                    </Box>
                </Box>
            </Box>
        </Paper>
    )
}


export default memo(ItemMasterTable)
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

const SupplierMastTable = ({ rowSelect, CloseFnctn }) => {
    const [tableData, setTabledata] = useState([])
    const [supplierMaster, setSupplierMaster] = useState({
        supplier_name: '',
        supplier_address: '',
    })
    //Destructuring
    const { supplier_name, supplier_address } = supplierMaster
    const updateSupplierMaster = useCallback((e) => {
        const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
        setSupplierMaster({ ...supplierMaster, [e.target.name]: value })
    }, [supplierMaster])

    useEffect(() => {
        const getSupplierList = async () => {
            const result = await axioslogin.get('/Suppliermaster')
            const { success, data } = result.data
            if (success === 1) {
                setTabledata(data)
            } else {
                warningNotify("No Item added")
            }
        }
        getSupplierList();
    }, [])

    const postData = useMemo(() => {
        return {
            supplier_name: supplier_name,
            supplier_address: supplier_address
        }
    }, [supplier_name, supplier_address])
    const searchbyCondtn = useCallback(() => {
        const getBySupplierName = async (postdata) => {
            const result = await axioslogin.post('/Suppliermaster/searchSupplierName', postdata)
            const { data, success } = result.data
            if (success === 1) {
                setTabledata(data)
            }
            else {
                warningNotify("No Supplier Found in given condition")
            }
        }

        const getBySuppplierAddress = async (postdata) => {
            const result = await axioslogin.post('/Suppliermaster/searchSupplierAddress', postdata)
            const { data, success } = result.data
            if (success === 1) {
                setTabledata(data)
            }
            else {
                warningNotify("No Supplier Found in given condition")
            }
        }
        const getBySpplierNAmeAddress = async (postdata) => {
            const result = await axioslogin.post('/Suppliermaster/searchSupplierNameAddress', postdata)
            const { data, success } = result.data
            if (success === 1) {
                setTabledata(data)
            }
            else {
                warningNotify("No Supplier Found in given condition")
            }
        }

        if (supplier_name === '' && supplier_address === '') {
            warningNotify("Please Select any condition before search")
        } else if (supplier_name !== '' && supplier_address === '') {
            getBySupplierName(postData)
        } else if (supplier_name === '' && supplier_address !== '') {
            getBySuppplierAddress(postData)
        } else if (supplier_name !== '' && supplier_address !== '') {
            getBySpplierNAmeAddress(postData)
        }

    }, [postData, supplier_name, supplier_address])

    const RefreshFunctn = useCallback(() => {
        const resetfrm = {
            supplier_name: '',
            supplier_address: '',
        }
        setSupplierMaster(resetfrm)
        const getSupplierList = async () => {
            const result = await axioslogin.get('/Suppliermaster')
            const { success, data } = result.data
            if (success === 1) {
                setTabledata(data)
            } else {
                warningNotify("No Supplier added")
            }
        }
        getSupplierList();
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
                            <CustomInput placeholder={"Supplier Name"}
                                type="text"
                                size="sm"
                                name="supplier_name"
                                value={supplier_name}
                                handleChange={updateSupplierMaster}
                            />
                        </Box>

                        <Box sx={{ pl: 0.8, width: "30%", cursor: "pointer" }}>
                            <CustomInput placeholder={"Supplier Address"}
                                type="text"
                                size="sm"
                                name="supplier_address"
                                value={supplier_address}
                                handleChange={updateSupplierMaster}
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
                                        <th style={{ width: '20%', align: "center" }}>Supplier Name</th>
                                        <th style={{ width: '25%', align: "center" }}>Supplier Address</th>
                                        <th style={{ width: '20%', align: "center" }}>Supplier Phno</th>
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
                                            <td> {val.supplier_name}</td>
                                            <td> {val.supplier_address}</td>
                                            <td> {val.supplier_phno}</td>
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

export default memo(SupplierMastTable)
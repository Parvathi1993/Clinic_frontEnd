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

const ProcedurMastTable = ({ rowSelect, CloseFnctn }) => {

    const [tableData, setTabledata] = useState([])
    const [docmaster, setDocmaster] = useState({
        procedure_name: ''
    })
    //Destructuring
    const { procedure_name } = docmaster
    const updateDocMaster = useCallback((e) => {
        const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
        setDocmaster({ ...docmaster, [e.target.name]: value })
    }, [docmaster])

    useEffect(() => {
        const getDoctorList = async () => {
            const result = await axioslogin.get('/ProcedurMaster')
            const { success, data } = result.data
            if (success === 1) {
                setTabledata(data)
            } else {
                warningNotify("No procedure added yet!!!!!!")
            }
        }
        getDoctorList();
    }, [])

    const postData = useMemo(() => {
        return {
            procedure_name: procedure_name
        }
    }, [procedure_name])
    const searchbyCondtn = useCallback(() => {
        const getBySpecName = async (postdata) => {
            const result = await axioslogin.post('/ProcedurMaster/searchprocedureName', postdata)
            const { data, success } = result.data
            if (success === 1) {
                setTabledata(data)
            }
            else {
                warningNotify("No Doctor Found in given condition")
            }
        }

        if (procedure_name === '') {
            warningNotify("Please Select any condition before search")
        } else {
            getBySpecName(postData)
        }

    }, [postData, procedure_name])

    const RefreshFunctn = useCallback(() => {
        const resetfrm = {
            procedure_name: ''
        }
        setDocmaster(resetfrm)
        const getDoctorList = async () => {
            const result = await axioslogin.get('/ProcedurMaster')
            const { success, data } = result.data
            if (success === 1) {
                setTabledata(data)
            } else {
                warningNotify("No procedure added yet!!!!!!")
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
                        <Box sx={{ pl: 0.8, width: "30%", cursor: "pointer" }}></Box>
                        <Box sx={{ pl: 0.8, width: "30%", cursor: "pointer" }}>
                            <CustomInput placeholder={"Procedure Name"}
                                type="text"
                                size="sm"
                                name="procedure_name"
                                value={procedure_name}
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
                        <Box sx={{ pl: 0.8, width: "30%", cursor: "pointer" }}></Box>
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
                                        <th style={{ width: '30%', align: "center" }}>Procedure Name</th>
                                        <th style={{ width: '30%', align: "center" }}>Procedure Code</th>
                                        <th style={{ width: '30%', align: "center" }}>Procedure rate </th>
                                        <th style={{ width: '30%', align: "center" }}>Procedure Category</th>
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
                                            <td> {val.procedure_name}</td>
                                            <td> {val.procedure_code}</td>
                                            <td> {val.procedure_rate}</td>
                                            <td> {val.procedure_catgry_name}</td>
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

export default memo(ProcedurMastTable)
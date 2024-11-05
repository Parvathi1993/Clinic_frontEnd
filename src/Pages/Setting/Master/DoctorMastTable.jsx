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

const DoctorMastTable = ({ rowSelect, CloseFnctn }) => {
    const [tableData, setTabledata] = useState([])
    const [docmaster, setDocmaster] = useState({
        doctorname: '',
        speciality: ''
    })
    //Destructuring
    const { doctorname, speciality } = docmaster
    const updateDocMaster = useCallback((e) => {
        const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
        setDocmaster({ ...docmaster, [e.target.name]: value })
    }, [docmaster])

    useEffect(() => {
        const getDoctorList = async () => {
            const result = await axioslogin.get('/DoctorMaster')
            const { success, data } = result.data
            if (success === 1) {
                setTabledata(data)
            } else {
                warningNotify("No Doctors added")
            }
        }
        getDoctorList();
    }, [])

    const postData = useMemo(() => {
        return {
            doctor_name: doctorname,
            speciality_name: speciality
        }
    }, [doctorname])
    const searchbyCondtn = useCallback(() => {
        const getByDctrName = async (postdata) => {
            const result = await axioslogin.post('/DoctorMaster/searchDctrName', postdata)
            const { data, success } = result.data
            if (success === 1) {
                setTabledata(data)
            }
            else {
                warningNotify("No Doctor Found in given condition")
            }
        }

        const getBySpecName = async (postdata) => {
            const result = await axioslogin.post('/DoctorMaster/searchprocedureName', postdata)
            const { data, success } = result.data
            if (success === 1) {
                setTabledata(data)
            }
            else {
                warningNotify("No Doctor Found in given condition")
            }
        }
        const getByDctrNSpecName = async (postdata) => {
            const result = await axioslogin.post('/DoctorMaster/searchDctrNProcdrName', postdata)
            const { data, success } = result.data
            if (success === 1) {
                setTabledata(data)
            }
            else {
                warningNotify("No Doctor Found in given condition")
            }
        }

        if (doctorname === '' && speciality === '') {
            warningNotify("Please Select any condition before search")
        } else if (doctorname !== '' && speciality === '') {
            getByDctrName(postData)
        } else if (doctorname === '' && speciality !== '') {
            getBySpecName(postData)
        } else if (doctorname !== '' && speciality !== '') {
            getByDctrNSpecName(postData)
        }

    }, [postData, doctorname, speciality])

    const RefreshFunctn = useCallback(() => {
        const resetfrm = {
            doctorname: '',
            speciality: ''
        }
        setDocmaster(resetfrm)
        const getDoctorList = async () => {
            const result = await axioslogin.get('/DoctorMaster')
            const { success, data } = result.data
            if (success === 1) {
                setTabledata(data)
            } else {
                warningNotify("No Doctors added")
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
                            <CustomInput placeholder={"Doctor Name"}
                                type="text"
                                size="sm"
                                name="doctorname"
                                value={doctorname}
                                handleChange={updateDocMaster}
                            />
                        </Box>

                        <Box sx={{ pl: 0.8, width: "30%", cursor: "pointer" }}>
                            <CustomInput placeholder={"Speciality Name"}
                                type="text"
                                size="sm"
                                name="speciality"
                                value={speciality}
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
                                        <th style={{ width: '30%', align: "center" }}>Doctor Name</th>
                                        <th style={{ width: '30%', align: "center" }}>Speciality </th>
                                        <th style={{ width: '10%', align: "center" }}>Fee</th>
                                        <th style={{ width: '15%', align: "center" }}>Token Start </th>
                                        <th style={{ width: '15%', align: "center" }}>Token End</th>
                                        <th style={{ width: '15%', align: "center" }}>Renewal days</th>
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
                                            <td> {val.doctor_name}</td>
                                            <td> {val.speciality_name}</td>
                                            <td> {val.doctor_fee}</td>
                                            <td> {val.doctor_token_start}</td>
                                            <td> {val.doctor_token_end}</td>
                                            <td> {val.doctor_renewal_day}</td>
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

export default memo(DoctorMastTable)
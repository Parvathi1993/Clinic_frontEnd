import React, { useEffect, memo, useState } from 'react'
import { axioslogin } from '../../../AxiosConfig/Axios'
import { warningNotify } from '../../../Components/CommonCode'
import { Box, } from '@mui/material'
import { CssVarsProvider } from '@mui/joy/'
import Table from '@mui/joy/Table';
import { Paper } from '@mui/material'
import EditIcon from '@mui/icons-material/Edit';


const UserCreationTable = ({ rowSelect, CloseFnctn }) => {
    const [tableData, setTabledata] = useState([])

    useEffect(() => {
        const getemployeeList = async () => {
            const result = await axioslogin.get('/login/view')
            const { success, data } = result.data
            if (success === 2) {
                setTabledata(data)
            } else {
                warningNotify("No Doctors added")
            }
        }
        getemployeeList();
    }, [])

    return (
        <Paper className='w-full flex flex-1 flex-col m-5 p-5  items-center justify-center gap-1 ' >
            <Box className="flex justify-center items-center p-3 ">
                <Box sx={{
                    width: "100%",
                    display: "flex",
                    flexDirection: "column"
                }}>

                    {/* <Box sx={{
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
                        <Box sx={{ width: '2%' }}>
                            <CusIconButton size="sm" variant="outlined" clickable="true" onClick={RefreshFunctn} >
                                <RefreshIcon color='primary' fontSize='small' />
                            </CusIconButton>
                        </Box>
                        <Box sx={{ width: '3%', pl: 0.5 }}>
                            <CusIconButton size="sm" variant="outlined" clickable="true" onClick={CloseFnctn} >
                                <CloseIcon color='primary' fontSize='small' />
                            </CusIconButton>
                        </Box>
                    </Box> */}
                    <Box sx={{
                        borderBottom: 1, borderWidth: 0.1, borderColor: 'black', minHeight: 300, maxHeight: 600,
                        overflow: 'auto'
                    }} >
                        <CssVarsProvider>
                            <Table stickyHeader>
                                <thead>
                                    <tr>
                                        <th style={{ width: '15%', align: "center" }}>Sl No</th>
                                        <th style={{ width: '15%', align: "center" }}>User Code</th>
                                        <th style={{ width: '25%', align: "center" }}>First Name</th>
                                        <th style={{ width: '15%', align: "center" }}>Second Name </th>
                                        <th style={{ width: '20%', align: "center" }}>Address</th>
                                        <th style={{ width: '15%', align: "center" }}>Mobile No </th>
                                        <th style={{ width: '15%', align: "center" }}>User Group </th>
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
                                            <td> {val.us_code}</td>
                                            <td> {val.usc_first_name}</td>
                                            <td> {val.usc_second_name === null ? "Not Given" : val.usc_second_name}</td>
                                            <td> {val.usc_address === null ? "Not Given" : val.usc_address}</td>
                                            <td> {val.usc_mobileno === null ? "Not Given" : val.usc_mobileno}</td>
                                            <td> {val.user_group_name === null ? "Not Given" : val.user_group_name}</td>
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

export default memo(UserCreationTable)
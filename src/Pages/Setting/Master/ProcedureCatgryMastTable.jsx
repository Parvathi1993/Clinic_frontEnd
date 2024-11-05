import React, { useEffect, memo, useState } from 'react'
import { axioslogin } from '../../../AxiosConfig/Axios'
import { warningNotify } from '../../../Components/CommonCode'
import { Box, } from '@mui/material'
import { CssVarsProvider } from '@mui/joy/'
import Table from '@mui/joy/Table';
import { Paper } from '@mui/material'
import EditIcon from '@mui/icons-material/Edit';
import Button from '@mui/material/Button';

const ProcedureCatgryMastTable = ({ rowSelect, CloseMAster }) => {

    const [tableData, setTabledata] = useState([])

    useEffect(() => {
        const getDoctorList = async () => {
            const result = await axioslogin.get('/ProcedurCatMaster')
            const { success, data } = result.data
            if (success === 1) {
                setTabledata(data)
            } else {
                warningNotify("No procedure Category added yet!!!!!!")
            }
        }
        getDoctorList();
    }, [])


    return (
        <Paper className='w-full flex flex-1 flex-col m-5 p-5  items-center justify-center gap-1 ' >
            <Box className="flex justify-center items-center p-3 ">
                <Box sx={{
                    width: "70%",
                    display: "flex",
                    flexDirection: "column"
                }}>

                    <Box sx={{
                        borderBottom: 1, borderWidth: 0.1, borderColor: 'black', minHeight: 300, maxHeight: 600,
                        overflow: 'auto'
                    }} >
                        <CssVarsProvider>
                            <Table stickyHeader>
                                <thead>
                                    <tr>
                                        <th style={{ width: '15%', align: "center" }}>Sl No</th>
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
                    <Box sx={{
                        width: "70%",
                        display: "flex",
                        flexDirection: "row", pt: 2, pl: 55
                    }}>
                        <Box sx={{ pl: 2 }}>
                            <Button color="primary" variant="contained" onClick={CloseMAster}>Close</Button>
                        </Box>

                    </Box>
                </Box>
            </Box>
        </Paper>
    )
}

export default memo(ProcedureCatgryMastTable)
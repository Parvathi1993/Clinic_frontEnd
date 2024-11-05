import React, { useCallback, memo, useState } from 'react'
import { Box } from '@mui/joy'
import { Paper } from '@mui/material'
import Typography from '@mui/joy/Typography'
import { ToastContainer } from 'react-toastify'
import RefreshIcon from '@mui/icons-material/Refresh';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import CusIconButton from '../../Components/CusIconButton';
import CustomInput from '../../Components/CustomInput';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import { axioslogin } from '../../AxiosConfig/Axios';
import { CssVarsProvider } from '@mui/joy/'
import Table from '@mui/joy/Table';
import { warningNotify } from '../../Components/CommonCode';
import * as XLSX from 'xlsx';
import DownloadIcon from '@mui/icons-material/Download';
import ProcedureCatgryDropDown from '../../Components/ProcedureCatgryDropDown'

const ProcedureCatWiseReport = () => {
    const [selectdate, setselectdate] = useState('')
    const updatepatient_dob = useCallback((e) => {
        setselectdate(e.target.value)
    }, [])

    const [tableData, setTableData] = useState([])
    const [tableFlag, setTableFlag] = useState(0)
    const [procedure_catgry_slno, setprocedure_catgry_slno] = useState(0)

    const [radiovalue, setRadioValue] = useState('1')

    //Radio button OnClick function starts
    const updateRadioClick = useCallback(async (e) => {
        e.preventDefault()
        setTableData([])
        setTableFlag(0)
        setRadioValue(e.target.value)
    }, [])

    const search = useCallback(() => {

        const getBillDetails = async (postData) => {
            const result = await axioslogin.post('/Reports/getCategryBasedBill', postData)
            const { data, success } = result.data
            if (success === 1) {
                setTableData(data)
                setTableFlag(1)
            }
            else {
                setTableData([])
                setTableFlag(0)
                warningNotify("No Bill enter selected date")
            }
        }

        const getIpBillDetails = async (postDataIPBill) => {
            const result = await axioslogin.post('/Reports/getCategryBasedIPBill', postDataIPBill)
            const { data, success } = result.data
            if (success === 1) {
                setTableData(data)
                setTableFlag(1)
            }
            else {
                setTableData([])
                setTableFlag(0)
                warningNotify("No Bill enter selected date")
            }
        }

        const postData = {
            procedure_catgry_slno: procedure_catgry_slno,
            bill_date: selectdate
        }
        const postDataIPBill = {
            procedure_catgry_slno: procedure_catgry_slno,
            ip_bill_date: selectdate
        }

        if (selectdate !== '' && procedure_catgry_slno !== 0) {
            if (radiovalue === '1') {
                getBillDetails(postData)
            } else if (radiovalue === '2') {
                getIpBillDetails(postDataIPBill)
            }

        } else {
            warningNotify("Please select Date and Category!!!!")
        }
    }, [procedure_catgry_slno, selectdate, radiovalue])



    const referesh = useCallback(() => {
        setselectdate('')

    }, [])


    const exportToExcel = () => {
        // Create a new workbook
        const workbook = XLSX.utils.book_new();

        // Convert the table data to worksheet
        const worksheet = XLSX.utils.json_to_sheet(tableData);

        // Append the worksheet to the workbook
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');

        // Generate and download the Excel file
        XLSX.writeFile(workbook, 'TableData.xlsx');
    };


    return (
        <Box sx={{ width: "100%", p: 5 }}>
            <ToastContainer />
            <Paper sx={{
                width: '100%',
                mt: 0.8
            }} variant='outlined'>
                <Box sx={{
                    width: "100%",
                    display: "flex",
                    flexDirection: "column"
                }}>
                    <Box sx={{ width: '100%', display: 'flex', justifyContent: "center" }}>
                        <Typography level='body-md' fontWeight='lg' >Procedure Category Based Report</Typography>
                    </Box>
                    <Box sx={{ width: "100%", display: 'flex', flexDirection: "row", pt: 1, pb: 1 }}>

                        <Box sx={{ pl: 0.8, width: "20%", cursor: "pointer", pt: 0.5 }}>
                        </Box>
                        <Box sx={{ pl: 0.8, width: "12%", cursor: "pointer", pt: 0.5 }}>
                            <CustomInput
                                type="date"
                                size="sm"
                                name="selectdate"
                                value={selectdate}
                                handleChange={updatepatient_dob}
                            />
                        </Box>
                        <Box sx={{ pl: 0.8, width: "20%", cursor: "pointer", pt: 0.5 }}>
                            <ProcedureCatgryDropDown procedure_catgry_slno={procedure_catgry_slno} setprocedure_catgry_slno={setprocedure_catgry_slno} />
                        </Box>
                        <Box sx={{
                            width: "20%",
                            pb: 0.5, flex: 1,
                            display: "flex",
                            flexDirection: { xl: "row", lg: "row", md: "row", sm: 'row', xs: "row" },
                            justifyContent: 'center',
                        }}>
                            <RadioGroup
                                row
                                aria-labelledby="demo-row-radio-buttons-group-label"
                                name="row-radio-buttons-group"
                                value={radiovalue}
                                onChange={(e) => updateRadioClick(e)}
                            >
                                <FormControlLabel value='1' control={<Radio />} label="OP Billing" />
                                <FormControlLabel value='2' control={<Radio />} label="IP Billing" />
                            </RadioGroup>
                        </Box>
                        <Box sx={{ width: '3%', pr: 0.5 }}>
                            <CusIconButton size="sm" variant="outlined" clickable="true" color="primary" onClick={search} >
                                <SearchOutlinedIcon fontSize='small' />
                            </CusIconButton>
                        </Box>
                        <Box sx={{ width: '3%', }}>
                            <CusIconButton size="sm" variant="outlined" clickable="true" color="primary" onClick={referesh} >
                                <RefreshIcon fontSize='small' />
                            </CusIconButton>
                        </Box>
                        <Box sx={{ pl: 0.8, width: "20%", cursor: "pointer", pt: 0.5 }}>
                        </Box>
                    </Box>

                    {
                        tableFlag === 1 ?
                            <Box sx={{ width: "100%", display: 'flex', flexDirection: "column", pt: 1 }}>

                                <Box sx={{ width: "100%", display: 'flex', flexDirection: "row", pl: 1, pr: 1, pb: 0.5 }}>

                                    <Box sx={{ pl: 0.8, width: "95%", cursor: "pointer", pt: 0.5 }}>
                                    </Box>
                                    <Box sx={{ pl: 0.8, width: "5%", cursor: "pointer", pt: 0.5 }}>
                                        <CusIconButton size="sm" variant="outlined" clickable="true" onClick={exportToExcel} >
                                            <DownloadIcon color='primary' fontSize='small' />
                                        </CusIconButton>

                                    </Box>
                                </Box>
                                {
                                    radiovalue === '1' ?

                                        <Box sx={{ width: "100%", display: 'flex', flexDirection: "row", pl: 1, pr: 1 }}>
                                            <Box sx={{
                                                borderBottom: 1, borderWidth: 0.1, borderColor: 'black', minHeight: 300, maxHeight: 600,
                                                overflow: 'auto'
                                            }} >
                                                <CssVarsProvider>
                                                    <Table stickyHeader>
                                                        <thead>
                                                            <tr>
                                                                <th style={{ width: '8%', align: "center" }}>Sl No</th>
                                                                <th style={{ width: '8%', align: "center" }}>Bill No</th>
                                                                <th style={{ width: '20%', align: "center" }}>Bill Date</th>
                                                                <th style={{ width: '20%', align: "center" }}>UHID</th>
                                                                <th style={{ width: '30%', align: "center" }}>Procedure Name</th>
                                                                <th style={{ width: '15%', align: "center" }}>Procedure Code</th>
                                                                <th style={{ width: '15%', align: "center" }}>Procedure Rate</th>
                                                                <th style={{ width: '15%', align: "center" }}>PaymentMode</th>


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
                                                                    <td> {val.bill_mast_slno}</td>
                                                                    <td> {val.bill_date}</td>
                                                                    <td> {val.uhid}</td>
                                                                    <td> {val.procedure_name}</td>
                                                                    <td> {val.procedure_code}</td>
                                                                    <td> {val.procedure_rate}</td>
                                                                    <td> {val.paymentmode}</td>
                                                                </tr>
                                                            })}
                                                        </tbody>
                                                    </Table>
                                                </CssVarsProvider>
                                            </Box>

                                        </Box> :

                                        <Box sx={{ width: "100%", display: 'flex', flexDirection: "row", pl: 1, pr: 1 }}>
                                            <Box sx={{
                                                borderBottom: 1, borderWidth: 0.1, borderColor: 'black', minHeight: 300, maxHeight: 600,
                                                overflow: 'auto'
                                            }} >
                                                <CssVarsProvider>
                                                    <Table stickyHeader>
                                                        <thead>
                                                            <tr>
                                                                <th style={{ width: '8%', align: "center" }}>Sl No</th>
                                                                <th style={{ width: '8%', align: "center" }}>Bill No</th>
                                                                <th style={{ width: '20%', align: "center" }}>Bill Date</th>
                                                                <th style={{ width: '20%', align: "center" }}>UHID</th>
                                                                <th style={{ width: '30%', align: "center" }}>Procedure Name</th>
                                                                <th style={{ width: '15%', align: "center" }}>Procedure Code</th>
                                                                <th style={{ width: '15%', align: "center" }}>Procedure Rate</th>
                                                                <th style={{ width: '15%', align: "center" }}>Count</th>
                                                                <th style={{ width: '15%', align: "center" }}>Total Rate</th>
                                                                <th style={{ width: '15%', align: "center" }}>PaymentMode</th>


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
                                                                    <td> {val.ip_bill_mast_slno}</td>
                                                                    <td> {val.ip_bill_date}</td>
                                                                    <td> {val.uhid}</td>
                                                                    <td> {val.procedure_name}</td>
                                                                    <td> {val.procedure_code}</td>
                                                                    <td> {val.ip_procedure_rate}</td>
                                                                    <td> {val.ip_count}</td>
                                                                    <td> {val.ip_rate_total}</td>
                                                                    <td> {val.paymentmode}</td>
                                                                </tr>
                                                            })}
                                                        </tbody>
                                                    </Table>
                                                </CssVarsProvider>
                                            </Box>

                                        </Box>

                                }





                            </Box>
                            : null
                    }
                </Box>
            </Paper>
        </Box>
    )
}

export default memo(ProcedureCatWiseReport)
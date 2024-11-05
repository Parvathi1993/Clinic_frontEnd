import React, { useCallback, memo, useState, useEffect } from 'react'
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

const CashCloseReport = () => {

    const [selectdate, setselectdate] = useState('')
    const [radiovalue, setRadioValue] = useState('1')

    //Radio button OnClick function starts
    const updateRadioClick = useCallback(async (e) => {
        e.preventDefault()
        setTableData([]);
        setTableFlag(0)
        setRadioValue(e.target.value)
    }, [])


    const [tableData, setTableData] = useState([])
    const [tableFlag, setTableFlag] = useState(0)

    const updatepatient_dob = useCallback((e) => {
        setselectdate(e.target.value)
    }, [])
    const [RegFee, setRegFee] = useState(0)

    useEffect(() => {
        const getDoctorList = async () => {
            const result = await axioslogin.get('/settingMaster')
            const { success, data } = result.data
            if (success === 1) {
                const { reg_renewal_fee } = data[0]
                setRegFee(reg_renewal_fee)
            } else {
                warningNotify("No Doctors added")
            }
        }
        getDoctorList();
    }, [])





    const search = useCallback(() => {
        if (selectdate !== '') {
            if (radiovalue === '1') {
                const getBillingdata = async (selectdate) => {
                    const result = await axioslogin.get(`/Reports/getCashCollectBilling/${selectdate}`)
                    const { success, data } = result.data
                    if (success === 1) {
                        setTableData(data);
                        setTableFlag(1)
                    } else {
                        warningNotify("No Bill entered selected date")
                        setTableData([]);
                        setTableFlag(0)
                    }
                }
                getBillingdata(selectdate)

            } else if (radiovalue === '3') {

                const getVistingdatas = async (selectdate) => {
                    const result = await axioslogin.get(`/Reports/getCashCollectvisting/${selectdate}`)
                    const { success, data } = result.data
                    if (success === 1) {
                        setTableData(data);
                        setTableFlag(2)
                    } else {
                        warningNotify("No Visit entered selected date")
                        setTableData([]);
                        setTableFlag(0)
                    }
                }
                getVistingdatas(selectdate)

            } else if (radiovalue === '2') {

                const getNewRegistration = async (selectdate) => {
                    const result = await axioslogin.get(`/Reports/getCashCollectNewRegstration/${selectdate}`)
                    const { success, data } = result.data
                    if (success === 1) {
                        setTableData(data);
                        setTableFlag(2)
                    } else {
                        warningNotify("No Registration entered selected date")
                        setTableData([]);
                        setTableFlag(0)
                    }
                }
                getNewRegistration(selectdate)
            }
            else if (radiovalue === '4') {
                const getIPBillingdata = async (selectdate) => {
                    const result = await axioslogin.get(`/Reports/getCashCollectIPBilling/${selectdate}`)
                    const { success, data } = result.data
                    if (success === 1) {
                        setTableData(data);
                        setTableFlag(2)
                    } else {
                        warningNotify("No Bill entered selected date")
                        setTableData([]);
                        setTableFlag(0)
                    }
                }
                getIPBillingdata(selectdate)

            }
        } else {
            warningNotify("Please Select Date before serach")
        }

    }, [radiovalue, selectdate])

    const referesh = useCallback(() => {
        setselectdate('')
        setRadioValue('1')
        setTableFlag(0)
        setTableData([])
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
                        <Typography level='body-md' fontWeight='lg' >Cash Close Report</Typography>
                    </Box>
                    <Box sx={{ width: "100%", display: 'flex', flexDirection: "row", pt: 1 }}>

                        <Box sx={{ pl: 0.8, width: "20%", cursor: "pointer", pt: 0.5 }}>
                        </Box>
                        <Box sx={{ pl: 0.8, width: "15%", cursor: "pointer", pt: 0.5 }}>
                            <CustomInput
                                type="date"
                                size="sm"
                                name="selectdate"
                                value={selectdate}
                                handleChange={updatepatient_dob}
                            />
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
                                <FormControlLabel value='1' control={<Radio />} label="Billing" />
                                <FormControlLabel value='2' control={<Radio />} label="Registration" />
                                <FormControlLabel value='3' control={<Radio />} label="Revisit" />
                                <FormControlLabel value='4' control={<Radio />} label="IP Billing" />
                            </RadioGroup>
                        </Box>
                        <Box sx={{ width: '3%', pl: 1, pr: 0.5 }}>
                            <CusIconButton size="sm" variant="outlined" clickable="true" color="primary" onClick={search} >
                                <SearchOutlinedIcon fontSize='small' />
                            </CusIconButton>
                        </Box>
                        <Box sx={{ width: '3%', pl: 1 }}>
                            <CusIconButton size="sm" variant="outlined" clickable="true" color="primary" onClick={referesh} >
                                <RefreshIcon fontSize='small' />
                            </CusIconButton>
                        </Box>
                        <Box sx={{ pl: 0.8, width: "20%", cursor: "pointer", pt: 0.5 }}>
                        </Box>
                    </Box>

                    {tableFlag === 1 ?
                        <Box>

                            <Box sx={{ width: "100%", display: 'flex', flexDirection: "row", pt: 1, pl: 1, pr: 1 }}>

                                <Box sx={{ pl: 0.8, width: "95%", cursor: "pointer", pt: 0.5 }}>
                                </Box>
                                <Box sx={{ pl: 0.8, width: "5%", cursor: "pointer", pt: 0.5 }}>
                                    <CusIconButton size="sm" variant="outlined" clickable="true" onClick={exportToExcel} >
                                        <DownloadIcon color='primary' fontSize='small' />
                                    </CusIconButton>

                                </Box>
                            </Box>

                            <Box sx={{ width: "100%", display: 'flex', flexDirection: "row", pt: 1, pl: 1, pr: 1 }}>
                                <Box sx={{
                                    borderBottom: 1, borderWidth: 0.1, borderColor: 'black', minHeight: 300, maxHeight: 600,
                                    overflow: 'auto'
                                }} >
                                    <CssVarsProvider>
                                        <Table stickyHeader>
                                            <thead>
                                                <tr>
                                                    <th style={{ width: '8%', align: "center" }}>Bill No</th>
                                                    <th style={{ width: '20%', align: "center" }}>Bill Date</th>
                                                    <th style={{ width: '15%', align: "center" }}>Bill Amount </th>
                                                    <th style={{ width: '15%', align: "center" }}>Payment Mode</th>
                                                    <th style={{ width: '20%', align: "center" }}>UHID</th>
                                                    <th style={{ width: '30%', align: "center" }}>Pateint Name</th>
                                                    <th style={{ width: '30%', align: "center" }}>Pateint Address</th>
                                                    <th style={{ width: '20%', align: "center" }}>Pateint Place</th>
                                                    <th style={{ width: '15%', align: "center" }}>Pateint Mobile</th>

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
                                                        <td> {val.bill_mast_slno}</td>
                                                        <td> {val.bill_date}</td>
                                                        <td> {val.bill_amount}</td>
                                                        <td>{val.paymentmode}</td>
                                                        <td> {val.uhid}</td>
                                                        <td> {val.patient_name}</td>
                                                        <td> {val.patient_address}</td>
                                                        <td> {val.patient_place}</td>
                                                        <td> {val.patient_mobile}</td>
                                                    </tr>
                                                })}
                                            </tbody>
                                        </Table>
                                    </CssVarsProvider>
                                </Box>

                            </Box>
                        </Box> :
                        tableFlag === 2 ?
                            <Box>
                                {
                                    radiovalue === '2' ?

                                        <Box>
                                            <Box sx={{ width: "100%", display: 'flex', flexDirection: "row", pt: 1, pl: 1, pr: 1 }}>

                                                <Box sx={{ pl: 0.8, width: "95%", cursor: "pointer", pt: 0.5 }}>
                                                </Box>
                                                <Box sx={{ pl: 0.8, width: "5%", cursor: "pointer", pt: 0.5 }}>
                                                    <CusIconButton size="sm" variant="outlined" clickable="true" onClick={exportToExcel} >
                                                        <DownloadIcon color='primary' fontSize='small' />
                                                    </CusIconButton>

                                                </Box>
                                            </Box>
                                            <Box sx={{ width: "100%", display: 'flex', flexDirection: "row", pt: 1, pl: 1, pr: 1 }}>
                                                <Box sx={{
                                                    borderBottom: 1, borderWidth: 0.1, borderColor: 'black', minHeight: 300, maxHeight: 600,
                                                    overflow: 'auto'
                                                }} >
                                                    <CssVarsProvider>
                                                        <Table stickyHeader>
                                                            <thead>
                                                                <tr>
                                                                    <th style={{ width: '15%', align: "center" }}>UHID</th>
                                                                    <th style={{ width: '30%', align: "center" }}>Pateint Name</th>
                                                                    <th style={{ width: '30%', align: "center" }}>Pateint Address</th>
                                                                    <th style={{ width: '20%', align: "center" }}>Pateint Place</th>
                                                                    <th style={{ width: '15%', align: "center" }}>Pateint Mobile</th>
                                                                    <th style={{ width: '15%', align: "center" }}>Amount</th>
                                                                    <th style={{ width: '15%', align: "center" }}>Payment Mode</th>
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
                                                                        <td> {val.uhid}</td>
                                                                        <td> {val.patient_name}</td>
                                                                        <td> {val.patient_address}</td>
                                                                        <td> {val.patient_place}</td>
                                                                        <td> {val.patient_mobile}</td>
                                                                        <td> {RegFee}</td>
                                                                        <td>{val.paymentmode}</td>
                                                                    </tr>
                                                                })}
                                                            </tbody>
                                                        </Table>
                                                    </CssVarsProvider>
                                                </Box>
                                            </Box>
                                        </Box> :
                                        radiovalue === '3' ?

                                            <Box>
                                                <Box sx={{ width: "100%", display: 'flex', flexDirection: "row", pt: 1, pl: 1, pr: 1 }}>

                                                    <Box sx={{ pl: 0.8, width: "95%", cursor: "pointer", pt: 0.5 }}>
                                                    </Box>
                                                    <Box sx={{ pl: 0.8, width: "5%", cursor: "pointer", pt: 0.5 }}>
                                                        <CusIconButton size="sm" variant="outlined" clickable="true" onClick={exportToExcel} >
                                                            <DownloadIcon color='primary' fontSize='small' />
                                                        </CusIconButton>

                                                    </Box>
                                                </Box>
                                                <Box sx={{ width: "100%", display: 'flex', flexDirection: "row", pt: 1, pl: 1, pr: 1 }}>
                                                    <Box sx={{
                                                        borderBottom: 1, borderWidth: 0.1, borderColor: 'black', minHeight: 300, maxHeight: 600,
                                                        overflow: 'auto'
                                                    }} >
                                                        <CssVarsProvider>
                                                            <Table stickyHeader>
                                                                <thead>
                                                                    <tr>
                                                                        <th style={{ width: '20%', align: "center" }}>UHID</th>
                                                                        <th style={{ width: '25%', align: "center" }}>Pateint Name</th>
                                                                        <th style={{ width: '30%', align: "center" }}>Pateint Address</th>
                                                                        <th style={{ width: '20%', align: "center" }}>Pateint Place</th>
                                                                        <th style={{ width: '15%', align: "center" }}>Pateint Mobile</th>
                                                                        <th style={{ width: '15%', align: "center" }}>Amount</th>
                                                                        <th style={{ width: '15%', align: "center" }}>Payment Mode</th>
                                                                        <th style={{ width: '15%', align: "center" }}>Doctor</th>
                                                                        <th style={{ width: '15%', align: "center" }}>Token No</th>
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
                                                                            <td> {val.uhid}</td>
                                                                            <td> {val.patient_name}</td>
                                                                            <td> {val.patient_address}</td>
                                                                            <td> {val.patient_place}</td>
                                                                            <td> {val.patient_mobile}</td>
                                                                            <td>{val.paymentmode}</td>
                                                                            <td> {val.fee}</td>
                                                                            <td> {val.doctor_name}</td>
                                                                            <td>{val.token_no}</td>
                                                                        </tr>
                                                                    })}
                                                                </tbody>
                                                            </Table>
                                                        </CssVarsProvider>
                                                    </Box>
                                                </Box>
                                            </Box> :

                                            <Box>

                                                <Box sx={{ width: "100%", display: 'flex', flexDirection: "row", pt: 1, pl: 1, pr: 1 }}>

                                                    <Box sx={{ pl: 0.8, width: "95%", cursor: "pointer", pt: 0.5 }}>
                                                    </Box>
                                                    <Box sx={{ pl: 0.8, width: "5%", cursor: "pointer", pt: 0.5 }}>
                                                        <CusIconButton size="sm" variant="outlined" clickable="true" onClick={exportToExcel} >
                                                            <DownloadIcon color='primary' fontSize='small' />
                                                        </CusIconButton>

                                                    </Box>
                                                </Box>

                                                <Box sx={{ width: "100%", display: 'flex', flexDirection: "row", pt: 1, pl: 1, pr: 1 }}>
                                                    <Box sx={{
                                                        borderBottom: 1, borderWidth: 0.1, borderColor: 'black', minHeight: 300, maxHeight: 600,
                                                        overflow: 'auto'
                                                    }} >
                                                        <CssVarsProvider>
                                                            <Table stickyHeader>
                                                                <thead>
                                                                    <tr>
                                                                        <th style={{ width: '8%', align: "center" }}>Bill No</th>
                                                                        <th style={{ width: '20%', align: "center" }}>Bill Date</th>
                                                                        <th style={{ width: '15%', align: "center" }}>Bill Amount </th>
                                                                        <th style={{ width: '15%', align: "center" }}>Payment Mode</th>
                                                                        <th style={{ width: '20%', align: "center" }}>UHID</th>
                                                                        <th style={{ width: '30%', align: "center" }}>Pateint Name</th>
                                                                        <th style={{ width: '30%', align: "center" }}>Pateint Address</th>
                                                                        <th style={{ width: '20%', align: "center" }}>Pateint Place</th>
                                                                        <th style={{ width: '15%', align: "center" }}>Pateint Mobile</th>

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
                                                                            <td> {val.ip_bill_mast_slno}</td>
                                                                            <td> {val.ip_bill_date}</td>
                                                                            <td> {val.ip_bill_amount}</td>
                                                                            <td>{val.paymentmode}</td>
                                                                            <td> {val.uhid}</td>
                                                                            <td> {val.patient_name}</td>
                                                                            <td> {val.patient_address}</td>
                                                                            <td> {val.patient_place}</td>
                                                                            <td> {val.patient_mobile}</td>
                                                                        </tr>
                                                                    })}
                                                                </tbody>
                                                            </Table>
                                                        </CssVarsProvider>
                                                    </Box>

                                                </Box>
                                            </Box>
                                }






                            </Box> : null
                    }

                </Box>
            </Paper>
        </Box>

    )
}

export default memo(CashCloseReport)
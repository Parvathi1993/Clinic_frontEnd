import React, { useCallback, memo, useState, useEffect } from 'react'
import { Box } from '@mui/joy'
import { Paper } from '@mui/material'
import Typography from '@mui/joy/Typography'
import { ToastContainer } from 'react-toastify'
import RefreshIcon from '@mui/icons-material/Refresh';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import CusIconButton from '../../Components/CusIconButton';
import CustomInput from '../../Components/CustomInput';
import { axioslogin } from '../../AxiosConfig/Axios';
import { CssVarsProvider } from '@mui/joy/'
import Table from '@mui/joy/Table';
import { warningNotify } from '../../Components/CommonCode';
import { DuplicateOpBillPrint } from './DuplicateBillPrint'
import Button from '@mui/material/Button';

const BillSearchReport = () => {
    const [billNo, setBillNo] = useState('')
    const [disflag, setDisFlag] = useState(0)
    const [TableData, setTableData] = useState([])

    const [BillPateintdtl, setBillPateintDetl] = useState({
        salutation: '',
        patient_name: '',
        patient_address: '',
        patient_place: '',
        patient_pincode: '',
        patient_district: '',
        patient_mobile: '',
        patient_dob: '',
        patient_age: '',
        patient_month: '',
        patient_day: '',
        uhid: '',
        billdate: '',
        billAmount: ''
    })

    const { salutation, patient_name, patient_address, patient_place, patient_pincode, patient_district,
        patient_mobile, patient_dob, patient_age, patient_month, patient_day, billdate, billAmount, uhid } = BillPateintdtl


    const search = useCallback(() => {


        const getBillPatientDetal = async (pateintid) => {
            const result = await axioslogin.get(`/Reports/getBillPateintDetails/${pateintid}`)
            const { success, data } = result.data
            if (success === 1) {
                // setTokenTaken(1)
                const { salutation, patient_name, patient_address, patient_place,
                    patient_pincode, patient_district, patient_mobile, patient_dob, patient_age, patient_month,
                    patient_day, uhid, bill_date, bill_amount } = data[0]
                const frmdata = {
                    salutation: salutation === 1 ? "Mr" :
                        salutation === 2 ? "Mrs" :
                            salutation === 3 ? "Miss" :
                                salutation === 4 ? "Dr" :
                                    salutation === 5 ? "Ms" :
                                        salutation === 6 ? "Prof" :
                                            salutation === 7 ? "Rev" :
                                                salutation === 8 ? "Lady" :
                                                    salutation === 9 ? "Sir" :
                                                        salutation === 10 ? "Capt" :
                                                            salutation === 11 ? "Major" :
                                                                salutation === 12 ? "Col" :
                                                                    salutation === 13 ? "Lady" :
                                                                        salutation === 14 ? "Cmdr" :
                                                                            salutation === 15 ? "Brgdr" :
                                                                                salutation === 16 ? "Judge" :
                                                                                    salutation


                    ,
                    patient_name: patient_name,
                    patient_address: patient_address,
                    patient_place: patient_place,
                    patient_pincode: patient_pincode,
                    patient_district: patient_district,
                    patient_mobile: patient_mobile,
                    patient_dob: patient_dob,
                    patient_age: patient_age,
                    patient_month: patient_month,
                    patient_day: patient_day,
                    uhid: uhid,
                    billdate: bill_date,
                    billAmount: bill_amount
                }
                setBillPateintDetl(frmdata)
            } else {
                const frmdata = {
                    salutation: '',
                    patient_name: '',
                    patient_address: '',
                    patient_place: '',
                    patient_pincode: '',
                    patient_district: '',
                    patient_mobile: '',
                    patient_dob: '',
                    patient_age: '',
                    patient_month: '',
                    patient_day: '',
                    uhid: '',
                    billdate: '',
                    billAmount: ''
                }
                setBillPateintDetl(frmdata)


            }
        }


        const getBillDetails = async (pateintid) => {
            const result = await axioslogin.get(`/Reports/getBillDetails/${pateintid}`)
            const { success, data } = result.data
            if (success === 1) {
                setDisFlag(1)
                setTableData(data)

            } else {
                warningNotify("No Bill exist given bill number, Please check Bill Number !!!")
            }
        }



        getBillDetails(billNo)
        getBillPatientDetal(billNo)
    }, [billNo])
    const [printingdata, setPrintingData] = useState([])
    const referesh = useCallback(() => {
        setBillNo('')
        setDisFlag(0)
        setTableData([])

        const resetfrm = {
            salutation: '',
            patient_name: '',
            patient_address: '',
            patient_place: '',
            patient_pincode: '',
            patient_district: '',
            patient_mobile: '',
            patient_dob: '',
            patient_age: '',
            patient_month: '',
            patient_day: '',
            uhid: '',
            billdate: '',
            billAmount: ''
        }
        setBillPateintDetl(resetfrm)
        setPrintingData([])
    }, [])

    useEffect(() => {
        const getSettingData = async () => {
            const result = await axioslogin.get(`/settingMaster`)
            const { success, data } = result.data
            if (success === 1) {
                setPrintingData(data)

            } else {
                setPrintingData([])
            }
        }
        getSettingData()
    }, [])

    const duplicatePrint = useCallback(() => {
        DuplicateOpBillPrint(printingdata, patient_name, patient_address, patient_district,
            patient_mobile, patient_age, billdate, billAmount, uhid, TableData, billNo)

    }, [printingdata, patient_name, patient_address, patient_district,
        patient_mobile, patient_age, billdate, billAmount, uhid, TableData, billNo])
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
                        <Typography level='body-md' fontWeight='lg' >Bill Search</Typography>
                    </Box>
                </Box>
                <Box sx={{
                    width: '50%', display: 'flex', pt: 2.5, margin: 'auto ', pl: 10, pb: 1

                }}>
                    <Box sx={{ pl: 0.8, width: "15%", cursor: "pointer" }}>
                        <Typography sx={{ fontSize: 13, fontFamily: 'sans-serif', fontWeight: 550 }} >Bill No</Typography>
                    </Box>
                    <Box sx={{ pl: 0.8, width: "30%", cursor: "pointer" }}>
                        <CustomInput placeholder={"Enter Bill No"}
                            type="text"
                            size="sm"
                            name="billNo"
                            value={billNo}
                            handleChange={(e) => setBillNo(e.target.value)}
                        // handleChange={updatePatientId}
                        />
                    </Box>
                    <Box sx={{ width: '3%', pl: 1, pr: 0.5 }}>
                        <CusIconButton size="sm" variant="outlined" clickable="true" color="primary" onClick={search} >
                            <SearchOutlinedIcon fontSize='small' />
                        </CusIconButton>
                    </Box>
                    <Box sx={{ width: '4%', pl: 3 }}>
                        <CusIconButton size="sm" variant="outlined" clickable="true" color="primary" onClick={referesh} >
                            <RefreshIcon fontSize='small' />
                        </CusIconButton>
                    </Box>
                </Box>

                {disflag === 1 ?

                    <Box>


                        <Box sx={{ width: '80%', display: 'flex', pt: 2.5, margin: 'auto ', pl: 10, flexDirection: "column" }}>

                            <Box sx={{ width: "100%", display: 'flex', flexDirection: "row", }}>
                                <Box sx={{ width: "10%", pt: 0.5 }}>
                                    <Typography sx={{ fontSize: 13, fontFamily: 'sans-serif', fontWeight: 550 }} >Salutation</Typography>
                                </Box>

                                <Box sx={{ width: "10%", pr: 1 }}>
                                    <CustomInput
                                        type="text"
                                        size="sm"
                                        name="salutation"
                                        value={salutation}
                                        disable={true}
                                    />
                                </Box>
                                <Box sx={{ width: "10%", pt: 0.5, pl: 1 }}>
                                    <Typography sx={{ fontSize: 13, fontFamily: 'sans-serif', fontWeight: 550 }} >Pateint Name</Typography>
                                </Box>
                                <Box sx={{ width: "30%", pr: 1 }}>
                                    <CustomInput
                                        type="text"
                                        size="sm"
                                        name="patient_name"
                                        value={patient_name}
                                        disable={true}
                                    />
                                </Box>
                                <Box sx={{ width: "10%", pl: 1, pt: 0.5 }}>
                                    <Typography sx={{ fontSize: 13, fontFamily: 'sans-serif', fontWeight: 550 }} >UHID</Typography>
                                </Box>
                                <Box sx={{ width: "25%", }}>
                                    <CustomInput
                                        type="text"
                                        size="sm"
                                        name="uhid"
                                        value={uhid}
                                        disable={true}
                                    />
                                </Box>
                            </Box>

                            <Box sx={{ width: "100%", display: 'flex', flexDirection: "row", pt: 1 }}>
                                <Box sx={{ width: "10%", pt: 0.5 }}>
                                    <Typography sx={{ fontSize: 13, fontFamily: 'sans-serif', fontWeight: 550 }} >Bill Date</Typography>
                                </Box>

                                <Box sx={{ width: "20%", pr: 1 }}>
                                    <CustomInput
                                        type="text"
                                        size="sm"
                                        name="billdate"
                                        value={billdate}
                                        disable={true}
                                    />
                                </Box>
                                <Box sx={{ width: "10%", pt: 0.5, pl: 1 }}>
                                    <Typography sx={{ fontSize: 13, fontFamily: 'sans-serif', fontWeight: 550 }} >Bill Amount</Typography>
                                </Box>
                                <Box sx={{ width: "20%", pr: 1 }}>
                                    <CustomInput
                                        type="text"
                                        size="sm"
                                        name="billAmount"
                                        value={billAmount}
                                        disable={true}
                                    />
                                </Box>
                                <Box sx={{ width: "10%", pl: 1, pt: 0.5 }}>
                                    <Typography sx={{ fontSize: 13, fontFamily: 'sans-serif', fontWeight: 550 }} >Place/Region</Typography>
                                </Box>
                                <Box sx={{ width: "25%", }}>
                                    <CustomInput
                                        type="text"
                                        size="sm"
                                        name="patient_place"
                                        value={patient_place}
                                        disable={true}
                                    />
                                </Box>
                            </Box>

                            <Box sx={{ width: "100%", display: 'flex', flexDirection: "row", pt: 1 }}>
                                <Box sx={{ width: "10%", pt: 0.5 }}>
                                    <Typography sx={{ fontSize: 13, fontFamily: 'sans-serif', fontWeight: 550 }} >Pateint Address</Typography>
                                </Box>
                                <Box sx={{ width: "50%", pr: 1 }}>
                                    <CustomInput
                                        type="text"
                                        size="sm"
                                        name="patient_address"
                                        value={patient_address}
                                        disable={true}
                                    />
                                </Box>

                                <Box sx={{ width: "10%", pl: 1, pt: 0.5 }}>
                                    <Typography sx={{ fontSize: 13, fontFamily: 'sans-serif', fontWeight: 550 }} >Pin Code</Typography>
                                </Box>
                                <Box sx={{ width: "25%", }}>
                                    <CustomInput
                                        type="text"
                                        size="sm"
                                        name="patient_pincode"
                                        value={patient_pincode}
                                        disable={true}
                                    />
                                </Box>
                            </Box>
                            <Box sx={{ width: "100%", display: 'flex', flexDirection: "row", pt: 1 }}>
                                <Box sx={{ width: "10%", pt: 0.5, }}>
                                    <Typography sx={{ fontSize: 13, fontFamily: 'sans-serif', fontWeight: 550 }} >District</Typography>
                                </Box>
                                <Box sx={{ width: "50%", pr: 1 }}>
                                    <CustomInput
                                        type="text"
                                        size="sm"
                                        name="patient_district"
                                        value={patient_district}
                                        disable={true}
                                    />
                                </Box>
                                <Box sx={{ width: "10%", pl: 1, pt: 0.5 }}>
                                    <Typography sx={{ fontSize: 13, fontFamily: 'sans-serif', fontWeight: 550 }} >Mobile No</Typography>
                                </Box>
                                <Box sx={{ width: "25%", }}>
                                    <CustomInput
                                        type="text"
                                        size="sm"
                                        name="patient_mobile"
                                        value={patient_mobile}
                                        disable={true}
                                    />
                                </Box>
                            </Box>

                            <Box sx={{ width: "100%", display: 'flex', flexDirection: "row", pt: 1 }}>
                                <Box sx={{ width: "10%", pt: 0.5, }}>
                                    <Typography sx={{ fontSize: 13, fontFamily: 'sans-serif', fontWeight: 550 }} >Dob</Typography>
                                </Box>
                                <Box sx={{ width: "25%", pr: 1 }}>
                                    <CustomInput
                                        type="text"
                                        size="sm"
                                        name="patient_dob"
                                        value={patient_dob}
                                        disable={true}
                                    />
                                </Box>
                                <Box sx={{ width: "5%", pt: 0.5, }}>
                                    <Typography sx={{ fontSize: 13, fontFamily: 'sans-serif', fontWeight: 550 }} >Age</Typography>
                                </Box>
                                <Box sx={{ width: "15%", pr: 1.5 }}>
                                    <CustomInput
                                        type="text"
                                        size="sm"
                                        name="patient_age"
                                        value={patient_age}
                                        disable={true}
                                    />
                                </Box>
                                <Box sx={{ width: "5%", pt: 0.5, }}>
                                    <Typography sx={{ fontSize: 13, fontFamily: 'sans-serif', fontWeight: 550 }} >Month</Typography>
                                </Box>
                                <Box sx={{ width: "15%", pr: 1.5 }}>
                                    <CustomInput
                                        type="text"
                                        size="sm"
                                        name="patient_month"
                                        value={patient_month}
                                        disable={true}
                                    />
                                </Box>
                                <Box sx={{ width: "5%", pt: 0.5, }}>
                                    <Typography sx={{ fontSize: 13, fontFamily: 'sans-serif', fontWeight: 550 }} >Days</Typography>
                                </Box>
                                <Box sx={{ width: "16%", pr: 1, }}>
                                    <CustomInput
                                        type="text"
                                        size="sm"
                                        name="patient_day"
                                        value={patient_day}
                                        disable={true}
                                    />
                                </Box>
                            </Box>


                            <Box sx={{ width: "100%", display: 'flex', flexDirection: "column", pt: 1, pb: 1.5 }}>

                                <Box sx={{ border: 0.5 }}>
                                    <CssVarsProvider>
                                        <Table stickyHeader>
                                            <thead>
                                                <tr>
                                                    <th style={{ width: '20%', align: "center" }}>Sl No</th>
                                                    <th style={{ width: '60%', align: "center" }}>Procedure Name</th>
                                                    <th style={{ width: '60%', align: "center" }}>Procedure Code</th>
                                                    <th style={{ width: '60%', align: "center" }}>Procedure Category</th>
                                                    <th style={{ width: '60%', align: "center" }}>Procedure Rate</th>

                                                </tr>
                                            </thead>
                                            <tbody>
                                                {TableData && TableData.map((val, index) => {
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
                                                        <td> {val.procedure_catgry_name}</td>
                                                        <td> {val.procedure_rate}</td>
                                                    </tr>
                                                })}
                                            </tbody>
                                        </Table>
                                    </CssVarsProvider>
                                </Box>
                            </Box>



                        </Box>




                        <Box sx={{ width: "100%", display: 'flex', flexDirection: "row", }}>

                            <Box sx={{ width: "45%", pr: 1 }}>
                            </Box>
                            <Box sx={{ pl: 1, pb: 1 }}>
                                <Button color="primary" variant="contained" onClick={duplicatePrint} >Print</Button>
                            </Box>

                        </Box>




                    </Box>
                    : null

                }




            </Paper>
        </Box>


    )
}

export default memo(BillSearchReport)
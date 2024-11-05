import React, { useCallback, memo, useState, useMemo, useEffect } from 'react'
import { Box } from '@mui/joy'
import { Paper } from '@mui/material'
import Typography from '@mui/joy/Typography'
import CustomInput from '../../../Components/CustomInput'
import Button from '@mui/material/Button';
import { axioslogin } from '../../../AxiosConfig/Axios'
import { ToastContainer } from 'react-toastify'
import { succesNotify, warningNotify } from '../../../Components/CommonCode'
import { differenceInCalendarDays, format } from 'date-fns'
import SpecialityDropDown from '../../../Components/SpecialityDropDown'
import DoctorDropDownBySepciality from '../../../Components/DoctorDropDownBySepciality'
import RefreshIcon from '@mui/icons-material/Refresh';
import CusIconButton from '../../../Components/CusIconButton';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import ShowPAge from './ShowPAge'
import { useNavigate } from 'react-router-dom'
import VacantToken from '../../../Components/VacantToken'
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import CusCheckbox from '../../../Components/CusCheckbox'

const Revisit = () => {
    const navigate = useNavigate()
    const [pateintid, setPatientId] = useState('')
    const [radiovalue, setRadioValue] = useState('1')
    const [cross_status, setcross_status] = useState(false)
    //Radio button OnClick function starts
    const updateRadioClick = useCallback(async (e) => {
        e.preventDefault()
        setRadioValue(e.target.value)
    }, [])
    const [patient, setPatient] = useState({
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
        patient_day: ''
    })

    const { salutation, patient_name, patient_address, patient_place, patient_pincode, patient_district,
        patient_mobile, patient_dob, patient_age, patient_month, patient_day
    } = patient
    const updatePatientId = useCallback((e) => {
        setPatientId(e.target.value)
    }, [])

    const [speciality, setspeciality] = useState(0)
    const [doctor, setDoctor] = useState(0)
    const [lastToken, setLastToken] = useState(0)
    const [feedetail, setFeeDetail] = useState({
        Fee: '',
        token_start: '',
        token_end: '',
        renewal: ''
    })
    const { Fee, token_end, renewal } = feedetail
    const [tokentaken, setTokenTaken] = useState(0)
    const [daysdiff, setDayDiff] = useState(0)
    const [modalFlag, setModalFlag] = useState(false)
    const [modal, setModal] = useState(0)
    const [lastVisitId, setLastVisitId] = useState(0)
    const [lastregrenewal, setlastregrenewal] = useState(0)
    const [reg_renewaldays, setreg_renewaldays] = useState(0)

    useEffect(() => {
        const getDoctortoken = async (doctor) => {
            const result = await axioslogin.get(`/patientRegistration/getDoctortokenDetail/${doctor}`)
            const { success, data } = result.data
            if (success === 1) {
                const { lasttoken_no } = data[0]
                setLastToken(lasttoken_no)
            } else {
                setLastToken(0)
            }
        }
        const getDoctorFee = async (doctor) => {
            const result = await axioslogin.get(`/patientRegistration/getDoctorFeeDetail/${doctor}`)
            const { success, data } = result.data
            if (success === 1) {
                const { doctor_fee, doctor_token_start, doctor_token_end, doctor_renewal_day } = data[0]
                const frmdata = {
                    Fee: doctor_fee,
                    token_start: doctor_token_start,
                    token_end: doctor_token_end,
                    renewal: doctor_renewal_day
                }
                setFeeDetail(frmdata)
            } else {
                // setDoctorArray([])
            }
        }

        const getLastVistdate = async (postdata) => {
            const result = await axioslogin.post('/patientRegistration/lastVisitingDate', postdata)
            const { data, success } = result.data
            if (success === 1) {

                const { visit_date } = data[0]
                const xx = differenceInCalendarDays(new Date(), new Date(visit_date))
                setDayDiff(xx);
            }
            else {
                warningNotify("No Last Visit")
            }
        }

        const getRegistrationFee = async () => {
            const result = await axioslogin.get(`/settingMaster`)
            const { success, data } = result.data
            if (success === 1) {
                const { reg_renewaldays } = data[0]
                setreg_renewaldays(reg_renewaldays)
            } else {
                warningNotify("Renewal Fee Not Given")
            }
        }

        getDoctortoken(doctor)
        getDoctorFee(doctor)
        const postData = {
            patient_id: pateintid,
            doctor_slno: doctor
        }
        getLastVistdate(postData)
        getRegistrationFee()


    }, [doctor, pateintid])
    const [TokenSelect, SetTokenSelect] = useState(0)

    const [appoinmentFlag, setAppoinmentFlag] = useState(0)
    const [appoinmentdetail, setAppoinmentDetail] = useState({
        appSpecialization: '',
        appDoctr: '',
        appToken: '',
        AppFee: '',
        Appdoctor_slno: ''
    })
    const { appSpecialization, appDoctr, appToken, AppFee, Appdoctor_slno } = appoinmentdetail

    const search = useCallback(() => {
        const getPatientDetails = async (pateintid) => {
            const result = await axioslogin.get(`/patientRegistration/PatientDetailsGtting/${pateintid}`)
            const { success, data } = result.data
            if (success === 1) {
                setTokenTaken(1)
                const { salutation, patient_name, patient_address, patient_place,
                    patient_pincode, patient_district, patient_mobile, patient_dob, patient_age, patient_month,
                    patient_day } = data[0]
                const frmdata = {
                    salutation: salutation,
                    patient_name: patient_name,
                    patient_address: patient_address,
                    patient_place: patient_place,
                    patient_pincode: patient_pincode,
                    patient_district: patient_district,
                    patient_mobile: patient_mobile,
                    patient_dob: patient_dob,
                    patient_age: patient_age,
                    patient_month: patient_month,
                    patient_day: patient_day
                }
                setPatient(frmdata)
            } else {
                setTokenTaken(0)
                warningNotify("No patient in given id")
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
                    patient_day: ''
                }
                setPatient(resetfrm)
            }
        }


        const getAppoinmentExistOrNot = async (pateintid) => {
            const result = await axioslogin.get(`/patientRegistration/getAppoinmentVisitToday/${pateintid}`)
            const { success, data } = result.data
            if (success === 1) {
                setTokenTaken(0)
                setAppoinmentFlag(1)
                const { visit_mast_slno, speciality_name, doctor_name, fee, token_no, doctor_slno } = data[0]
                const setAppFrmData = {
                    appSpecialization: speciality_name,
                    appDoctr: doctor_name,
                    appToken: token_no,
                    AppFee: fee,
                    Appdoctor_slno: doctor_slno
                }
                setAppoinmentDetail(setAppFrmData)
                setLastVisitId(visit_mast_slno)
            } else {
                setTokenTaken(1)
                setAppoinmentFlag(0)
            }
        }


        const getLastRegRenewal = async (pateintid) => {
            const result = await axioslogin.get(`/patientRegistration/getLastRegistrationRenewal/${pateintid}`)
            const { success, data } = result.data
            if (success === 1) {
                const { lastregrenewal } = data[0]
                const result = differenceInCalendarDays(new Date(), new Date(lastregrenewal))
                if (reg_renewaldays < result) {
                    setlastregrenewal(1)
                } else {
                    setlastregrenewal(0)
                }

            } else {
                warningNotify("No procedure Category added yet!!!!!!")
            }
        }

        getPatientDetails(pateintid)
        getAppoinmentExistOrNot(pateintid)
        getLastRegRenewal(pateintid)
    }, [pateintid, reg_renewaldays])

    const reset = useCallback(() => {
        setPatientId('')

        const resetfrmdata = {
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
            patient_day: ''

        }
        setPatient(resetfrmdata)
        setspeciality(0)
        setDoctor(0)
        setLastToken(0)
        const resetfee = {
            Fee: '',
            token_start: '',
            token_end: '',
            renewal: ''
        }
        setFeeDetail(resetfee)
        setTokenTaken(0)
        setDayDiff(0)
        setLastVisitId(0)
        setModal(0)
        setModalFlag(false)
        setAppoinmentFlag(0)
        const restApoinment = {
            appSpecialization: '',
            appDoctr: '',
            appToken: '',
            AppFee: '',
            Appdoctor_slno: ''
        }
        setAppoinmentDetail(restApoinment)
        setRadioValue('1')
        setcross_status(false)
    }, [])

    const referesh = useCallback(() => {
        reset()
    }, [reset])

    const postVisitMast = useMemo(() => {
        return {
            patient_id: pateintid,
            visit_date: format(new Date(), "yyyy-MM-dd"),
            doctor_slno: doctor,
            token_no: TokenSelect,
            fee: daysdiff <= renewal ? 0 : Fee,
            registration_fee: lastregrenewal === 1 ? 1 : 0,
            payment_mode_visit: radiovalue === '2' ? 2 : radiovalue === '3' ? 3 : 1
        }
    }, [pateintid, doctor, TokenSelect, Fee, daysdiff, renewal, lastregrenewal, radiovalue])

    const patchdata = useMemo(() => {
        return {
            patient_id: pateintid,
            registration_fee: lastregrenewal === 1 ? 1 : 0,
            doctor_slno: Appdoctor_slno,
            payment_mode_visit: radiovalue === '2' ? 2 : radiovalue === '3' ? 3 : 1
        }

    }, [pateintid, Appdoctor_slno, lastregrenewal, radiovalue])

    const submit = useCallback(() => {

        const insertVistMaster = async (postVisitMast) => {
            const result = await axioslogin.post('/patientRegistration/visitMasterInsert', postVisitMast);
            const { success, message, insetid } = result.data

            if (success === 1) {
                setLastVisitId(insetid)
                succesNotify("Visit saved")
                setModal(1)
                setModalFlag(true)
            } else {
                warningNotify(message)
            }
        }

        const updateApoinment = async (patchdata) => {
            const result = await axioslogin.patch('/Appoinments/updateAppoinmentSave', patchdata);
            const { success, message } = result.data
            if (success === 1) {
                succesNotify("Visit saved")
                setModal(1)
                setModalFlag(true)
            } else {
                warningNotify(message)
            }
        }

        if (appoinmentFlag === 0) {
            if (tokentaken === 1) {
                if (doctor !== 0) {
                    insertVistMaster(postVisitMast)
                } else {
                    warningNotify("Please select Doctor")
                }
            } else {
                warningNotify("Please Select patient before save")
            }
        }
        else {
            updateApoinment(patchdata)

        }
    }, [tokentaken, postVisitMast, doctor, patchdata, appoinmentFlag])



    const CloseMAster = useCallback(() => {
        navigate('/Home')
    }, [])

    const updatecross_status = useCallback((e) => {
        if (e.target.checked === true) {
            setcross_status(true)
            setAppoinmentFlag(0)
            setTokenTaken(1)
        } else {
            setcross_status(false)
        }
    }, [])

    return (
        <Box sx={{ width: "100%", p: 5 }}>
            <ToastContainer />
            {modal === 1 ? <ShowPAge open={modalFlag} lastVisitId={lastVisitId} reset={reset} flag={lastregrenewal} /> : null}
            {/* 1st section starts */}
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
                        <Typography level='body-md' fontWeight='lg' >REVISIT</Typography>
                    </Box>

                    <Box sx={{ width: '60%', display: 'flex', pt: 2.5, margin: 'auto ', pl: 10 }}>
                        <Box sx={{ pl: 0.8, width: "15%", cursor: "pointer" }}>
                            <Typography sx={{ fontSize: 13, fontFamily: 'sans-serif', fontWeight: 550 }} >UHID</Typography>
                        </Box>
                        <Box sx={{ pl: 0.8, width: "60%", cursor: "pointer" }}>
                            <CustomInput placeholder={"Enter UHID"}
                                type="text"
                                size="sm"
                                name="pateintid"
                                value={pateintid}
                                handleChange={updatePatientId} />
                        </Box>
                        <Box sx={{ width: '3%', pl: 1, pr: 0.5 }}>
                            <CusIconButton size="sm" variant="outlined" clickable="true" color="primary" onClick={search} >
                                <SearchOutlinedIcon fontSize='small' />
                            </CusIconButton>
                        </Box>
                        <Box sx={{ width: '3%', pl: 3 }}>
                            <CusIconButton size="sm" variant="outlined" clickable="true" color="primary" onClick={referesh} >
                                <RefreshIcon fontSize='small' />
                            </CusIconButton>
                        </Box>
                    </Box>

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
                        <Box sx={{ width: "100%", display: 'flex', flexDirection: "row", pt: 1 }}>
                            <Box sx={{ width: "20%", pt: 0.5, }}>
                                <Typography sx={{ fontSize: 13, fontFamily: 'sans-serif', fontWeight: 550 }} >Mode of Payment</Typography>
                            </Box>
                            <Box sx={{ width: "25%", pr: 1.5 }}>
                                <RadioGroup
                                    row
                                    aria-labelledby="demo-row-radio-buttons-group-label"
                                    name="row-radio-buttons-group"
                                    value={radiovalue}
                                    onChange={(e) => updateRadioClick(e)}
                                >
                                    <FormControlLabel value='1' control={<Radio />} label="Cash" />
                                    <FormControlLabel value='2' control={<Radio />} label="Card" />
                                    <FormControlLabel value='3' control={<Radio />} label="Gpay" />
                                </RadioGroup>
                            </Box>
                        </Box>
                        {appoinmentFlag === 1 ?
                            <Box sx={{ width: "100%", display: 'flex', flexDirection: "row", pt: 1 }}>
                                <Box sx={{ width: "20%", pt: 0.5, }}>
                                    <Typography sx={{ fontSize: 13, fontFamily: 'sans-serif', fontWeight: 550 }} >Cross Consultation Need</Typography>
                                </Box>
                                <Box sx={{ width: "25%", pr: 1.5 }}>
                                    <CusCheckbox
                                        color="primary"
                                        size="md"
                                        fontWeight='lg'
                                        name="cross_status"
                                        value={cross_status}
                                        checked={cross_status}
                                        onCheked={updatecross_status}
                                    ></CusCheckbox>
                                </Box>
                            </Box> : null
                        }

                        {
                            tokentaken === 1 && appoinmentFlag === 0 ?

                                <Box>
                                    <Box sx={{ width: "100%", display: 'flex', flexDirection: "row", pt: 1 }}>
                                        <Box sx={{ width: "25%", pt: 0.5, }}>
                                            <Typography sx={{ fontSize: 13, fontFamily: 'sans-serif', fontWeight: 550, pl: 8 }} >Speciality</Typography>
                                        </Box>
                                        <Box sx={{ width: "25%", pt: 0.5, }}>
                                            <Typography sx={{ fontSize: 13, fontFamily: 'sans-serif', fontWeight: 550, pl: 8 }} >Doctor Name</Typography>
                                        </Box>
                                        <Box sx={{ width: "25%", pt: 0.5, }}>
                                            <Typography sx={{ fontSize: 13, fontFamily: 'sans-serif', fontWeight: 550, pl: 8 }} >Fee</Typography>
                                        </Box>
                                        <Box sx={{ width: "25%", pt: 0.5, }}>
                                            <Typography sx={{ fontSize: 13, fontFamily: 'sans-serif', fontWeight: 550, pl: 8 }} >Token No</Typography>
                                        </Box>
                                    </Box>

                                    <Box sx={{ width: "100%", display: 'flex', flexDirection: "row", pt: 1 }}>
                                        <Box sx={{ width: "25%", pt: 0.5, pr: 1 }}>
                                            <SpecialityDropDown speciality={speciality} setspeciality={setspeciality} />
                                        </Box>
                                        <Box sx={{ width: "25%", pt: 0.5, pr: 1 }}>
                                            <DoctorDropDownBySepciality doctor={doctor} setDoctor={setDoctor} speciality={speciality} />
                                        </Box>
                                        <Box sx={{ width: "25%", pt: 0.5, pr: 1 }}>
                                            <CustomInput
                                                type="text"
                                                size="sm"
                                                name="Fee"
                                                value={daysdiff <= renewal ? 0 : Fee}
                                                disable={true}
                                            />
                                        </Box>
                                        <Box sx={{ pl: 2, pt: 0.7, width: "30%" }}>
                                            <VacantToken doctor={doctor} TokenSelect={TokenSelect} SetTokenSelect={SetTokenSelect} />
                                        </Box>
                                    </Box>

                                </Box> :

                                appoinmentFlag === 1 ?
                                    <Box>
                                        <Box sx={{ width: "100%", display: 'flex', flexDirection: "row", pt: 1 }}>
                                            <Box sx={{ width: "25%", pt: 0.5, }}>
                                                <Typography sx={{ fontSize: 13, fontFamily: 'sans-serif', fontWeight: 550, pl: 8 }} >Speciality</Typography>
                                            </Box>
                                            <Box sx={{ width: "25%", pt: 0.5, }}>
                                                <Typography sx={{ fontSize: 13, fontFamily: 'sans-serif', fontWeight: 550, pl: 8 }} >Doctor Name</Typography>
                                            </Box>
                                            <Box sx={{ width: "25%", pt: 0.5, }}>
                                                <Typography sx={{ fontSize: 13, fontFamily: 'sans-serif', fontWeight: 550, pl: 8 }} >Fee</Typography>
                                            </Box>
                                            <Box sx={{ width: "25%", pt: 0.5, }}>
                                                <Typography sx={{ fontSize: 13, fontFamily: 'sans-serif', fontWeight: 550, pl: 8 }} >Token No</Typography>
                                            </Box>
                                        </Box>

                                        <Box sx={{ width: "100%", display: 'flex', flexDirection: "row", pt: 1 }}>
                                            <Box sx={{ width: "25%", pt: 0.5, pr: 1 }}>
                                                <CustomInput
                                                    type="text"
                                                    size="sm"
                                                    name="appSpecialization"
                                                    value={appSpecialization}
                                                    disable={true}
                                                />
                                            </Box>
                                            <Box sx={{ width: "25%", pt: 0.5, pr: 1 }}>
                                                <CustomInput
                                                    type="text"
                                                    size="sm"
                                                    name="appDoctr"
                                                    value={appDoctr}
                                                    disable={true}
                                                />
                                            </Box>
                                            <Box sx={{ width: "25%", pt: 0.5, pr: 1 }}>
                                                <CustomInput
                                                    type="text"
                                                    size="sm"
                                                    name="AppFee"
                                                    value={AppFee}
                                                    disable={true}
                                                />
                                            </Box>
                                            <Box sx={{ width: "25%", pt: 0.5, }}>
                                                <CustomInput
                                                    type="text"
                                                    size="sm"
                                                    name="appToken"
                                                    value={appToken}
                                                    disable={true}
                                                />
                                            </Box>
                                        </Box>
                                    </Box>
                                    : null
                        }

                        <Box sx={{ width: "100%", display: 'flex', flexDirection: "row", pt: 2, pb: 2 }}>
                            <Box sx={{ width: "40%", pt: 0.5, }}>

                            </Box>
                            <Box sx={{ width: "80%", pt: 0.5, display: 'flex', flexDirection: "row" }}>
                                <Box sx={{ pl: 2 }}>
                                    <Button color="primary" variant="contained" onClick={submit} >Save</Button>
                                </Box>
                                <Box sx={{ pl: 2 }}>
                                    <Button color="primary" variant="contained" onClick={CloseMAster}>Close</Button>
                                </Box>
                            </Box>

                        </Box>
                    </Box>
                </Box>
            </Paper >
        </Box >

    )
}

export default memo(Revisit)
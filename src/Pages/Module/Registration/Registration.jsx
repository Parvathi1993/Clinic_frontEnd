import React, { useCallback, memo, useState, useMemo, useEffect, Fragment } from 'react'
import { Box } from '@mui/joy'
import { Paper } from '@mui/material'
import Typography from '@mui/joy/Typography'
import SalutationDropDown from '../../../Components/SalutationDropDown'
import CustomInput from '../../../Components/CustomInput'
import Button from '@mui/material/Button';
import { axioslogin } from '../../../AxiosConfig/Axios'
import { succesNotify, warningNotify } from '../../../Components/CommonCode'
import { differenceInYears, format, getMonth, getYear } from 'date-fns'
import SpecialityDropDown from '../../../Components/SpecialityDropDown'
import DoctorDropDownBySepciality from '../../../Components/DoctorDropDownBySepciality'
import ShowPAge from './ShowPAge'
import { useNavigate } from 'react-router-dom'
import RegistrationTable from './RegistrationTable'
import VacantToken from '../../../Components/VacantToken'
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';

const Registration = () => {
    const navigate = useNavigate()
    const [salutn, setSalutn] = useState(0)
    const [radiovalue, setRadioValue] = useState('1')

    //Radio button OnClick function starts
    const updateRadioClick = useCallback(async (e) => {
        e.preventDefault()
        setRadioValue(e.target.value)
    }, [])
    const [registration, setRegistration] = useState({
        patient_name: '',
        patient_address: '',
        patient_place: '',
        patient_pincode: '',
        patient_district: '',
        patient_mobile: '',
        patient_id: '',
        old_uhid: ''
    })
    //Destructuring
    const { patient_name, patient_address, patient_place, patient_pincode, patient_district,
        patient_mobile, patient_id, old_uhid } = registration
    const updateregistrationState = useCallback((e) => {
        const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
        setRegistration({ ...registration, [e.target.name]: value })
    }, [registration])

    const [patient_dob, setpatient_dob] = useState(new Date())
    const [agesplit, setAgesplit] = useState({
        patient_age: 0,
        patient_month: 0,
        patient_day: 0,
    })
    const { patient_age, patient_month, patient_day } = agesplit

    const updatepatient_dob = useCallback((e) => {
        setpatient_dob(e.target.value)
        const ageyear = differenceInYears(new Date(), new Date(e.target.value))
        const dobmonth = getMonth(new Date(e.target.value))
        const currntmonth = getMonth(new Date())
        const diifmonth = currntmonth - dobmonth
        const frmsetting = {
            patient_age: ageyear,
            patient_month: diifmonth,
            patient_day: 12,
        }
        setAgesplit(frmsetting)
    }, [])
    const [speciality, setspeciality] = useState(0)
    const [doctor, setDoctor] = useState(0)
    const [patientId, setPatientId] = useState(0)
    const [lastToken, setLastToken] = useState(0)
    const [TokenSelect, SetTokenSelect] = useState(0)
    const [feedetail, setFeeDetail] = useState({
        Fee: '',
        token_end: '',
    })
    const { Fee, token_end, } = feedetail

    useEffect(() => {

        const getPatientId = async () => {
            const result = await axioslogin.get(`/patientRegistration/PatientIdget`)
            const { success, data } = result.data
            if (success === 1) {
                const { patient_no } = data[0]
                setPatientId(patient_no)
            }
            else {
                warningNotify("Error occured in EDp")
            }
        }
        getPatientId();

    }, [])
    const [modalFlag, setModalFlag] = useState(false)
    const [modal, setModal] = useState(0)
    const [lastVisitId, setLastVisitId] = useState(0)
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
                const { doctor_fee, doctor_token_end, doctor_renewal_day } = data[0]
                const frmdata = {
                    Fee: doctor_fee,
                    token_end: doctor_token_end,
                    renewal: doctor_renewal_day
                }
                setFeeDetail(frmdata)
            } else {
                // setDoctorArray([])
            }
        }
        if (doctor !== 0) {
            getDoctortoken(doctor)
            getDoctorFee(doctor)
        }

    }, [doctor])

    const year = getYear(new Date())

    const uhiddata = patientId.toString().padStart(6, '0') + '/' + "NHC" + '/' + year

    const postData = useMemo(() => {
        return {
            patient_id: patientId,
            salutation: salutn,
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
            patient_no: patientId + 1,
            uhid: uhiddata,
            old_uhid: old_uhid
        }
    }, [salutn, patient_name, patient_address, patient_place, patient_pincode, patient_district, patient_mobile, patient_dob, patient_age,
        patient_month, patient_day, patientId, uhiddata, old_uhid])

    const postVisitMast = useMemo(() => {
        return {
            patient_id: patientId,
            visit_date: format(new Date(), "yyyy-MM-dd"),
            doctor_slno: doctor,
            token_no: TokenSelect,
            fee: Fee,
            registration_fee: 1,
            payment_mode_visit: radiovalue === '2' ? 2 : radiovalue === '3' ? 3 : 1
        }
    }, [patientId, doctor, TokenSelect, Fee, radiovalue])

    const patchdata = useMemo(() => {
        return {
            salutation: salutn === 0 ? null : salutn,
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
            patient_id: patient_id,
            old_uhid: old_uhid
        }
    }, [salutn, patient_name, patient_address, patient_place, patient_pincode, patient_district, patient_mobile, patient_dob, patient_age,
        patient_month, patient_day, patient_id, old_uhid])
    const reset = useCallback(() => {
        setSalutn(0)
        const resetdetail = {
            patient_name: '',
            patient_address: '',
            patient_place: '',
            patient_pincode: '',
            patient_district: '',
            patient_mobile: '',
            old_uhid: '',
        }
        setRegistration(resetdetail)
        setpatient_dob('')
        const resetdob = {
            patient_age: 0,
            patient_month: 0,
            patient_day: 0,
        }
        setAgesplit(resetdob)
        setspeciality(0)
        setDoctor(0)
        setPatientId(0)
        setLastToken(0)
        const resetfee = {
            Fee: '',
            token_end: '',
            renewal: ''
        }
        setFeeDetail(resetfee)
        setLastVisitId(0)
        setModal(0)
        setModalFlag(false)
        SetTokenSelect(0)
        const getPatientId = async () => {
            const result = await axioslogin.get(`/patientRegistration/PatientIdget`)
            const { success, data } = result.data
            if (success === 1) {
                const { patient_no } = data[0]
                setPatientId(patient_no)
            }
            else {
                warningNotify("Error occured in EDp")
            }
        }
        getPatientId()
        setRadioValue('1')
    }, [])

    const [editFlag, setEditFlag] = useState(0)
    const submit = useCallback(() => {

        const InsertPatientReg = async (postData) => {
            const result = await axioslogin.post('/patientRegistration', postData);
            return result.data
        }

        const insertVistMaster = async (postVisitMast) => {
            const result = await axioslogin.post('/patientRegistration/visitMasterInsert', postVisitMast);
            const { success, message, insetid } = result.data

            if (success === 1) {
                setLastVisitId(insetid)
                succesNotify(message)
                setModal(1)
                setModalFlag(true)
            } else {
                warningNotify(message)
            }
        }

        const updatePatientMast = async (patchdata) => {
            const result = await axioslogin.patch('/patientRegistration', patchdata);
            const { success, message } = result.data
            if (success === 1) {
                reset()
                succesNotify(message)
            } else {
                warningNotify(message)
            }
        }


        if (editFlag === 0) {
            if (patient_name !== '' && patient_address !== '' && patient_mobile !== '' && doctor !== 0 && TokenSelect !== 0) {
                InsertPatientReg(postData).then((val) => {
                    const { success, message } = val
                    if (success === 1) {
                        insertVistMaster(postVisitMast)
                    } else {
                        warningNotify(message)
                    }
                })

            } else {
                warningNotify("Please Fill Mandatory Fields")
            }
        } else {

            updatePatientMast(patchdata)
        }
    }, [postData, postVisitMast, patient_name, patient_address, patient_mobile, doctor, token_end, TokenSelect,
        editFlag, lastToken, patchdata, reset])


    const viewdata = useCallback(() => {
        setEditFlag(1)
    }, [])

    const rowSelect = useCallback((value) => {
        setEditFlag(2)

        const { patient_id, salutation, patient_name, old_uhid,
            patient_address, patient_place, patient_pincode, patient_district,
            patient_mobile, patient_dob, patient_age, patient_month, patient_day } = value

        const setFrmdata = {
            patient_name: patient_name,
            patient_address: patient_address,
            patient_place: patient_place,
            patient_pincode: patient_pincode,
            patient_district: patient_district,
            patient_mobile: patient_mobile,
            patient_id: patient_id,
            old_uhid: old_uhid
        }
        setRegistration(setFrmdata)
        setSalutn(salutation)
        setpatient_dob(patient_dob)
        const agereset = {
            patient_age: patient_age,
            patient_month: patient_month,
            patient_day: patient_day,
        }
        setAgesplit(agereset)
        setPatientId(patient_id)
    }, [])

    const CloseFnctn = useCallback(() => {
        setEditFlag(0)
    }, [])
    const CloseMAster = useCallback(() => {
        navigate('/Home')
    }, [navigate])

    return (
        <Fragment>
            {
                editFlag === 1 ?
                    <RegistrationTable rowSelect={rowSelect} CloseFnctn={CloseFnctn} /> :
                    <Paper className='w-full flex flex-1 flex-col m-5 p-2  items-center justify-center gap-1 ' >
                        <Box sx={{ width: '100%', display: 'flex', justifyContent: "center" }}>
                            <Typography level='body-md' fontWeight='lg' sx={{ pb: 1 }} >REGISTRATION</Typography>
                        </Box>
                        {modal === 1 ? <ShowPAge open={modalFlag} lastVisitId={lastVisitId} reset={reset} flag={1} /> : null}
                        <Box className="flex justify-center items-center w-3/4">
                            <Box className="flex-1 ml-2 " >
                                <Typography level='body-md' fontWeight='lg' >UH Id</Typography>
                            </Box>
                            <Box className="flex-1" >
                                <CustomInput
                                    type="text"
                                    size="sm"
                                    value={uhiddata}
                                    disable={true}
                                />
                            </Box>
                        </Box>
                        <Box className="flex justify-center items-center w-3/4">
                            <Box className="flex-1 ml-2 " >
                                <Typography level='body-md' fontWeight='lg' >Salutation</Typography>
                            </Box>
                            <Box className="flex-1" >
                                <SalutationDropDown salutn={salutn} setSalutn={setSalutn} />
                            </Box>
                        </Box>
                        <Box className="flex justify-center items-center w-3/4">
                            <Box className="flex-1 ml-2 " >
                                <Typography level='body-md' fontWeight='lg' >Patient Name</Typography>
                            </Box>
                            <Box className="flex-1" >
                                <CustomInput placeholder={'Enter Patient Name'}
                                    type="text"
                                    size="sm"
                                    name="patient_name"
                                    value={patient_name}
                                    handleChange={updateregistrationState} />
                            </Box>
                        </Box>
                        <Box className="flex justify-center items-center w-3/4">
                            <Box className="flex-1 ml-2 " >
                                <Typography level='body-md' fontWeight='lg' >Address</Typography>
                            </Box>
                            <Box className="flex-1" >
                                <CustomInput placeholder={"Enter Address"}
                                    type="text"
                                    size="sm"
                                    name="patient_address"
                                    value={patient_address}
                                    handleChange={updateregistrationState} />
                            </Box>
                        </Box>
                        <Box className="flex justify-center items-center w-3/4">
                            <Box className="flex-1 ml-2 " >
                                <Typography level='body-md' fontWeight='lg' >Place / Region</Typography>
                            </Box>
                            <Box className="flex-1" >
                                <CustomInput placeholder={"Enter Region / Place"}
                                    type="text"
                                    size="sm"
                                    name="patient_place"
                                    value={patient_place}
                                    handleChange={updateregistrationState} />
                            </Box>
                        </Box>
                        <Box className="flex justify-center items-center w-3/4">
                            <Box className="flex-1 ml-2" >
                                <Typography level='body-md' fontWeight='lg'>Pincode</Typography>
                            </Box>
                            <Box className="flex-1" >
                                <CustomInput placeholder={"Enter Pincode"}
                                    type="number"
                                    size="sm"
                                    name="patient_pincode"
                                    value={patient_pincode}
                                    handleChange={updateregistrationState} />
                            </Box>
                        </Box>
                        <Box className="flex justify-center items-center w-3/4">
                            <Box className="flex-1 ml-2" >
                                <Typography level='body-md' fontWeight='lg'>District</Typography>
                            </Box>
                            <Box className="flex-1" >
                                <CustomInput placeholder={"Enter District"}
                                    type="text"
                                    size="sm"
                                    name="patient_district"
                                    value={patient_district}
                                    handleChange={updateregistrationState} />
                            </Box>
                        </Box>
                        <Box className="flex justify-center items-center w-3/4">
                            <Box className="flex-1 ml-2" >
                                <Typography level='body-md' fontWeight='lg'>Mobile</Typography>
                            </Box>
                            <Box className="flex-1" >
                                <CustomInput placeholder={"Enter Mobile"}
                                    type="number"
                                    size="sm"
                                    name="patient_mobile"
                                    value={patient_mobile}
                                    handleChange={updateregistrationState} />
                            </Box>
                        </Box>
                        <Box className="flex justify-center items-center w-3/4">
                            <Box className="flex flex-1 ml-2" >
                                <Typography level='body-md' fontWeight='lg'>Date Of Birth</Typography>
                            </Box>
                            <Box className="flex flex-1 flex-row" >
                                <CustomInput
                                    type="date"
                                    size="sm"
                                    slotProps={{
                                        input: {
                                            max: format(new Date(), "yyyy-MM-dd")
                                        },
                                    }}
                                    name="patient_dob"
                                    value={patient_dob}
                                    handleChange={updatepatient_dob}
                                />
                                <Box className="flex flex-grow flex-row items-center" >
                                    <Box className="flex text-[#75abe2] border-[#75abe2] flex-grow justify-center font-thin text-xs" >Age</Box>
                                    <Box className="flex text-[#75abe2] border-[#75abe2] flex-grow justify-center border rounded-lg p-1" >{patient_age}</Box>
                                    <Box className="flex text-[#75abe2] border-[#75abe2] flex-grow justify-center font-thin text-xs" >Months</Box>
                                    <Box className="flex text-[#75abe2] border-[#75abe2] flex-grow justify-center border rounded-lg p-1" >{patient_month}</Box>
                                    <Box className="flex text-[#75abe2] border-[#75abe2] flex-grow justify-center font-thin text-xs" >Days</Box>
                                    <Box className="flex text-[#75abe2] border-[#75abe2] flex-grow justify-center border rounded-lg p-1" >{patient_day}</Box>
                                </Box>
                            </Box>
                        </Box>
                        <Box className="flex justify-center items-center w-3/4">
                            <Box className="flex-1 ml-2 " >
                                <Typography level='body-md' fontWeight='lg' >Old UHID</Typography>
                            </Box>
                            <Box className="flex-1" >
                                <CustomInput placeholder={"Enter Old UHID"}
                                    type="text"
                                    size="sm"
                                    name="old_uhid"
                                    value={old_uhid}
                                    handleChange={updateregistrationState} />
                            </Box>
                        </Box>
                        {editFlag === 0 ?
                            <Box className="flex justify-center items-center w-3/4">
                                <Box className="flex-1 ml-2 " >
                                    <Typography level='body-md' fontWeight='lg' >Mode of Payment</Typography>
                                </Box>

                                <Box className="flex-1" >

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
                            </Box> : null}

                        {editFlag === 0 ?
                            <Box sx={{ width: "100%", pl: 35 }}>
                                <Box className="flex justify-center items-center w-3/4" sx={{ pt: 2 }}>
                                    <Box sx={{ pl: 2, width: "30%" }}>
                                        <Typography level='body-md' fontWeight='lg' >Speciality</Typography>
                                    </Box>
                                    <Box sx={{ pl: 2, width: "30%" }}>
                                        <Typography level='body-md' fontWeight='lg' >Doctor Name</Typography>

                                    </Box>
                                    <Box sx={{ pl: 2, width: "30%" }}>
                                        <Typography level='body-md' fontWeight='lg' >Fee</Typography>
                                    </Box>
                                    <Box sx={{ pl: 2, width: "30%" }}>
                                        <Typography level='body-md' fontWeight='lg' >Token No</Typography>

                                    </Box>
                                </Box>
                                <Box className="flex justify-center items-center w-3/4" sx={{}}>
                                    <Box sx={{ pl: 2, width: "30%" }}>
                                        <SpecialityDropDown speciality={speciality} setspeciality={setspeciality} />
                                    </Box>
                                    <Box sx={{ pl: 2, width: "30%" }}>
                                        <DoctorDropDownBySepciality doctor={doctor} setDoctor={setDoctor} speciality={speciality} />
                                    </Box>
                                    <Box sx={{ pl: 2, width: "30%" }}>
                                        <CustomInput
                                            type="text"
                                            size="sm"
                                            name="Fee"
                                            value={Fee}
                                            disable={true}
                                        />
                                    </Box>
                                    <Box sx={{ pl: 2, width: "30%" }}>
                                        <VacantToken doctor={doctor} TokenSelect={TokenSelect} SetTokenSelect={SetTokenSelect} />
                                    </Box>
                                </Box>
                            </Box> : null}

                        <Box className="flex justify-center items-center w-3/4" sx={{ pt: 2 }}>
                            <Box sx={{ pl: 2 }}>
                                <Button color="primary" variant="contained" onClick={submit} >Save</Button>
                            </Box>
                            <Box sx={{ pl: 2 }}>
                                <Button color="primary" variant="contained" onClick={viewdata}>view</Button>
                            </Box>
                            <Box sx={{ pl: 2 }}>
                                <Button color="primary" variant="contained" onClick={CloseMAster}>Close</Button>
                            </Box>
                        </Box>
                    </Paper>



            }




        </Fragment >
    )
}

export default memo(Registration)
import React, { memo, useCallback, useEffect, useMemo, useState } from 'react'
import { axioslogin } from '../../../AxiosConfig/Axios';
import Slide from '@mui/material/Slide';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import { Box, Paper } from '@mui/material'
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Typography from '@mui/joy/Typography'
import CustomInput from '../../../Components/CustomInput'
import { succesNotify, warningNotify } from '../../../Components/CommonCode';
import { differenceInYears, format, getMonth, getYear } from 'date-fns'
import SalutationDropDown from '../../../Components/SalutationDropDown'
import ShowPAge from '../Registration/ShowPAge';
const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="left" ref={ref} {...props} />;
});

const NewRegAppinmentModal = ({ open, modalcolse, newRegData }) => {
    const { doctor_slno, token_no, new_reg_name, new_reg_mobile, new_old_uhid, visit_mast_slno,
        doctor_name, speciality_name
    } = newRegData

    const [salutn, setSalutn] = useState(0)
    const [radiovalue, setRadioValue] = useState('1')
    const [patientId, setPatientId] = useState(0)
    //Radio button OnClick function starts
    const updateRadioClick = useCallback(async (e) => {
        e.preventDefault()
        setRadioValue(e.target.value)
    }, [])
    const [registration, setRegistration] = useState({
        patient_name: new_reg_name,
        patient_address: '',
        patient_place: '',
        patient_pincode: '',
        patient_district: '',
        patient_mobile: new_reg_mobile,
        old_uhid: new_old_uhid
    })
    //Destructuring
    const { patient_name, patient_address, patient_place, patient_pincode, patient_district,
        patient_mobile, old_uhid } = registration
    const updateregistrationState = useCallback((e) => {
        const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
        setRegistration({ ...registration, [e.target.name]: value })
    }, [registration])

    const [patient_dob, setpatient_dob] = useState('')
    const [agesplit, setAgesplit] = useState({
        patient_age: 0,
        patient_month: 0,
        patient_day: 0,
    })
    const { patient_age, patient_month, patient_day } = agesplit
    const [modalFlag, setModalFlag] = useState(false)
    const [modal, setModal] = useState(0)
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

    const year = getYear(new Date())

    const uhiddata = patientId.toString().padStart(6, '0') + '/' + "NHC" + '/' + year


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

    const patchVisitMaster = useMemo(() => {
        return {
            patient_id: patientId,
            status: 1,
            registration_fee: 1,
            payment_mode_visit: radiovalue,
            visit_mast_slno: visit_mast_slno
        }
    }, [patientId, visit_mast_slno, radiovalue])
    const SaveAppoinmentNewReg = useCallback(() => {


        const InsertPatientReg = async (postData) => {
            const result = await axioslogin.post('/patientRegistration', postData);
            return result.data
        }
        const updateVisitMastNewAppoinment = async (patchVisitMaster) => {
            const result = await axioslogin.patch('/Appoinments/UpdateNewAppionment', patchVisitMaster);
            const { success, message } = result.data
            if (success === 1) {
                succesNotify("Pateint Registred Successfully")
                modalcolse()
                setModal(1)
                setModalFlag(true)
            } else {
                warningNotify(message)
            }
        }

        if (patient_name !== '' && patient_address !== '' && patient_mobile !== '' && doctor_slno !== 0 && token_no !== 0) {
            InsertPatientReg(postData).then((val) => {
                const { success, message } = val
                if (success === 1) {
                    updateVisitMastNewAppoinment(patchVisitMaster)
                } else {
                    warningNotify(message)
                }
            })

        } else {
            warningNotify("Please Fill Mandatory Fields")
        }

    }, [patient_name, patient_address, patient_mobile, doctor_slno, token_no, patchVisitMaster])


    const reset = useCallback(() => {
        setSalutn(0)
        setRadioValue('1')
        setPatientId(0)

        const resetFrmdata = {
            patient_name: '',
            patient_address: '',
            patient_place: '',
            patient_pincode: '',
            patient_district: '',
            patient_mobile: '',
            patient_id: '',
            old_uhid: ''
        }
        setRegistration(resetFrmdata)
        setpatient_dob('')

        const resetage = {
            patient_age: 0,
            patient_month: 0,
            patient_day: 0,
        }
        setAgesplit(resetage)
        setModal(0)
        setModalFlag(false)

    }, [])


    return (
        <Dialog
            open={open}
            TransitionComponent={Transition}
            keepMounted
            fullWidth

            aria-describedby="alert-dialog-slide-descriptiona"
        >
            < DialogContent id="alert-dialog-slide-descriptiona"
                sx={{
                    minWidth: "100%",
                    minHeight: 250
                }}
            >
                < DialogContentText id="alert-dialog-slide-descriptiona" sx={{ width: "100%", textAlign: "center" }}>
                    Booking Appoinments For New Registration
                </DialogContentText>

                <Paper sx={{ pt: 1 }} >
                    {modal === 1 ? <ShowPAge open={modalFlag} lastVisitId={visit_mast_slno} reset={reset} flag={1} /> : null}
                    <Box sx={{
                        width: "80%", display: "flex", flexDirection: 'row', justifyContent: "center"
                    }}>
                        <Box sx={{ width: "50%", pt: 0.5, pl: 10 }}>
                            <Typography sx={{ fontSize: 16, fontFamily: 'sans-serif', fontWeight: 525 }} >UH Id</Typography>
                        </Box>
                        <Box sx={{ width: "50%", }}>
                            <CustomInput
                                type="text"
                                size="sm"
                                value={uhiddata}
                                disable={true}
                            />
                        </Box>
                    </Box>
                    <Box sx={{
                        width: "80%", display: "flex", flexDirection: 'row', justifyContent: "center", pt: 1
                    }}>
                        <Box sx={{ width: "50%", pt: 0.5, pl: 10 }}>
                            <Typography sx={{ fontSize: 16, fontFamily: 'sans-serif', fontWeight: 525 }} >Salutation</Typography>
                        </Box>
                        <Box sx={{ width: "50%", }}>
                            <SalutationDropDown salutn={salutn} setSalutn={setSalutn} />
                        </Box>
                    </Box>
                    <Box sx={{
                        width: "80%", display: "flex", flexDirection: 'row', justifyContent: "center", pt: 1
                    }}>
                        <Box sx={{ width: "50%", pt: 0.5, pl: 10 }}>
                            <Typography sx={{ fontSize: 16, fontFamily: 'sans-serif', fontWeight: 525 }} >Patient Name</Typography>
                        </Box>
                        <Box sx={{ width: "50%", }}>
                            <CustomInput placeholder={'Enter Patient Name'}
                                type="text"
                                size="sm"
                                name="patient_name"
                                value={patient_name}
                                handleChange={updateregistrationState} />
                        </Box>
                    </Box>
                    <Box sx={{
                        width: "80%", display: "flex", flexDirection: 'row', justifyContent: "center", pt: 1
                    }}>
                        <Box sx={{ width: "50%", pt: 0.5, pl: 10 }}>
                            <Typography sx={{ fontSize: 16, fontFamily: 'sans-serif', fontWeight: 525 }} >Address</Typography>
                        </Box>
                        <Box sx={{ width: "50%", }}>
                            <CustomInput placeholder={"Enter Address"}
                                type="text"
                                size="sm"
                                name="patient_address"
                                value={patient_address}
                                handleChange={updateregistrationState} />
                        </Box>
                    </Box>
                    <Box sx={{
                        width: "80%", display: "flex", flexDirection: 'row', justifyContent: "center", pt: 1
                    }}>
                        <Box sx={{ width: "50%", pt: 0.5, pl: 10 }}>
                            <Typography sx={{ fontSize: 16, fontFamily: 'sans-serif', fontWeight: 525 }} >Place / Region</Typography>
                        </Box>
                        <Box sx={{ width: "50%", }}>
                            <CustomInput placeholder={"Enter Region / Place"}
                                type="text"
                                size="sm"
                                name="patient_place"
                                value={patient_place}
                                handleChange={updateregistrationState} />
                        </Box>
                    </Box>

                    <Box sx={{
                        width: "80%", display: "flex", flexDirection: 'row', justifyContent: "center", pt: 1
                    }}>
                        <Box sx={{ width: "50%", pt: 0.5, pl: 10 }}>
                            <Typography sx={{ fontSize: 16, fontFamily: 'sans-serif', fontWeight: 525 }} >Pincode</Typography>
                        </Box>
                        <Box sx={{ width: "50%", }}>
                            <CustomInput placeholder={"Enter Pincode"}
                                type="number"
                                size="sm"
                                name="patient_pincode"
                                value={patient_pincode}
                                handleChange={updateregistrationState} />
                        </Box>
                    </Box>

                    <Box sx={{
                        width: "80%", display: "flex", flexDirection: 'row', justifyContent: "center", pt: 1
                    }}>
                        <Box sx={{ width: "50%", pt: 0.5, pl: 10 }}>
                            <Typography sx={{ fontSize: 16, fontFamily: 'sans-serif', fontWeight: 525 }} >District</Typography>
                        </Box>
                        <Box sx={{ width: "50%", }}>
                            <CustomInput placeholder={"Enter District"}
                                type="text"
                                size="sm"
                                name="patient_district"
                                value={patient_district}
                                handleChange={updateregistrationState} />
                        </Box>
                    </Box>

                    <Box sx={{
                        width: "80%", display: "flex", flexDirection: 'row', justifyContent: "center", pt: 1
                    }}>
                        <Box sx={{ width: "50%", pt: 0.5, pl: 10 }}>
                            <Typography sx={{ fontSize: 16, fontFamily: 'sans-serif', fontWeight: 525 }} >Mobile</Typography>
                        </Box>
                        <Box sx={{ width: "50%", }}>
                            <CustomInput placeholder={"Enter Mobile"}
                                type="number"
                                size="sm"
                                name="patient_mobile"
                                value={patient_mobile}
                                handleChange={updateregistrationState} />
                        </Box>
                    </Box>

                    <Box sx={{
                        width: "80%", display: "flex", flexDirection: 'row', justifyContent: "center", pt: 1
                    }}>
                        <Box sx={{ width: "50%", pt: 0.5, pl: 10 }}>
                            <Typography sx={{ fontSize: 16, fontFamily: 'sans-serif', fontWeight: 525 }} >Date Of Birth</Typography>
                        </Box>
                        <Box sx={{ width: "50%", }}>
                            <CustomInput
                                type="date"
                                size="sm"
                                name="patient_dob"
                                value={patient_dob}
                                handleChange={updatepatient_dob}
                            />
                        </Box>
                    </Box>
                    <Box sx={{
                        width: "80%", display: "flex", flexDirection: 'row', justifyContent: "center", pt: 1
                    }}>
                        <Box sx={{ width: "50%", pt: 0.5, pl: 10 }}>
                            <Typography sx={{ fontSize: 16, fontFamily: 'sans-serif', fontWeight: 525 }} >Age</Typography>
                        </Box>
                        <Box sx={{ width: "50%", display: "flex", flexDirection: 'row', }}>
                            <Box className="flex text-[#75abe2] border-[#75abe2] flex-grow justify-center font-thin text-xs" >Age</Box>
                            <Box className="flex text-[#75abe2] border-[#75abe2] flex-grow justify-center border rounded-lg p-1" >{patient_age}</Box>
                            <Box className="flex text-[#75abe2] border-[#75abe2] flex-grow justify-center font-thin text-xs" >Months</Box>
                            <Box className="flex text-[#75abe2] border-[#75abe2] flex-grow justify-center border rounded-lg p-1" >{patient_month}</Box>
                            <Box className="flex text-[#75abe2] border-[#75abe2] flex-grow justify-center font-thin text-xs" >Days</Box>
                            <Box className="flex text-[#75abe2] border-[#75abe2] flex-grow justify-center border rounded-lg p-1" >{patient_day}</Box>
                        </Box>
                    </Box>

                    <Box sx={{
                        width: "80%", display: "flex", flexDirection: 'row', justifyContent: "center", pt: 1
                    }}>
                        <Box sx={{ width: "50%", pt: 0.5, pl: 10 }}>
                            <Typography sx={{ fontSize: 16, fontFamily: 'sans-serif', fontWeight: 525 }} >Place / Region</Typography>
                        </Box>
                        <Box sx={{ width: "50%", }}>
                            <CustomInput placeholder={"Enter Old UHID"}
                                type="text"
                                size="sm"
                                name="old_uhid"
                                value={old_uhid}
                                handleChange={updateregistrationState} />
                        </Box>
                    </Box>

                    <Box sx={{
                        width: "100%", display: "flex", flexDirection: 'row', justifyContent: "center", pt: 1
                    }}>
                        <Box sx={{ width: "40%", pt: 0.5, pl: 10 }}>
                            <Typography sx={{ fontSize: 16, fontFamily: 'sans-serif', fontWeight: 525 }} >Mode of Payment</Typography>
                        </Box>
                        <Box sx={{ width: "60%", }}>
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


                </Paper>
                <Box sx={{
                    width: "100%", display: "flex", flexDirection: 'row', justifyContent: "center", pt: 1
                }}>
                    <Box sx={{ width: "40%", pt: 0.5, display: "flex", flexDirection: 'column', pr: 1 }}>
                        <Typography sx={{ fontSize: 16, fontFamily: 'sans-serif', fontWeight: 525 }} >Speciality</Typography>

                        <CustomInput
                            type="text"
                            size="sm"
                            value={speciality_name}
                            disable={true}
                        />
                    </Box>
                    <Box sx={{ width: "40%", pt: 0.5, display: "flex", flexDirection: 'column', pr: 1 }}>
                        <Typography sx={{ fontSize: 16, fontFamily: 'sans-serif', fontWeight: 525 }} >Doctor</Typography>

                        <CustomInput
                            type="text"
                            size="sm"
                            value={doctor_name}
                            disable={true}
                        />

                    </Box>

                    <Box sx={{ width: "20%", pt: 0.5, display: "flex", flexDirection: 'column', }}>
                        <Typography sx={{ fontSize: 16, fontFamily: 'sans-serif', fontWeight: 525 }} >Token No</Typography>

                        <CustomInput
                            type="text"
                            size="sm"
                            value={token_no}
                            disable={true}
                        />

                    </Box>

                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={SaveAppoinmentNewReg} color="secondary" >Save</Button>
                <Button onClick={modalcolse} color="secondary" >Close</Button>
            </DialogActions>
        </Dialog>
    )
}

export default memo(NewRegAppinmentModal)
import React, { useCallback, memo, useState, useMemo, Fragment } from 'react'
import { Box } from '@mui/joy'
import { Paper } from '@mui/material'
import Typography from '@mui/joy/Typography'
import CustomInput from '../../../Components/CustomInput'
import SpecialityDropDown from '../../../Components/SpecialityDropDown'
import CusCheckbox from '../../../Components/CusCheckbox'
import Button from '@mui/material/Button';
import { axioslogin } from '../../../AxiosConfig/Axios'
import { ToastContainer } from 'react-toastify'
import { succesNotify, warningNotify } from '../../../Components/CommonCode'
import DoctorMastTable from './DoctorMastTable'
import { useNavigate } from 'react-router-dom'
const Doctor = () => {
    const navigate = useNavigate()
    const [speciality, setspeciality] = useState(0)
    const [docmaster, setDocmaster] = useState({
        doctor_name: '',
        doctor_status: '',
        doctor_fee: '',
        doctor_token_start: '',
        doctor_token_end: '',
        doctor_renewal_day: '',
        doctor_slno: ''

    })
    //Destructuring
    const { doctor_name, doctor_status, doctor_fee, doctor_token_start, doctor_token_end, doctor_renewal_day, doctor_slno } = docmaster
    const updateDocMaster = useCallback((e) => {
        const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
        setDocmaster({ ...docmaster, [e.target.name]: value })
    }, [docmaster])


    const postData = useMemo(() => {
        return {
            doctor_name: doctor_name,
            doctor_spectiality: speciality === 0 ? null : speciality,
            doctor_fee: doctor_fee,
            doctor_token_start: doctor_token_start,
            doctor_token_end: doctor_token_end,
            doctor_renewal_day: doctor_renewal_day,
            doctor_status: doctor_status
        }
    }, [doctor_name, speciality, doctor_fee, doctor_token_start, doctor_token_end, doctor_renewal_day, doctor_status])


    const patchdata = useMemo(() => {
        return {
            doctor_name: doctor_name,
            doctor_spectiality: speciality === 0 ? null : speciality,
            doctor_fee: doctor_fee,
            doctor_token_start: doctor_token_start,
            doctor_token_end: doctor_token_end,
            doctor_renewal_day: doctor_renewal_day,
            doctor_status: doctor_status,
            doctor_slno: doctor_slno
        }
    }, [doctor_name, speciality, doctor_fee, doctor_token_start, doctor_token_end, doctor_renewal_day, doctor_status, doctor_slno])


    const reset = useCallback(() => {
        const resetfrm = {
            doctor_name: '',
            doctor_status: '',
            doctor_fee: '',
            doctor_token_start: '',
            doctor_token_end: '',
            doctor_renewal_day: '',
            doctor_slno: ''
        }
        setDocmaster(resetfrm)
        setspeciality(0)
    }, [])
    const submit = useCallback(() => {

        const InsertFun = async (postData) => {
            const result = await axioslogin.post('/DoctorMaster', postData);
            const { success, message } = result.data

            if (success === 1) {
                reset()
                succesNotify(message)
            } else {
                warningNotify(message)
            }
        }

        const updateDoctorMAst = async (patchdata) => {
            const result = await axioslogin.patch('/DoctorMaster', patchdata);
            const { success, message } = result.data
            if (success === 1) {
                reset()
                succesNotify(message)
            } else {
                warningNotify(message)
            }
        }


        if (doctor_name !== '') {
            if (editFlag === 2) {
                updateDoctorMAst(patchdata)
            } else {
                InsertFun(postData)
            }

        } else {
            warningNotify("Please enter doctor Name")
        }

    }, [postData, doctor_name, patchdata])

    const [editFlag, setEditFlag] = useState(0)
    const viewdata = useCallback(() => {
        setEditFlag(1)
    }, [])

    const rowSelect = useCallback((value) => {
        setEditFlag(2)
        const { doctor_slno, doctor_name, doctor_spectiality, doctor_status, doctor_fee, doctor_token_start, doctor_token_end,
            doctor_renewal_day, } = value
        const resetfrm = {
            doctor_name: doctor_name,
            doctor_status: doctor_status === 1 ? true : false,
            doctor_fee: doctor_fee,
            doctor_token_start: doctor_token_start,
            doctor_token_end: doctor_token_end,
            doctor_renewal_day: doctor_renewal_day,
            doctor_slno: doctor_slno
        }
        setDocmaster(resetfrm)
        setspeciality(doctor_spectiality)
    }, [])
    const CloseFnctn = useCallback(() => {
        setEditFlag(0)
    }, [])
    const CloseMAster = useCallback(() => {
        navigate('/Home')
    }, [])
    return (
        <Fragment>

            <ToastContainer />
            {editFlag === 1 ? <DoctorMastTable rowSelect={rowSelect} CloseFnctn={CloseFnctn} /> :
                <Paper className='w-full flex flex-1 flex-col m-5 p-2  items-center justify-center gap-1 ' >
                    <Box sx={{ width: '100%', display: 'flex', justifyContent: "center" }}>
                        <Typography level='body-md' fontWeight='lg' sx={{ pb: 2 }} >Doctor Master</Typography>
                    </Box>
                    <Box className="flex justify-center items-center w-3/4">
                        <Box className="flex-1 ml-2 " >
                            <Typography level='body-md' fontWeight='lg' >Doctor Name</Typography>
                        </Box>
                        <Box className="flex-1" >
                            <CustomInput placeholder={'Enter Doctor Name'}
                                type="text"
                                size="sm"
                                name="doctor_name"
                                value={doctor_name}
                                handleChange={updateDocMaster}

                            />
                        </Box>
                    </Box>
                    <Box className="flex justify-center items-center w-3/4">
                        <Box className="flex-1 ml-2 " >
                            <Typography level='body-md' fontWeight='lg' >Salutation</Typography>
                        </Box>
                        <Box className="flex-1" >
                            <SpecialityDropDown speciality={speciality} setspeciality={setspeciality} />
                        </Box>
                    </Box>
                    <Box className="flex justify-center items-center w-3/4">
                        <Box className="flex-1 ml-2 " >
                            <Typography level='body-md' fontWeight='lg' >Doctor Fee</Typography>
                        </Box>
                        <Box className="flex-1" >
                            <CustomInput placeholder={'Enter Doctor Fee'}
                                type="text"
                                size="sm"
                                name="doctor_fee"
                                value={doctor_fee}
                                handleChange={updateDocMaster}

                            />
                        </Box>
                    </Box>
                    <Box className="flex justify-center items-center w-3/4">
                        <Box className="flex-1 ml-2 " >
                            <Typography level='body-md' fontWeight='lg' >Token Start</Typography>
                        </Box>
                        <Box className="flex-1" >
                            <CustomInput placeholder={'Enter Token Start'}
                                type="text"
                                size="sm"
                                name="doctor_token_start"
                                value={doctor_token_start}
                                handleChange={updateDocMaster}

                            />
                        </Box>
                    </Box>
                    <Box className="flex justify-center items-center w-3/4">
                        <Box className="flex-1 ml-2 " >
                            <Typography level='body-md' fontWeight='lg' >Token End </Typography>
                        </Box>
                        <Box className="flex-1" >
                            <CustomInput placeholder={'Enter Token End'}
                                type="text"
                                size="sm"
                                name="doctor_token_end"
                                value={doctor_token_end}
                                handleChange={updateDocMaster}

                            />
                        </Box>
                    </Box>
                    <Box className="flex justify-center items-center w-3/4">
                        <Box className="flex-1 ml-2 " >
                            <Typography level='body-md' fontWeight='lg' >Renewal Day</Typography>
                        </Box>
                        <Box className="flex-1" >
                            <CustomInput placeholder={'Enter Renewal Day'}
                                type="text"
                                size="sm"
                                name="doctor_renewal_day"
                                value={doctor_renewal_day}
                                handleChange={updateDocMaster}

                            />
                        </Box>
                    </Box>

                    <Box className="flex justify-center items-center w-3/4">
                        <Box className="flex-1 ml-2 " >
                            <Typography level='body-md' fontWeight='lg' >Doctor Status</Typography>
                        </Box>
                        <Box className="flex-1 ml-2 " >
                            <CusCheckbox
                                // label="Status"
                                color="primary"
                                size="md"
                                fontWeight='lg'
                                name="doctor_status"
                                value={doctor_status}
                                checked={doctor_status}
                                onCheked={updateDocMaster}

                            ></CusCheckbox>
                        </Box>
                    </Box>
                    <Box className="flex justify-center items-center w-3/4">
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

export default memo(Doctor)
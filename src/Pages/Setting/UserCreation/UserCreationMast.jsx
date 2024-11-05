import React, { useCallback, memo, useState, useMemo, useEffect } from 'react'
import { Box } from '@mui/joy'
import { Paper } from '@mui/material'
import Typography from '@mui/joy/Typography'
import CustomInput from '../../../Components/CustomInput'
import Button from '@mui/material/Button';
import { axioslogin } from '../../../AxiosConfig/Axios'
import { ToastContainer } from 'react-toastify'
import { succesNotify, warningNotify } from '../../../Components/CommonCode'
import { useNavigate } from 'react-router-dom'
import UserGroupSelect from './UserGroupSelect'
import CusCheckbox from '../../../Components/CusCheckbox'
import UserCreationTable from './UserCreationTable'

const UserCreationMast = () => {
    const navigate = useNavigate()
    const [idno, setIdNo] = useState(0)
    const [userCreation, setuserCreation] = useState({
        usc_first_name: '',
        usc_second_name: '',
        usc_address: '',
        usc_active: false,
        usc_mobileno: '',
        usc_code: ''
    })
    //Destructuring
    const { usc_first_name, usc_second_name, usc_address, usc_active, usc_mobileno, usc_code } = userCreation
    const updateUserCreation = useCallback((e) => {
        const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
        setuserCreation({ ...userCreation, [e.target.name]: value })
    }, [userCreation])
    const [usc_dob, setusc_dob] = useState('')
    const [usc_doj, setusc_doj] = useState('')
    const [userGroup, setUserGroup] = useState(0)
    const updateusc_dob = useCallback((e) => {
        setusc_dob(e.target.value)
    })
    const updateusc_doj = useCallback((e) => {
        setusc_doj(e.target.value)
    })

    useEffect(() => {
        const getEmpId = async () => {
            const result = await axioslogin.get('/login/emp/Serialno')
            const { success, message, data } = result.data
            if (success === 2) {
                const { patient_no } = data[0]
                setIdNo(patient_no.toString());
            } else {
                warningNotify(message)
            }
        }
        getEmpId()
    }, [])
    const [editFlag, setEditFlag] = useState(0)

    const postData = useMemo(() => {
        return {
            usc_first_name: usc_first_name,
            usc_second_name: usc_second_name,
            usc_address: usc_address,
            usc_name: idno,
            usc_pass: idno,
            us_code: idno,
            usc_mobileno: usc_mobileno,
            usc_dob: usc_dob,
            usc_active: usc_active === true ? 1 : 0,
            usc_alias: idno,
            user_group_id: userGroup,
            usc_doj: usc_doj
        }
    }, [usc_first_name, usc_second_name, usc_address, usc_active, usc_mobileno, usc_dob,
        usc_doj, userGroup, idno, usc_active])

    const patchdata = useMemo(() => {
        return {
            usc_first_name: usc_first_name,
            usc_second_name: usc_second_name,
            usc_address: usc_address,
            usc_name: idno,
            usc_pass: idno,
            us_code: idno,
            usc_mobileno: usc_mobileno,
            usc_dob: usc_dob,
            usc_active: usc_active === true ? 1 : 0,
            usc_alias: idno,
            user_group_id: userGroup,
            usc_doj: usc_doj,
            us_code: idno
        }
    }, [usc_first_name, usc_second_name, usc_address, usc_active, usc_mobileno, usc_dob,
        usc_doj, userGroup, idno, usc_active])

    const reset = useCallback(() => {
        const frmreset = {
            usc_first_name: '',
            usc_second_name: '',
            usc_address: '',
            usc_active: false,
            usc_mobileno: ''
        }
        setuserCreation(frmreset)
        setusc_dob('')
        setusc_doj('')
        setUserGroup(0)

        const getEmpId = async () => {
            const result = await axioslogin.get('/login/emp/Serialno')
            const { success, message, data } = result.data
            if (success === 2) {
                const { patient_no } = data[0]
                setIdNo(patient_no.toString());
            } else {
                warningNotify(message)
            }
        }
        getEmpId()

    }, [])
    const submit = useCallback(() => {
        const insertFunctn = async (postData) => {
            const result = await axioslogin.post('/login/insert', postData);
            const { success, message } = result.data
            if (success === 1) {
                succesNotify(message)
                reset()
            } else {
                warningNotify(message)
            }
        }
        const updateuserMAst = async (patchdata) => {
            const result = await axioslogin.patch('/login/update', patchdata);
            const { success, message } = result.data
            if (success === 1) {
                reset()
                succesNotify(message)
            } else {
                warningNotify(message)
            }
        }

        if (editFlag === 2) {
            updateuserMAst(patchdata)
        } else {
            insertFunctn(postData)
        }

    }, [postData, editFlag])

    const CloseMAster = useCallback(() => {
        navigate('/Home')
    }, [])


    const viewdata = useCallback(() => {
        setEditFlag(1)
    }, [])

    const rowSelect = useCallback((value) => {
        setEditFlag(2)
        const { us_code, usc_first_name, usc_second_name, usc_address, status1, usc_mobileno,
            usc_dob, usc_doj, user_group_id, usc_active
        } = value
        const resetfrm = {
            usc_first_name: usc_first_name,
            usc_second_name: usc_second_name,
            usc_address: usc_address,
            usc_active: usc_active === 1 ? true : false,
            usc_mobileno: usc_mobileno,
            usc_code: us_code
        }
        setuserCreation(resetfrm)
        setusc_dob(usc_dob)
        setusc_doj(usc_doj)
        setUserGroup(user_group_id)
        setIdNo(us_code)
    }, [])
    const CloseFnctn = useCallback(() => {
        setEditFlag(0)
    }, [])


    return (
        <Box sx={{ width: "100%", p: 5 }}>
            <ToastContainer />
            {editFlag === 1 ? <UserCreationTable rowSelect={rowSelect} CloseFnctn={CloseFnctn} /> :
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
                            <Typography level='body-md' fontWeight='lg' >User Creation</Typography>
                        </Box>

                        <Box sx={{ width: '80%', display: 'flex', pt: 2.5, margin: 'auto ', pl: 10, flexDirection: "column" }}>


                            <Box sx={{ width: "100%", display: 'flex', flexDirection: "row", }}>
                                <Box sx={{ width: "10%", pt: 0.5, pl: 1 }}>
                                    <Typography sx={{ fontSize: 13, fontFamily: 'sans-serif', fontWeight: 550 }} >User Id</Typography>
                                </Box>
                                <Box sx={{ width: "15%", pt: 0.5, }}>
                                    <CustomInput
                                        type="text"
                                        size="sm"
                                        name="idno"
                                        value={idno}
                                        disable={true}
                                    />

                                    {/* <SalutationDropDown salutn={salutn} setSalutn={setSalutn} /> */}
                                </Box>
                                <Box sx={{ width: "10%", pt: 0.5, pl: 1 }}>
                                    <Typography sx={{ fontSize: 13, fontFamily: 'sans-serif', fontWeight: 550 }} >First Name</Typography>
                                </Box>
                                <Box sx={{ width: "30%", pr: 1 }}>
                                    <CustomInput
                                        type="text"
                                        size="sm"
                                        name="usc_first_name"
                                        value={usc_first_name}
                                        handleChange={updateUserCreation}
                                    />
                                </Box>
                                <Box sx={{ width: "10%", pl: 1, pt: 0.5 }}>
                                    <Typography sx={{ fontSize: 13, fontFamily: 'sans-serif', fontWeight: 550 }} >Second Name</Typography>
                                </Box>
                                <Box sx={{ width: "25%", }}>
                                    <CustomInput
                                        type="text"
                                        size="sm"
                                        name="usc_second_name"
                                        value={usc_second_name}
                                        handleChange={updateUserCreation}
                                    />
                                </Box>
                            </Box>
                            <Box sx={{ width: "100%", display: 'flex', flexDirection: "row", }}>

                                <Box sx={{ width: "10%", pt: 0.5, pl: 1 }}>
                                    <Typography sx={{ fontSize: 13, fontFamily: 'sans-serif', fontWeight: 550 }} >Address</Typography>
                                </Box>
                                <Box sx={{ width: "55%", pt: 0.5, }}>
                                    <CustomInput
                                        type="text"
                                        size="sm"
                                        name="usc_address"
                                        value={usc_address}
                                        handleChange={updateUserCreation}
                                    />
                                </Box>
                                <Box sx={{ width: "10%", pt: 0.5, pl: 1 }}>
                                    <Typography sx={{ fontSize: 13, fontFamily: 'sans-serif', fontWeight: 550 }} >Mobile No</Typography>
                                </Box>
                                <Box sx={{ width: "25%", pt: 0.5, }}>
                                    <CustomInput
                                        type="text"
                                        size="sm"
                                        name="usc_mobileno"
                                        value={usc_mobileno}
                                        handleChange={updateUserCreation}
                                    />
                                </Box>
                            </Box>

                            <Box sx={{ width: "100%", display: 'flex', flexDirection: "row", }}>

                                <Box sx={{ width: "10%", pt: 0.5, pl: 1 }}>
                                    <Typography sx={{ fontSize: 13, fontFamily: 'sans-serif', fontWeight: 550 }} >DOB</Typography>
                                </Box>
                                <Box sx={{ width: "15%", pt: 0.5, pl: 0.5 }}>
                                    <CustomInput
                                        type="date"
                                        size="sm"
                                        name="usc_dob"
                                        value={usc_dob}
                                        handleChange={updateusc_dob}
                                    />
                                </Box>
                                <Box sx={{ width: "10%", pt: 1, pl: 2 }}>
                                    <Typography sx={{ fontSize: 13, fontFamily: 'sans-serif', fontWeight: 550 }} >DOJ</Typography>
                                </Box>
                                <Box sx={{ width: "15%", pt: 1, }}>
                                    <CustomInput
                                        type="date"
                                        size="sm"
                                        name="usc_doj"
                                        value={usc_doj}
                                        handleChange={updateusc_doj}
                                    />
                                </Box>
                                <Box sx={{ width: "10%", pl: 2, pt: 1.5 }}>
                                    <Typography sx={{ fontSize: 13, fontFamily: 'sans-serif', fontWeight: 550 }} >User Group</Typography>
                                </Box>
                                <Box sx={{ width: "20%", pl: 0.7, pt: 1.5 }}>
                                    <UserGroupSelect userGroup={userGroup} setUserGroup={setUserGroup} />
                                </Box>
                                <Box sx={{ width: "10%", pl: 2, pt: 2 }}>
                                    <CusCheckbox
                                        label="Status"
                                        color="primary"
                                        size="md"
                                        fontWeight='lg'
                                        name="usc_active"
                                        value={usc_active}
                                        checked={usc_active}
                                        onCheked={updateUserCreation}
                                    ></CusCheckbox>
                                </Box>

                                {/* <Box sx={{ width: "20%", pt: 1, }}>
                                <CustomInput
                                    type={showPassword ? 'text' : 'password'}
                                    size="sm"
                                    name="idno"
                                    value={idno}
                                    disable={true}
                                />
                            </Box> */}
                                {/* <Box
                                sx={{ height: 50, width: "3%", pt: 0.5 }}>
                                <IconButton
                                    aria-label="toggle password visibility"
                                    onClick={handleClickShowPassword}
                                    onMouseDown={handleMouseDownPassword}
                                    edge="end"
                                >
                                    {showPassword ? <VisibilityOff /> : <Visibility />}
                                </IconButton>
                            </Box> */}
                            </Box>
                        </Box>

                        <Box className="flex justify-center items-center w-4/4" sx={{ pt: 2, pb: 2 }}>
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



                    </Box>
                </Paper>

            }
        </Box>
    )
}

export default memo(UserCreationMast)
import React, { useCallback, memo, useState, useMemo, Fragment } from 'react'
import { Box } from '@mui/joy'
import { Paper } from '@mui/material'
import Typography from '@mui/joy/Typography'
import CustomInput from '../../../Components/CustomInput'
import CusCheckbox from '../../../Components/CusCheckbox'
import Button from '@mui/material/Button';
import { axioslogin } from '../../../AxiosConfig/Axios'
import { ToastContainer } from 'react-toastify'
import { succesNotify, warningNotify } from '../../../Components/CommonCode'
import ProcedurMastTable from './ProcedurMastTable'
import { useNavigate } from 'react-router-dom'
import ProcedureCatgryDropDown from '../../../Components/ProcedureCatgryDropDown'

const ProcedureMaster = () => {
    const navigate = useNavigate()
    const [procedureMast, setProcedureMast] = useState({
        procedure_name: '',
        procedure_code: '',
        procedure_rate: '',
        procedure_status: false,
        procedure_slno: ''
    })
    //Destructuring
    const { procedure_name, procedure_code, procedure_rate, procedure_status, procedure_slno } = procedureMast
    const updateProcedrMaster = useCallback((e) => {
        const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
        setProcedureMast({ ...procedureMast, [e.target.name]: value })
    }, [procedureMast])

    const [procedure_catgry_slno, setprocedure_catgry_slno] = useState(0)
    const postData = useMemo(() => {
        return {
            procedure_name: procedure_name,
            procedure_code: procedure_code,
            procedure_rate: procedure_rate,
            procedure_status: procedure_status === false ? 0 : 1,
            procedure_catgry_slno: procedure_catgry_slno
        }
    }, [procedure_name, procedure_code, procedure_rate, procedure_status, procedure_catgry_slno])


    const patchdata = useMemo(() => {
        return {
            procedure_name: procedure_name,
            procedure_code: procedure_code,
            procedure_rate: procedure_rate,
            procedure_status: procedure_status === false ? 0 : 1,
            procedure_catgry_slno: procedure_catgry_slno,
            procedure_slno: procedure_slno
        }
    }, [procedure_name, procedure_code, procedure_rate, procedure_status, procedure_slno, procedure_catgry_slno])


    const reset = useCallback(() => {
        const resetfrm = {
            procedure_name: '',
            procedure_code: '',
            procedure_rate: '',
            procedure_status: '',
            procedure_catgry_slno: '',
            procedure_slno: ''
        }
        setProcedureMast(resetfrm)
        setprocedure_catgry_slno(0)
    }, [])
    const submit = useCallback(() => {

        const InsertFun = async (postData) => {
            const result = await axioslogin.post('/ProcedurMaster', postData);
            const { success, message } = result.data

            if (success === 1) {
                reset()
                succesNotify(message)
            } else {
                warningNotify(message)
            }
        }

        const updateDoctorMAst = async (patchdata) => {
            const result = await axioslogin.patch('/ProcedurMaster', patchdata);
            const { success, message } = result.data
            if (success === 1) {
                reset()
                succesNotify(message)
            } else {
                warningNotify(message)
            }
        }


        if (procedure_name !== '') {
            if (procedure_rate !== '') {
                if (editFlag === 2) {
                    updateDoctorMAst(patchdata)
                } else {
                    InsertFun(postData)
                }
            } else {
                warningNotify("Please Enter procedure Rate")
            }

        } else {
            warningNotify("Please Enter procedure Name")
        }

    }, [postData, procedure_name, patchdata])

    const [editFlag, setEditFlag] = useState(0)
    const viewdata = useCallback(() => {
        setEditFlag(1)
    }, [])

    const rowSelect = useCallback((value) => {
        setEditFlag(2)
        const { procedure_name, procedure_rate, procedure_status, procedure_code, procedure_slno, procedure_catgry_slno } = value
        const resetfrm = {
            procedure_name: procedure_name,
            procedure_rate: procedure_rate,
            procedure_code: procedure_code,
            procedure_status: procedure_status === 1 ? true : false,
            procedure_slno: procedure_slno
        }
        setProcedureMast(resetfrm)
        setprocedure_catgry_slno(procedure_catgry_slno)
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
            {editFlag === 1 ? <ProcedurMastTable rowSelect={rowSelect} CloseFnctn={CloseFnctn} /> :
                <Paper className='w-full flex flex-1 flex-col m-5 p-2  items-center justify-center gap-1 ' >
                    <Box sx={{ width: '100%', display: 'flex', justifyContent: "center" }}>
                        <Typography level='body-md' fontWeight='lg' sx={{ pb: 2 }} >Procedure Master</Typography>
                    </Box>
                    <Box className="flex justify-center items-center w-3/4">
                        <Box className="flex-1 ml-2 " >
                            <Typography level='body-md' fontWeight='lg' >Procedure Name</Typography>
                        </Box>
                        <Box className="flex-1" >
                            <CustomInput placeholder={'Enter Procedure Name'}
                                type="text"
                                size="sm"
                                name="procedure_name"
                                value={procedure_name}
                                handleChange={updateProcedrMaster}

                            />
                        </Box>
                    </Box>
                    <Box className="flex justify-center items-center w-3/4">
                        <Box className="flex-1 ml-2 " >
                            <Typography level='body-md' fontWeight='lg' >Procedure Code</Typography>
                        </Box>
                        <Box className="flex-1" >
                            <CustomInput placeholder={'Enter Procedure Code'}
                                type="text"
                                size="sm"
                                name="procedure_code"
                                value={procedure_code}
                                handleChange={updateProcedrMaster}

                            />
                        </Box>
                    </Box>
                    <Box className="flex justify-center items-center w-3/4">
                        <Box className="flex-1 ml-2 " >
                            <Typography level='body-md' fontWeight='lg' >Procedure Category</Typography>
                        </Box>
                        <Box className="flex-1" >
                            <ProcedureCatgryDropDown procedure_catgry_slno={procedure_catgry_slno} setprocedure_catgry_slno={setprocedure_catgry_slno} />
                        </Box>
                    </Box>
                    <Box className="flex justify-center items-center w-3/4">
                        <Box className="flex-1 ml-2 " >
                            <Typography level='body-md' fontWeight='lg' >Procedure Rate</Typography>
                        </Box>
                        <Box className="flex-1" >
                            <CustomInput placeholder={'Enter Procedure Rate'}
                                type="text"
                                size="sm"
                                name="procedure_rate"
                                value={procedure_rate}
                                handleChange={updateProcedrMaster}
                            />
                        </Box>
                    </Box>

                    <Box className="flex justify-center items-center w-3/4">
                        <Box className="flex-1 ml-2 " >
                            <Typography level='body-md' fontWeight='lg' >Procedure Status</Typography>
                        </Box>
                        <Box className="flex-1 ml-2 " >
                            <CusCheckbox
                                color="primary"
                                size="md"
                                fontWeight='lg'
                                name="procedure_status"
                                value={procedure_status}
                                checked={procedure_status}
                                onCheked={updateProcedrMaster}
                            ></CusCheckbox>
                        </Box>
                    </Box>
                    <Box className="flex justify-center items-center w-3/4">
                        <Box sx={{ pl: 2 }}>
                            <Button color="primary" variant="contained" onClick={submit} >Save</Button>
                        </Box>
                        <Box sx={{ pl: 2 }}>
                            <Button color="primary" variant="contained" onClick={viewdata}>View</Button>
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

export default memo(ProcedureMaster)
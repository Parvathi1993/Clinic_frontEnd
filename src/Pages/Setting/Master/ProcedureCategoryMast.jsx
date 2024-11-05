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
import { useNavigate } from 'react-router-dom'
import ProcedureCatgryMastTable from './ProcedureCatgryMastTable'

const ProcedureCategoryMast = () => {

    const navigate = useNavigate()
    const [procedureCatMast, setProcedureCatMast] = useState({
        procedure_catgry_name: '',
        procedure_catgry_status: false,
        procedure_catgry_slno: ''
    })
    //Destructuring
    const { procedure_catgry_name, procedure_catgry_status, procedure_catgry_slno } = procedureCatMast
    const updateProcedrcatMaster = useCallback((e) => {
        const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
        setProcedureCatMast({ ...procedureCatMast, [e.target.name]: value })
    }, [procedureCatMast])


    const postData = useMemo(() => {
        return {
            procedure_catgry_name: procedure_catgry_name,
            procedure_catgry_status: procedure_catgry_status === false ? 0 : 1
        }
    }, [procedure_catgry_name, procedure_catgry_status])


    const patchdata = useMemo(() => {
        return {
            procedure_catgry_name: procedure_catgry_name,
            procedure_catgry_status: procedure_catgry_status === false ? 0 : 1,
            procedure_catgry_slno: procedure_catgry_slno
        }
    }, [procedure_catgry_name, procedure_catgry_status, procedure_catgry_slno])


    const reset = useCallback(() => {
        const resetfrm = {
            procedure_catgry_name: '',
            procedure_catgry_status: '',
            procedure_catgry_slno: ''
        }
        setProcedureCatMast(resetfrm)
    }, [])

    const submit = useCallback(() => {

        const InsertFun = async (postData) => {
            const result = await axioslogin.post('/ProcedurCatMaster', postData);
            const { success, message } = result.data

            if (success === 1) {
                reset()
                succesNotify(message)
            } else {
                warningNotify(message)
            }
        }

        const updateDoctorMAst = async (patchdata) => {
            const result = await axioslogin.patch('/ProcedurCatMaster', patchdata);
            const { success, message } = result.data
            if (success === 1) {
                reset()
                succesNotify(message)
            } else {
                warningNotify(message)
            }
        }


        if (procedure_catgry_name !== '') {
            if (editFlag === 2) {
                updateDoctorMAst(patchdata)
            } else {
                InsertFun(postData)
            }
        } else {
            warningNotify("Please Enter procedure Name")
        }

    }, [postData, procedure_catgry_name, patchdata])

    const [editFlag, setEditFlag] = useState(0)
    const viewdata = useCallback(() => {
        setEditFlag(1)
    }, [])

    const rowSelect = useCallback((value) => {
        setEditFlag(2)
        const { procedure_catgry_name, procedure_catgry_status, procedure_catgry_slno } = value
        const resetfrm = {
            procedure_catgry_name: procedure_catgry_name,
            procedure_catgry_status: procedure_catgry_status === 1 ? true : false,
            procedure_catgry_slno: procedure_catgry_slno
        }
        setProcedureCatMast(resetfrm)

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
            {editFlag === 1 ? <ProcedureCatgryMastTable rowSelect={rowSelect} CloseMAster={CloseFnctn} /> :
                <Paper className='w-full flex flex-1 flex-col m-5 p-2  items-center justify-center gap-1 ' >
                    <Box sx={{ width: '100%', display: 'flex', justifyContent: "center" }}>
                        <Typography level='body-md' fontWeight='lg' sx={{ pb: 2 }} >Procedure Category Master</Typography>
                    </Box>
                    <Box className="flex justify-center items-center w-3/4">
                        <Box className="flex-1 ml-2 " >
                            <Typography level='body-md' fontWeight='lg' >Procedure Category</Typography>
                        </Box>
                        <Box className="flex-1" >
                            <CustomInput placeholder={'Enter Procedure Category'}
                                type="text"
                                size="sm"
                                name="procedure_catgry_name"
                                value={procedure_catgry_name}
                                handleChange={updateProcedrcatMaster}

                            />
                        </Box>
                    </Box>

                    <Box className="flex justify-center items-center w-3/4">
                        <Box className="flex-1 ml-2 " >
                            <Typography level='body-md' fontWeight='lg' >Procedure Category Status</Typography>
                        </Box>
                        <Box className="flex-1 ml-2 " >
                            <CusCheckbox
                                // label="Status"
                                color="primary"
                                size="md"
                                fontWeight='lg'
                                name="procedure_catgry_status"
                                value={procedure_catgry_status}
                                checked={procedure_catgry_status}
                                onCheked={updateProcedrcatMaster}
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

export default memo(ProcedureCategoryMast)
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
import SupplierMastTable from './SupplierMastTable'

const SupplierMast = () => {
    const navigate = useNavigate()
    const [supplierMaster, setSupplierMaster] = useState({
        supplier_slno: '',
        supplier_name: '',
        supplier_address: '',
        supplier_phno: '',
        supplier_status: false
    })
    //Destructuring
    const { supplier_slno, supplier_name, supplier_address, supplier_phno, supplier_status } = supplierMaster
    const updateSupplierMaster = useCallback((e) => {
        const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
        setSupplierMaster({ ...supplierMaster, [e.target.name]: value })
    }, [supplierMaster])


    const postData = useMemo(() => {
        return {
            supplier_name: supplier_name,
            supplier_address: supplier_address,
            supplier_phno: supplier_phno,
            supplier_status: supplier_status === true ? 1 : 0
        }
    }, [supplier_name, supplier_address, supplier_phno, supplier_status])


    const patchdata = useMemo(() => {
        return {
            supplier_name: supplier_name,
            supplier_address: supplier_address,
            supplier_phno: supplier_phno,
            supplier_status: supplier_status === true ? 1 : 0,
            supplier_slno: supplier_slno
        }
    }, [supplier_name, supplier_address, supplier_phno, supplier_status, supplier_slno])


    const reset = useCallback(() => {
        const resetfrm = {
            supplier_slno: '',
            supplier_name: '',
            supplier_address: '',
            supplier_phno: '',
            supplier_status: false
        }
        setSupplierMaster(resetfrm)
    }, [])
    const submit = useCallback(() => {

        const InsertFun = async (postData) => {
            const result = await axioslogin.post('/Suppliermaster', postData);
            const { success, message } = result.data

            if (success === 1) {
                reset()
                succesNotify(message)
            } else {
                warningNotify(message)
            }
        }

        const updateDoctorMAst = async (patchdata) => {
            const result = await axioslogin.patch('/Suppliermaster', patchdata);
            const { success, message } = result.data
            if (success === 1) {
                reset()
                succesNotify(message)
            } else {
                warningNotify(message)
            }
        }


        if (supplier_name !== '') {
            if (editFlag === 2) {
                updateDoctorMAst(patchdata)
            } else {
                InsertFun(postData)
            }

        } else {
            warningNotify("Please enter Item Name and HSN Code")
        }

    }, [postData, supplier_name, patchdata])

    const [editFlag, setEditFlag] = useState(0)
    const viewdata = useCallback(() => {
        setEditFlag(1)
    }, [])

    const rowSelect = useCallback((value) => {
        setEditFlag(2)
        const { supplier_name, supplier_address, supplier_phno, supplier_status, supplier_slno } = value
        const resetfrm = {
            supplier_name: supplier_name,
            supplier_status: supplier_status === 1 ? true : false,
            supplier_address: supplier_address,
            supplier_phno: supplier_phno,
            supplier_slno: supplier_slno
        }
        setSupplierMaster(resetfrm)
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
            {editFlag === 1 ? <SupplierMastTable rowSelect={rowSelect} CloseFnctn={CloseFnctn} /> :
                <Paper className='w-full flex flex-1 flex-col m-5 p-2  items-center justify-center gap-1 ' >
                    <Box sx={{ width: '100%', display: 'flex', justifyContent: "center" }}>
                        <Typography level='body-md' fontWeight='lg' sx={{ pb: 2 }} >Supplier Master</Typography>
                    </Box>
                    <Box className="flex justify-center items-center w-3/4">
                        <Box className="flex-1 ml-2 " >
                            <Typography level='body-md' fontWeight='lg' >Supplier Name</Typography>
                        </Box>
                        <Box className="flex-1" >
                            <CustomInput placeholder={'Enter Supplier Name'}
                                type="text"
                                size="sm"
                                name="supplier_name"
                                value={supplier_name}
                                handleChange={updateSupplierMaster}

                            />
                        </Box>
                    </Box>
                    <Box className="flex justify-center items-center w-3/4">
                        <Box className="flex-1 ml-2 " >
                            <Typography level='body-md' fontWeight='lg' >Supplier Address</Typography>
                        </Box>
                        <Box className="flex-1" >
                            <CustomInput placeholder={'Enter Supplier Address'}
                                type="text"
                                size="sm"
                                name="supplier_address"
                                value={supplier_address}
                                handleChange={updateSupplierMaster}

                            />
                        </Box>
                    </Box>
                    <Box className="flex justify-center items-center w-3/4">
                        <Box className="flex-1 ml-2 " >
                            <Typography level='body-md' fontWeight='lg' >Supplier Phno</Typography>
                        </Box>
                        <Box className="flex-1" >
                            <CustomInput placeholder={'Enter Supplier Phno'}
                                type="number"
                                size="sm"
                                name="supplier_phno"
                                value={supplier_phno}
                                handleChange={updateSupplierMaster}

                            />
                        </Box>
                    </Box>
                    <Box className="flex justify-center items-center w-3/4">
                        <Box className="flex-1 ml-2 " >
                            <Typography level='body-md' fontWeight='lg' >Supplier Status</Typography>
                        </Box>
                        <Box className="flex-1 ml-2 " >
                            <CusCheckbox
                                color="primary"
                                size="md"
                                fontWeight='lg'
                                name="supplier_status"
                                value={supplier_status}
                                checked={supplier_status}
                                onCheked={updateSupplierMaster}

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

export default memo(SupplierMast)
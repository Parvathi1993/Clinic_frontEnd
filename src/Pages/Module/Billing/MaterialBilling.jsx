import React, { useCallback, memo, useState, useMemo, useEffect, Fragment } from 'react'
import { Box } from '@mui/joy'
import { Paper } from '@mui/material'
import Typography from '@mui/joy/Typography'
import CustomInput from '../../../Components/CustomInput'
import Button from '@mui/material/Button';
import { axioslogin } from '../../../AxiosConfig/Axios'
import { ToastContainer } from 'react-toastify'
import { succesNotify, warningNotify } from '../../../Components/CommonCode'
import { format } from 'date-fns'
import RefreshIcon from '@mui/icons-material/Refresh';
import CusIconButton from '../../../Components/CusIconButton';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import ProcedureDropDown from '../../../Components/ProcedureDropDown'
import { CssVarsProvider } from '@mui/joy/'
import Table from '@mui/joy/Table';
import DeleteIcon from '@mui/icons-material/Delete';
import ShowPrint from './ShowPrint'
import { useNavigate } from 'react-router-dom'
import ProcedurebyCategryDropDown from '../../../Components/ProcedurebyCategryDropDown'
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import ProcedreCatNonMaterial from '../../../Components/ProcedreCatNonMaterial'
import ProcedureCatMaterial from '../../../Components/ProcedureCatMaterial'


const MaterialBilling = ({ pateintid }) => {
    const navigate = useNavigate()
    const [procedure, setProcedure] = useState(0)
    const [procedure_catgry_slno, setprocedure_catgry_slno] = useState(0)
    const [procedureCode, setProcedureCode] = useState('')
    const [produrname, setProcedrName] = useState('')
    const [rate, setRate] = useState(0)
    const [procedurFlag, setprocedurFlag] = useState(0)
    const [detlFlag, setDetlFlag] = useState(0)
    const [dataPost, setdataPost] = useState([])
    const [SlNo, setSlNo] = useState(1)
    const [material, setmaterial] = useState('')
    console.log("material", material);

    const updateprocedureCode = useCallback((e) => {
        setProcedureCode(e.target.value)
        const getProcedureName = async (procedure) => {
            const result = await axioslogin.get(`/Billing/getProcedureBsedOnCode/${procedure}`)
            const { success, data } = result.data
            if (success === 1) {
                const { procedure_slno, procedure_name } = data[0]
                setprocedurFlag(1)
                setProcedure(procedure_slno)
                setProcedrName(procedure_name)
            } else {
                // setProcedrName('')
                // setRate(0)
            }
        }
        getProcedureName(e.target.value)

    }, [])

    useEffect(() => {
        const getProcdrDetail = async (procedure) => {
            const result = await axioslogin.get(`/Billing/getProcedureNameRate/${procedure}`)
            const { success, data } = result.data
            if (success === 1) {
                const { procedure_name, procedure_rate } = data[0]
                setProcedrName(procedure_name)
                setRate(procedure_rate)
            } else {
                setProcedrName('')
                setRate(0)
            }
        }
        getProcdrDetail(procedure)
    }, [procedure])


    const AddProcedure = useCallback(() => {
        if (procedure === 0) {
            warningNotify("Please Select Any Procedure")
        }
        else {
            const newData = {
                id: Math.ceil(Math.random() * 1000),
                slno: SlNo,
                procedure: procedure,
                procedureName: produrname,
                procedureRate: rate,
                status: 1
            }
            const datass = [...dataPost, newData]
            if (dataPost.length !== 0) {
                if (dataPost[0].procedure !== procedure) {
                    setdataPost(datass)
                    setProcedure(0)
                    setSlNo(SlNo + 1)
                }
                else {
                    warningNotify("Procedure Already Added")
                }
            } else {
                setdataPost(datass)
                setProcedure(0)
                setSlNo(SlNo + 1)
            }
            // if (datass.length !== 0) {
            //     setdataPost(datass)
            //     setProcedure(0)
            //     setSlNo(SlNo + 1)
            // }
            setDetlFlag(1)
            setProcedureCode('')
            setprocedure_catgry_slno(0)
            setProcedure(0)
            setprocedurFlag(0)
        }




    }, [procedure, produrname, produrname, rate])


    const submit = useCallback(() => {



    }, [])
    const CloseMAster = useCallback(() => {
        navigate('/Home')
    }, [])

    const RefreshFunctn = useCallback(() => {
        setProcedureCode('')
        setprocedure_catgry_slno(0)
        setProcedure(0)
        setprocedurFlag(0)
    }, [])



    return (

        <Fragment>
            <Box sx={{ width: "100%", display: 'flex', flexDirection: "row", pt: 1, pb: 1.5 }}>
                <Box sx={{ width: "25%", display: 'flex', flexDirection: "column", pt: 1, pb: 1.5 }}>
                    <Box sx={{ pl: 2, width: "100%" }}>
                        <Typography sx={{ fontSize: 13, fontFamily: 'sans-serif', fontWeight: 550, textAlign: 'center' }}>Procedure Category</Typography>
                    </Box>
                    <Box sx={{ pl: 2, width: "100%" }}>
                        <ProcedureCatMaterial procedure_catgry_slno={procedure_catgry_slno} setprocedure_catgry_slno={setprocedure_catgry_slno}
                            setmaterial={setmaterial} />
                    </Box>
                </Box>



                <Box sx={{ width: "25%", display: 'flex', flexDirection: "column", pt: 1, pb: 1.5 }}>
                    <Box sx={{ pl: 2, width: "100%" }}>
                        <Typography sx={{ fontSize: 13, fontFamily: 'sans-serif', fontWeight: 550, textAlign: 'center' }}>Procedure Category</Typography>
                    </Box>
                    <Box sx={{ pl: 2, width: "100%" }}>
                        <ProcedureCatMaterial procedure_catgry_slno={procedure_catgry_slno} setprocedure_catgry_slno={setprocedure_catgry_slno}
                            setmaterial={setmaterial} />
                    </Box>
                </Box>



            </Box>

        </Fragment>


    )



    //     //             <Box sx={{ pl: 2, width: "15%" }}>
    //     //                 <Typography sx={{ fontSize: 13, fontFamily: 'sans-serif', fontWeight: 550, textAlign: 'center' }} >Procedure Code</Typography>

    //     //             </Box>
    //     //             <Box sx={{ pl: 2, width: "25%" }}>
    //     //                 <Typography sx={{ fontSize: 13, fontFamily: 'sans-serif', fontWeight: 550, textAlign: 'center' }} >Procedure</Typography>
    //     //             </Box>
    //     //         </Box>

    //     //         <Box sx={{ width: "100%", display: 'flex', flexDirection: "row", pt: 1 }}>
    //     //             <Box sx={{ pl: 2, width: "15%" }}>
    //     //             </Box>
    //     //             <Box sx={{ pl: 2, width: "25%" }}>
    //     //                 <ProcedureCatMaterial procedure_catgry_slno={procedure_catgry_slno} setprocedure_catgry_slno={setprocedure_catgry_slno}
    //     //                     setmaterial={setmaterial} />
    //     //             </Box>

    //     //             {material === 1 ?
    //     //                 <Box>
    //     //                     <Box sx={{ pl: 2, width: "15%" }}>
    //     //                         <CustomInput
    //     //                             type="text"
    //     //                             size="sm"
    //     //                             name="procedureCode"
    //     //                             value={procedureCode}
    //     //                             handleChange={updateprocedureCode}

    //     //                         />
    //     //                     </Box>
    //     //                     <Box sx={{ pl: 2, width: "25%" }}>
    //     //                         {procedurFlag === 1 ?
    //     //                             <CustomInput
    //     //                                 type="text"
    //     //                                 size="sm"
    //     //                                 name="produrname"
    //     //                                 value={produrname}
    //     //                                 disable={true}
    //     //                             /> : <Box>
    //     //                                 {procedure_catgry_slno === 0 ?
    //     //                                     <ProcedureDropDown procedure={procedure} setProcedure={setProcedure} /> :
    //     //                                     <ProcedurebyCategryDropDown procedure={procedure} setProcedure={setProcedure} procedure_catgry_slno={procedure_catgry_slno} />

    //     //                                 }

    //     //                             </Box>

    //     //                         }
    //     //                     </Box>
    //     //                     <Box sx={{ pl: 2, width: "4%" }}>
    //     //                         <CusIconButton size="sm" variant="outlined" clickable="true" color="primary" onClick={AddProcedure} >
    //     //                             <AddCircleOutlineIcon fontSize='small' />
    //     //                         </CusIconButton>
    //     //                     </Box>
    //     //                     <Box sx={{ pl: 2, width: "4%" }}>
    //     //                         <CusIconButton size="sm" variant="outlined" clickable="true" color="primary" onClick={RefreshFunctn} >
    //     //                             <RefreshIcon fontSize='small' />
    //     //                         </CusIconButton>
    //     //                     </Box>
    //     //                 </Box>
    //     //                 :







    //     //                 <Box sx={{ width: "100%", display: 'flex', flexDirection: "row", }}>
    //     //                     <Box sx={{ pl: 2, width: "15%" }}>
    //     //                         <CustomInput
    //     //                             type="text"
    //     //                             size="sm"
    //     //                             name="procedureCode"
    //     //                             value={procedureCode}
    //     //                             handleChange={updateprocedureCode}

    //     //                         />
    //     //                     </Box>
    //     //                     <Box sx={{ pl: 2, width: "25%" }}>
    //     //                         {procedurFlag === 1 ?
    //     //                             <CustomInput
    //     //                                 type="text"
    //     //                                 size="sm"
    //     //                                 name="produrname"
    //     //                                 value={produrname}
    //     //                                 disable={true}
    //     //                             /> : <Box>
    //     //                                 {procedure_catgry_slno === 0 ?
    //     //                                     <ProcedureDropDown procedure={procedure} setProcedure={setProcedure} /> :
    //     //                                     <ProcedurebyCategryDropDown procedure={procedure} setProcedure={setProcedure} procedure_catgry_slno={procedure_catgry_slno} />

    //     //                                 }

    //     //                             </Box>

    //     //                         }
    //     //                     </Box>
    //     //                     <Box sx={{ pl: 2, width: "4%" }}>
    //     //                         <CusIconButton size="sm" variant="outlined" clickable="true" color="primary" onClick={AddProcedure} >
    //     //                             <AddCircleOutlineIcon fontSize='small' />
    //     //                         </CusIconButton>
    //     //                     </Box>
    //     //                     <Box sx={{ pl: 2, width: "4%" }}>
    //     //                         <CusIconButton size="sm" variant="outlined" clickable="true" color="primary" onClick={RefreshFunctn} >
    //     //                             <RefreshIcon fontSize='small' />
    //     //                         </CusIconButton>
    //     //                     </Box>
    //     //                 </Box>

    //     //             }



    //     //         </Box>

    //     //     </Box>


    //     // </Box>
    // //     {
    // //     detlFlag === 1 ?
    // //         <Box>
    // //             <Box sx={{ border: 0.5 }}>
    // //                 <CssVarsProvider>
    // //                     <Table stickyHeader>
    // //                         <thead>
    // //                             <tr>
    // //                                 <th style={{ width: '20%', align: "center" }}>Sl No</th>
    // //                                 <th style={{ width: '60%', align: "center" }}>Procedure Name</th>
    // //                                 <th style={{ width: '60%', align: "center" }}>Procedure Rate</th>
    // //                                 <th style={{ width: '10%', align: "center" }}>Delete</th>
    // //                             </tr>
    // //                         </thead>
    // //                         <tbody>
    // //                             {dataPost && dataPost.map((val, index) => {
    // //                                 return <tr
    // //                                     key={index}
    // //                                     sx={{
    // //                                         '&:last-child td, &:last-child th': { border: 0 }, maxHeight: 60,
    // //                                         minHeight: 5
    // //                                     }}
    // //                                 >
    // //                                     <td> {index + 1}</td>
    // //                                     <td> {val.procedureName}</td>
    // //                                     <td> {val.procedureRate}</td>
    // //                                     <td>
    // //                                         <DeleteIcon size={6} onClick={() => rowSelect(val)} />
    // //                                     </td>
    // //                                 </tr>
    // //                             })}
    // //                         </tbody>
    // //                     </Table>
    // //                 </CssVarsProvider>
    // //             </Box>
    // //             <Box>
    // //                 <Box sx={{ width: "100%", display: 'flex', flexDirection: "row", pt: 1 }}>
    // //                     <Box sx={{ width: "70%", pt: 0.5, }}>
    // //                     </Box>
    // //                     <Box sx={{ width: "20%", pt: 0.5, }}>
    // //                         <Typography sx={{ fontSize: 15, fontFamily: 'sans-serif', fontWeight: 550, pl: 8 }} >Total Amount</Typography>
    // //                     </Box>
    // //                     <Box sx={{ width: "10%", pt: 0.5, }}>
    // //                         <Typography sx={{ fontSize: 15, fontFamily: 'sans-serif', fontWeight: 550, pl: 8 }} >{sumProcedureRate}</Typography>
    // //                     </Box>

    // //                 </Box>
    // //             </Box>
    // //         </Box>
    // //         : null
    // // }





    // //     </Box >

    // )
}

export default memo(MaterialBilling)
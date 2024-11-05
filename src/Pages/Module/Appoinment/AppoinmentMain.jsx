import React, { useCallback, memo, useState, useMemo, } from 'react'
import { Box } from '@mui/joy'
import { Paper } from '@mui/material'
import Typography from '@mui/joy/Typography'
import CustomInput from '../../../Components/CustomInput'
import { axioslogin } from '../../../AxiosConfig/Axios'
import { ToastContainer } from 'react-toastify'
import { warningNotify } from '../../../Components/CommonCode'
import { useNavigate } from 'react-router-dom'
import SpecialityDropDown from '../../../Components/SpecialityDropDown'
import DoctorDropDownBySepciality from '../../../Components/DoctorDropDownBySepciality'
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import CusIconButton from '../../../Components/CusIconButton'
import CloseIcon from '@mui/icons-material/Close';
import RefreshIcon from '@mui/icons-material/Refresh';
import { CssVarsProvider } from '@mui/joy/'
import Table from '@mui/joy/Table';
import { format } from 'date-fns'
import AddTaskIcon from '@mui/icons-material/AddTask';
import AppoinmentModal from './AppoinmentModal'
import AppoinmentCancelModal from './AppoinmentCancelModal'
import EventBusyIcon from '@mui/icons-material/EventBusy';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import NewRegAppinmentModal from './NewRegAppinmentModal'

const AppoinmentMain = () => {
    const navigate = useNavigate()
    const [speciality, setspeciality] = useState(0)
    const [doctor, setDoctor] = useState(0)
    const [appinmnt_date, setAppinmnt_date] = useState('')
    const [tableData, setTableData] = useState([])
    const updateAppinmnt_date = useCallback((e) => {
        setAppinmnt_date(e.target.value)
    }, [])

    const postData = useMemo(() => {
        return {
            visit_date: appinmnt_date,
            doctor_slno: doctor
        }
    }, [doctor, appinmnt_date])


    const searchbyCondtn = useCallback(() => {
        const getDoctrTokenStartEnd = async (doctor) => {
            const result = await axioslogin.get(`/Appoinments/getDoctrTokenStartEnd/${doctor}`)
            return result.data
        }
        const getAppoinmentsfmVisitMast = async (postData) => {
            const result = await axioslogin.post('/Appoinments/getAppoinmentsfmVisitMast', postData)
            return result.data

        }

        const generateTokenArray = (start, end) => {
            if (start > end) {
                return [];
            }
            return Array.from({ length: end - start + 1 }, (_, i) => start + i);
        };

        const mergeArrays = (array1, array2) => {
            return array1.map(token => {
                const match = array2.find(obj => obj.token_no === token);
                return match ? match : { token_no: token, flag: 0 };
            });
        };



        if (doctor !== 0 && appinmnt_date !== '') {
            getDoctrTokenStartEnd(doctor).then((val) => {
                const { data, success } = val
                if (success === 1) {
                    const { doctor_token_start, doctor_token_end } = data[0]
                    const xx = generateTokenArray(doctor_token_start, doctor_token_end)

                    getAppoinmentsfmVisitMast(postData).then((values) => {
                        const { data, success } = values
                        if (success === 1) {
                            const resultArray = mergeArrays(xx, data);
                            setTableData(resultArray)
                        }
                        else {
                            const resultarry = xx.map((val) => {
                                const obj = {
                                    token_no: val,
                                    flag: 0
                                }
                                return obj
                            })
                            setTableData(resultarry)

                        }
                    })
                }
            })

        } else {
            warningNotify("Please select doctor and date Before serach")
        }

    }, [postData, doctor, appinmnt_date])


    const RefreshFunctn = useCallback(() => {
        setspeciality(0)
        setDoctor(0)
        setAppinmnt_date('')
    }, [])

    const CloseFnctn = useCallback(() => {
        navigate('/Home')

    }, [])

    const [appoinModalFlag, setappoinModalFlag] = useState(0)
    const [appoinModal, setappoinModal] = useState(false)
    const [tokentaken, setTokenTaken] = useState(0)
    const rowSelect = useCallback((val) => {
        setappoinModalFlag(1)
        setappoinModal(true)
        const { token_no } = val
        setTokenTaken(token_no)
    }, [])

    const [cancelTokenFlag, setCancelTokenFlag] = useState(0)
    const [cancelTokenModel, setCancelTokenModel] = useState(false)


    const cancelSelect = useCallback((val) => {
        setCancelTokenFlag(1)
        setCancelTokenModel(true)
        const { visit_mast_slno } = val
        setTokenTaken(visit_mast_slno)
    }, [])

    const cancelClose = useCallback(() => {
        setCancelTokenFlag(0)
        setCancelTokenModel(false)
    }, [])

    const modalcolse = useCallback(() => {

        const getDoctrTokenStartEnd = async (doctor) => {
            const result = await axioslogin.get(`/Appoinments/getDoctrTokenStartEnd/${doctor}`)
            return result.data
        }
        const getAppoinmentsfmVisitMast = async (postData) => {
            const result = await axioslogin.post('/Appoinments/getAppoinmentsfmVisitMast', postData)
            return result.data

        }

        const generateTokenArray = (start, end) => {
            if (start > end) {
                return [];
            }
            return Array.from({ length: end - start + 1 }, (_, i) => start + i);
        };

        const mergeArrays = (array1, array2) => {
            return array1.map(token => {
                const match = array2.find(obj => obj.token_no === token);
                return match ? match : { token_no: token, flag: 0 };
            });
        };

        getDoctrTokenStartEnd(doctor).then((val) => {
            const { data, success } = val
            if (success === 1) {
                const { doctor_token_start, doctor_token_end } = data[0]
                const xx = generateTokenArray(doctor_token_start, doctor_token_end)

                getAppoinmentsfmVisitMast(postData).then((values) => {
                    const { data, success } = values
                    if (success === 1) {

                        const resultArray = mergeArrays(xx, data);
                        setTableData(resultArray)
                        setappoinModalFlag(0)
                        setappoinModal(false)
                    }
                    else {
                        const resultarry = xx.map((val) => {
                            const obj = {
                                token_no: val,
                                flag: 0
                            }
                            return obj
                        })
                        setTableData(resultarry)
                        setappoinModalFlag(0)
                        setappoinModal(false)

                    }
                })
            }
        })

        setappoinModalFlag(0)
        setappoinModal(false)
    }, [doctor, postData])

    const cancelmodalcolse = useCallback(() => {


        const getDoctrTokenStartEnd = async (doctor) => {
            const result = await axioslogin.get(`/Appoinments/getDoctrTokenStartEnd/${doctor}`)
            return result.data
        }
        const getAppoinmentsfmVisitMast = async (postData) => {
            const result = await axioslogin.post('/Appoinments/getAppoinmentsfmVisitMast', postData)
            return result.data

        }

        const generateTokenArray = (start, end) => {
            if (start > end) {
                return [];
            }
            return Array.from({ length: end - start + 1 }, (_, i) => start + i);
        };

        const mergeArrays = (array1, array2) => {
            return array1.map(token => {
                const match = array2.find(obj => obj.token_no === token);
                return match ? match : { token_no: token, flag: 0 };
            });
        };

        getDoctrTokenStartEnd(doctor).then((val) => {
            const { data, success } = val
            if (success === 1) {
                const { doctor_token_start, doctor_token_end } = data[0]
                const xx = generateTokenArray(doctor_token_start, doctor_token_end)

                getAppoinmentsfmVisitMast(postData).then((values) => {
                    const { data, success } = values
                    if (success === 1) {

                        const resultArray = mergeArrays(xx, data);
                        setTableData(resultArray)
                        setappoinModalFlag(0)
                        setappoinModal(false)
                    }
                    else {
                        const resultarry = xx.map((val) => {
                            const obj = {
                                token_no: val,
                                flag: 0
                            }
                            return obj
                        })
                        setTableData(resultarry)
                        setCancelTokenFlag(0)
                        setCancelTokenModel(false)

                    }
                })
            }
        })
        cancelClose()

    }, [doctor, postData])


    const [newRegFlag, setNewRegFlag] = useState(0)
    const [newRegFlagModal, setNewRegFlagModal] = useState(false)
    const [newRegData, setNewRegData] = useState([])
    const NewAppoinmentRegister = useCallback((val) => {
        setNewRegFlag(1)
        setNewRegFlagModal(true)
        setNewRegData(val)

    }, [])

    const CloseNewAppoinmentRegister = useCallback(() => {


        const getDoctrTokenStartEnd = async (doctor) => {
            const result = await axioslogin.get(`/Appoinments/getDoctrTokenStartEnd/${doctor}`)
            return result.data
        }
        const getAppoinmentsfmVisitMast = async (postData) => {
            const result = await axioslogin.post('/Appoinments/getAppoinmentsfmVisitMast', postData)
            return result.data

        }

        const generateTokenArray = (start, end) => {
            if (start > end) {
                return [];
            }
            return Array.from({ length: end - start + 1 }, (_, i) => start + i);
        };

        const mergeArrays = (array1, array2) => {
            return array1.map(token => {
                const match = array2.find(obj => obj.token_no === token);
                return match ? match : { token_no: token, flag: 0 };
            });
        };

        getDoctrTokenStartEnd(doctor).then((val) => {
            const { data, success } = val
            if (success === 1) {
                const { doctor_token_start, doctor_token_end } = data[0]
                const xx = generateTokenArray(doctor_token_start, doctor_token_end)

                getAppoinmentsfmVisitMast(postData).then((values) => {
                    const { data, success } = values
                    if (success === 1) {

                        const resultArray = mergeArrays(xx, data);
                        setTableData(resultArray)
                        setNewRegFlag(0)
                        setNewRegFlagModal(false)
                        setNewRegData([])
                    }
                    else {
                        const resultarry = xx.map((val) => {
                            const obj = {
                                token_no: val,
                                flag: 0
                            }
                            return obj
                        })
                        setTableData(resultarry)
                        setNewRegFlag(0)
                        setNewRegFlagModal(false)
                        setNewRegData([])

                    }
                })
            }
        })
        setNewRegFlag(0)
        setNewRegFlagModal(false)
        setNewRegData([])
    }, [])

    return (
        <Box sx={{ width: "100%", p: 5 }}>

            {newRegFlag === 1 ? <NewRegAppinmentModal open={newRegFlagModal} modalcolse={CloseNewAppoinmentRegister} newRegData={newRegData} /> : null}
            {appoinModalFlag === 1 ? <AppoinmentModal open={appoinModal} modalcolse={modalcolse}
                doctor={doctor} appinmnt_date={appinmnt_date} tokentaken={tokentaken} /> : null}
            {cancelTokenFlag === 1 ? <AppoinmentCancelModal open={cancelTokenModel} modalcolse={cancelmodalcolse}
                tokentaken={tokentaken} cancelClose={cancelClose} /> : null}
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
                        <Typography level='body-md' fontWeight='lg' >Appoinments</Typography>
                    </Box>

                    <Box sx={{ width: '80%', display: 'flex', pt: 2.5, margin: 'auto ', pl: 10, flexDirection: "column" }}>
                        <Box sx={{ width: "100%", display: 'flex', flexDirection: "row", }}>
                            <Box sx={{ width: "10%", pt: 0.5, pl: 1 }}>
                                <Typography sx={{ fontSize: 13, fontFamily: 'sans-serif', fontWeight: 550 }} >Speciality</Typography>
                            </Box>

                            <Box sx={{ width: "20%", pt: 0.5, pl: 1 }}>
                                <SpecialityDropDown speciality={speciality} setspeciality={setspeciality} />
                            </Box>
                            <Box sx={{ width: "10%", pt: 0.5, pl: 1 }}>
                                <Typography sx={{ fontSize: 13, fontFamily: 'sans-serif', fontWeight: 550 }} >Doctor</Typography>
                            </Box>
                            <Box sx={{ pl: 2, width: "20%" }}>
                                <DoctorDropDownBySepciality doctor={doctor} setDoctor={setDoctor} speciality={speciality} />
                            </Box>
                            <Box sx={{ width: "10%", pt: 0.5, pl: 1 }}>
                                <Typography sx={{ fontSize: 13, fontFamily: 'sans-serif', fontWeight: 550 }} >Date</Typography>
                            </Box>

                            <Box sx={{ width: "15%", pl: 1 }}>
                                <CustomInput
                                    slotProps={{
                                        input: {
                                            min: format(new Date(), "yyyy-MM-dd")
                                        },
                                    }}
                                    type="date"
                                    size="sm"
                                    name="appinmnt_date"
                                    value={appinmnt_date}
                                    handleChange={updateAppinmnt_date}
                                />
                            </Box>

                            <Box sx={{ width: '3%', pl: 2, }}>
                                <CusIconButton size="sm" variant="outlined" clickable="true" onClick={searchbyCondtn} >
                                    <SearchOutlinedIcon color='primary' fontSize='small' />
                                </CusIconButton>
                            </Box>
                            <Box sx={{ width: '2%', pl: 2 }}>
                                <CusIconButton size="sm" variant="outlined" clickable="true" onClick={RefreshFunctn} >
                                    <RefreshIcon color='primary' fontSize='small' />
                                </CusIconButton>
                            </Box>
                            <Box sx={{ width: '4%', pl: 4 }}>
                                <CusIconButton size="sm" variant="outlined" clickable="true" onClick={CloseFnctn} >
                                    <CloseIcon color='primary' fontSize='small' />
                                </CusIconButton>
                            </Box>
                        </Box>
                    </Box>
                    {
                        tableData.length !== 0 ?
                            <Box sx={{
                                width: '80%', display: 'flex', pt: 2, margin: 'auto ', pl: 10, flexDirection: "column",
                                // backgroundColor: "red"
                            }}>


                                <Box sx={{
                                    borderBottom: 1, borderWidth: 0.1, borderColor: 'black', minHeight: 200, maxHeight: 480,
                                    overflow: 'auto'
                                }} >
                                    <CssVarsProvider>
                                        <Table stickyHeader sx={{ backgroundColor: '#e1f0ef' }}>
                                            <thead>
                                                <tr>
                                                    <th style={{ width: '15%', align: "right" }}>Sl No</th>
                                                    <th style={{ width: '30%', align: "center" }}>Patient ID</th>
                                                    <th style={{ width: '30%', align: "center" }}>Patient Name</th>
                                                    <th style={{ width: '30%', align: "center" }}>Patient Address </th>
                                                    <th style={{ width: '10%', align: "center" }}>Edit</th>
                                                    <th style={{ width: '10%', align: "center" }}>Cancel</th>
                                                    <th style={{ width: '10%', align: "center" }}>New</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {tableData && tableData.map((val, index) => {
                                                    return <tr
                                                        key={index}
                                                        sx={{
                                                            '&:last-child td, &:last-child th': { border: 0 }, maxHeight: 60,
                                                            minHeight: 5
                                                        }}
                                                    >
                                                        <td> {val.token_no}</td>
                                                        <td> {val.patient_id}</td>
                                                        <td> {val.patient_name === null ? val.new_reg_name + " " + val.new_reg_mobile : val.patient_name}</td>
                                                        <td> {val.patient_address}</td>

                                                        <td>
                                                            {
                                                                val.flag === 0 ?
                                                                    <AddTaskIcon size={6} color='primary' onClick={() => rowSelect(val)} />
                                                                    : <AddTaskIcon size={6} />
                                                            }

                                                        </td>
                                                        <td>
                                                            {
                                                                val.flag === 0 ? <EventBusyIcon size={6} /> :
                                                                    <EventBusyIcon size={6} color='primary' onClick={() => cancelSelect(val)} />

                                                            }
                                                        </td>
                                                        <td>
                                                            {
                                                                val.patient_name !== null ? null :
                                                                    <GroupAddIcon size={6} color='primary' onClick={() => NewAppoinmentRegister(val)} />

                                                            }
                                                        </td>
                                                    </tr>
                                                })}
                                            </tbody>
                                        </Table>
                                    </CssVarsProvider>
                                </Box>


                            </Box> :
                            <Box sx={{ width: '80%', display: 'flex', pt: 2.5, margin: 'auto ', pl: 10, flexDirection: "column" }}>





                            </Box>
                    }



                </Box>

            </Paper>

        </Box>
    )
}

export default memo(AppoinmentMain)
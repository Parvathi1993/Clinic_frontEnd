import React, { useEffect, memo, useState } from 'react'
import Box from "@mui/material/Box";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import { axioslogin } from '../AxiosConfig/Axios';

const DoctorDropDownBySepciality = ({ doctor, setDoctor, speciality, setDoctorFee }) => {

    const [doctorArray, setDoctorArray] = useState([])
    useEffect(() => {
        const getDoctorArray = async (speciality) => {
            const result = await axioslogin.get(`/patientRegistration/DocGettingBySpeciality/${speciality}`)
            const { success, data } = result.data
            if (success === 1) {
                setDoctorArray(data)
            } else {
                setDoctorArray([])
            }
        }
        getDoctorArray(speciality)
    }, [speciality])

    return (
        <Box >
            <FormControl fullWidth size="small"  >
                <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={doctor}
                    onChange={(e) => setDoctor(e.target.value)}
                    size="small"
                    fullWidth
                    variant='outlined'
                    sx={{ height: 27, p: 0, m: 0, lineHeight: 1.200 }}
                >
                    <MenuItem value={0} disabled >Select Doctor</MenuItem>
                    {
                        doctorArray && doctorArray.map((val, index) => {
                            return <MenuItem key={index} value={val.doctor_slno}>{val.doctor_name}</MenuItem>
                        })
                    }
                </Select>
            </FormControl>
        </Box >
    )
}

export default memo(DoctorDropDownBySepciality)
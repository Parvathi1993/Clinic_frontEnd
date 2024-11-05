
import React, { useEffect, memo, useState } from 'react'
import Box from "@mui/material/Box";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import { axioslogin } from '../AxiosConfig/Axios';

const SpecialityDropDown = ({ speciality, setspeciality }) => {

    const [specialityarry, setSpecialityarry] = useState([])
    useEffect(() => {
        const getSpeciality = async () => {
            const result = await axioslogin.get('/DoctorMaster/getSpecialities');
            const { success, data } = result.data
            if (success === 1) {
                setSpecialityarry(data)
            } else {
                setSpecialityarry([])
            }
        }
        getSpeciality()
    }, [])


    return (
        <Box >
            <FormControl fullWidth size="small"  >
                <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={speciality}
                    onChange={(e) => setspeciality(e.target.value)}
                    size="small"
                    fullWidth
                    variant='outlined'
                    sx={{ height: 27, p: 0, m: 0, lineHeight: 1.200 }}
                >
                    <MenuItem value={0} disabled >Select Speciality</MenuItem>
                    {
                        specialityarry && specialityarry.map((val, index) => {
                            return <MenuItem key={index} value={val.speciality_slno}>{val.speciality_name}</MenuItem>
                        })
                    }
                </Select>
            </FormControl>
        </Box >
    )
}

export default memo(SpecialityDropDown)




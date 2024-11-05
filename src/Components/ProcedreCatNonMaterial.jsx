import React, { useEffect, memo, useState } from 'react'
import Box from "@mui/material/Box";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import { axioslogin } from '../AxiosConfig/Axios';


const ProcedreCatNonMaterial = ({ procedure_catgry_slno, setprocedure_catgry_slno }) => {
    const [specialityprodurArry, setProdrArry] = useState([])
    useEffect(() => {
        const getProcedure = async () => {
            const result = await axioslogin.get('/ProcedurCatMaster/getProcedureCatgrynonMaterial');
            const { success, data } = result.data
            if (success === 1) {
                setProdrArry(data)
            } else {
                setProdrArry([])
            }
        }
        getProcedure()
    }, [])

    return (
        <Box >
            <FormControl fullWidth size="small"  >
                <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={procedure_catgry_slno}
                    onChange={(e) => setprocedure_catgry_slno(e.target.value)}
                    size="small"
                    fullWidth
                    variant='outlined'
                    sx={{ height: 28, p: 0, m: 0, lineHeight: 1.200 }}
                >
                    <MenuItem value={0} disabled >Select Procedure Category</MenuItem>
                    {
                        specialityprodurArry && specialityprodurArry.map((val, index) => {
                            return <MenuItem key={index} value={val.procedure_catgry_slno} name={val.procedure_catgry_name}
                            >{val.procedure_catgry_name}
                            </MenuItem>
                        })
                    }
                </Select>
            </FormControl>
        </Box >
    )
}

export default memo(ProcedreCatNonMaterial)
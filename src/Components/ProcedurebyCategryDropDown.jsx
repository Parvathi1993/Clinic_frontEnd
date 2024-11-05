import React, { useEffect, memo, useState } from 'react'
import Box from "@mui/material/Box";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import { axioslogin } from '../AxiosConfig/Axios';


const ProcedurebyCategryDropDown = ({ procedure_catgry_slno, procedure, setProcedure }) => {
    const [specialityprodurArry, setProdrArry] = useState([])
    useEffect(() => {
        const getProcedure = async (procedure_catgry_slno) => {
            const result = await axioslogin.get(`/ProcedurMaster/getProcedureByCatgry/${procedure_catgry_slno}`)
            const { success, data } = result.data
            if (success === 1) {
                setProdrArry(data)
            } else {
                setProdrArry([])
            }
        }
        getProcedure(procedure_catgry_slno)
    }, [procedure_catgry_slno])
    return (
        <Box >
            <FormControl fullWidth size="small"  >
                <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={procedure}
                    onChange={(e) => setProcedure(e.target.value)}
                    size="small"
                    fullWidth
                    variant='outlined'
                    sx={{ height: 28, p: 0, m: 0, lineHeight: 1.200 }}
                >
                    <MenuItem value={0} disabled >Select Procedure </MenuItem>
                    {
                        specialityprodurArry && specialityprodurArry.map((val, index) => {
                            return <MenuItem key={index} value={val.procedure_slno} name={val.procedure_name}
                            >{val.procedure_name}
                            </MenuItem>
                        })
                    }
                </Select>
            </FormControl>
        </Box >
    )
}

export default memo(ProcedurebyCategryDropDown)
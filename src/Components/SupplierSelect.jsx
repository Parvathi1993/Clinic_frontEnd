import React, { useEffect, memo, useState } from 'react'
import Box from "@mui/material/Box";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import { axioslogin } from '../AxiosConfig/Axios';

const SupplierSelect = ({ supplier, setSupplier }) => {
    const [supplierarry, setSupplierarry] = useState([])
    useEffect(() => {
        const getsupplier = async () => {
            const result = await axioslogin.get('/Suppliermaster/activeSupplier');
            const { success, data } = result.data
            if (success === 1) {
                setSupplierarry(data)
            } else {
                setSupplierarry([])
            }
        }
        getsupplier()
    }, [])
    return (
        <Box >
            <FormControl fullWidth size="small"  >
                <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={supplier}
                    onChange={(e) => setSupplier(e.target.value)}
                    size="small"
                    fullWidth
                    variant='outlined'
                    sx={{ height: 27, p: 0, m: 0, lineHeight: 1.200 }}
                >
                    <MenuItem value={0} disabled >Select Supplier</MenuItem>
                    {
                        supplierarry && supplierarry.map((val, index) => {
                            return <MenuItem key={index} value={val.supplier_slno}>{val.supplier_name}</MenuItem>
                        })
                    }
                </Select>
            </FormControl>
        </Box >
    )
}

export default memo(SupplierSelect)
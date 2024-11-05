import React, { useEffect, memo, useState } from 'react'
import Box from "@mui/material/Box";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import { axioslogin } from '../AxiosConfig/Axios';

const GstSelect = ({ gst, setGst }) => {
    const [gstarry, setGstarry] = useState([])
    useEffect(() => {
        const getGst = async () => {
            const result = await axioslogin.get('/ItemMaster/getActiveGST');
            const { success, data } = result.data
            if (success === 1) {
                setGstarry(data)
            } else {
                setGstarry([])
            }
        }
        getGst()
    }, [])
    return (
        <Box >
            <FormControl fullWidth size="small"  >
                <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={gst}
                    onChange={(e) => setGst(e.target.value)}
                    size="small"
                    fullWidth
                    variant='outlined'
                    sx={{ height: 27, p: 0, m: 0, lineHeight: 1.200 }}
                >
                    <MenuItem value={0} disabled >Select GST</MenuItem>
                    {
                        gstarry && gstarry.map((val, index) => {
                            return <MenuItem key={index} value={val.gst_slno}>{val.gst_rate}</MenuItem>
                        })
                    }
                </Select>
            </FormControl>
        </Box >
    )
}
export default GstSelect
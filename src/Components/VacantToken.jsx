import React, { useEffect, memo, useState, useMemo } from 'react'
import Box from "@mui/material/Box";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import { axioslogin } from '../AxiosConfig/Axios';
import { format } from 'date-fns'
import { warningNotify } from './CommonCode';


const VacantToken = ({ doctor, TokenSelect, SetTokenSelect }) => {

    const [tableData, setTableData] = useState([])

    const postData = useMemo(() => {
        return {
            visit_date: format(new Date(), "yyyy-MM-dd"),
            doctor_slno: doctor
        }
    }, [doctor])

    useEffect(() => {

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


        if (doctor !== 0) {
            getDoctrTokenStartEnd(doctor).then((val) => {
                const { data, success } = val
                if (success === 1) {
                    const { doctor_token_start, doctor_token_end } = data[0]
                    const xx = generateTokenArray(doctor_token_start, doctor_token_end)
                    getAppoinmentsfmVisitMast(postData).then((values) => {
                        const { data, success } = values
                        if (success === 1) {
                            const resultArray = mergeArrays(xx, data);
                            const freeToken = resultArray && resultArray.filter((val) => {
                                return val.flag === 0 ? val : null
                            })
                            if (freeToken.length !== 0) {
                                setTableData(freeToken)
                            } else {
                                warningNotify("No Token Available")
                            }

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
        }

    }, [doctor, postData])



    return (

        <Box >
            <FormControl fullWidth size="small"  >
                <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={TokenSelect}
                    onChange={(e) => SetTokenSelect(e.target.value)}
                    size="small"
                    fullWidth
                    variant='outlined'
                    sx={{ height: 27, p: 0, m: 0, lineHeight: 1.200 }}
                >
                    <MenuItem value={0} disabled >Select Token</MenuItem>
                    {
                        tableData && tableData.map((val, index) => {
                            return <MenuItem key={index} value={val.token_no} name={val.token_no}
                                neww={val.token_no}>{val.token_no}
                            </MenuItem>
                        })
                    }
                </Select>
            </FormControl>
        </Box >
    )
}

export default memo(VacantToken)
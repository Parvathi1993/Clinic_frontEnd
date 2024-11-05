// import React, { useEffect, memo, useState } from 'react'
import React, { memo, useState, useEffect, Fragment } from 'react'
import Autocomplete from '@mui/joy/Autocomplete';
import { CssVarsProvider } from '@mui/joy/'
import { axioslogin } from '../../../AxiosConfig/Axios';

const DoctorSelectWSepec = ({ doctor, setDoctor, setsepecialization }) => {

    const [DoctrList, setDoctrList] = useState([{ doctor_slno: 0, doctor_name: '', speciality_name: '' }])
    const [value, setValue] = useState(DoctrList[0]);
    const [inputValue, setInputValue] = useState('');

    useEffect(() => {
        const getDoctrList = async () => {
            const result = await axioslogin.get('/Appoinments/DoctListWithSpecality');
            const { success, data } = result.data
            if (success === 1) {
                data.length > 0 && setDoctrList(data)
            } else {
                // setDoctrList([])
            }
        }
        getDoctrList()
    }, [])


    useEffect(() => {
        if (value !== null) {
            setDoctor(value.doctor_slno)
            setsepecialization(value.speciality_name)
        } else {
            setDoctor(0)
            setsepecialization('')
        }
        return
    }, [value, setDoctor, setsepecialization])
    return (
        <Fragment >
            <CssVarsProvider>
                <Autocomplete
                    sx={{
                        "--Input-minHeight": "29px"
                    }}
                    value={doctor === 0 ? DoctrList : value}
                    placeholder="Select Doctor"
                    clearOnBlur
                    onChange={(event, newValue) => {
                        setValue(newValue);
                    }}
                    inputValue={inputValue}
                    onInputChange={(event, newInputValue) => {
                        setInputValue(newInputValue);
                    }}
                    loading={true}
                    loadingText="Loading..."
                    freeSolo
                    // renderInput={(params) => (<Input size="sm" placeholder="Small"  {...params} />)}
                    isOptionEqualToValue={(option, value) => option.doctor_name === value.doctor_name}
                    getOptionLabel={option => option.doctor_name || ''}
                    options={DoctrList}
                />
            </CssVarsProvider>
        </Fragment>
    )
}

export default memo(DoctorSelectWSepec)
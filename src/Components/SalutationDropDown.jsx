import React from 'react'
import MenuItem from '@mui/material/MenuItem'
import Select from '@mui/material/Select'

const salutation = [
    { value: 1, name: 'Mr.' },
    { value: 2, name: 'Mrs.' },
    { value: 3, name: 'Miss.' },
    { value: 4, name: 'Dr.' },
    { value: 5, name: 'Ms.' },
    { value: 6, name: 'Prof.' },
    { value: 7, name: 'Rev.' },
    { value: 8, name: 'Lady.' },
    { value: 9, name: 'Sir.' },
    { value: 10, name: 'Capt.' },
    { value: 11, name: 'Major.' },
    { value: 12, name: 'Col.' },
    { value: 13, name: 'Lady.' },
    { value: 14, name: 'Cmdr.' },
    { value: 15, name: 'Brgdr.' },
    { value: 16, name: 'Judge.' }
]

const SalutationDropDown = ({ salutn, setSalutn }) => {


    return (

        <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            // disabled={disabled}
            value={salutn}
            onChange={(e, { props }) => {
                setSalutn(e.target.value);
                // setSalutnname(props.name)
            }}
            // onChange={(e) => setSalutn(e.target.value)}
            size="small"
            fullWidth
            variant="outlined"
            color="primary"
            sx={{ height: 30, p: 0, m: 0, lineHeight: 1.2 }}
        >
            <MenuItem value={0} disabled>
                Select Salutation
            </MenuItem>
            {salutation &&
                salutation.map((val, index) => {
                    return (
                        <MenuItem key={index} value={val.value} name={val.name}>
                            {val.name}
                        </MenuItem>
                    )
                })}
        </Select>
    )
}

export default SalutationDropDown
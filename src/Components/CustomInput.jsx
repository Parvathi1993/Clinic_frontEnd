import React from 'react'
import Input from '@mui/joy/Input'

const CustomInput = ({ slotProps, placeholder, name, handleChange, value, type, disable, min, max }) => {
    return (
        <Input
            slotProps={slotProps}
            color="primary"
            value={value}
            placeholder={placeholder}
            type={type}
            name={name}
            onChange={handleChange}
            size="sm"
            variant="outlined"
            disable={disable}
            min={min}
            max={max}
        />
    )
}

export default CustomInput
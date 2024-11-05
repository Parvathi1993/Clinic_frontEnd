import React from 'react'

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

const DistrictDropDown = () => {

    const handleChange = (event, newValue) => {

    };

    return (
        <Select
            color="primary"
            placeholder="Salutation"
            size="sm"
            defaultValue="Select "
            onChange={handleChange}
        >
            <Option value={0}>Choose Salutation</Option>
            {
                salutation?.map((val) => <Option value={val.value}>{val.name}</Option>)
            }
        </Select>
    )
}

export default DistrictDropDown
import React, { useEffect, memo, useState, Fragment } from 'react'
import Autocomplete from '@mui/joy/Autocomplete';
import { CssVarsProvider } from '@mui/joy/'

const ItemNameSelect = ({ itemArray, itemslno, setItemSlno, setItemName }) => {

    const [models, setModels] = useState([{ item_slno: 0, item_name: '' }])
    const [value, setValue] = useState(models[0]);
    const [inputValue, setInputValue] = useState('');

    useEffect(() => {
        if (value !== null) {
            setValue(value)
            setItemSlno(value.item_slno)
            setItemName(value.item_name)
        } else {
            setItemSlno(0)
        }
        return
    }, [value, setItemSlno])

    useEffect(() => {
        itemArray.length > 0 && setModels(itemArray)
    }, [itemArray])
    return (
        <Fragment >
            <CssVarsProvider>
                <Autocomplete
                    sx={{
                        "--Input-minHeight": "29px"
                    }}
                    value={itemslno === 0 ? models : value}
                    placeholder="Select Item Name"
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
                    isOptionEqualToValue={(option, value) => option.item_name === value.item_name}
                    getOptionLabel={option => option.item_name || ''}
                    options={models}
                />
            </CssVarsProvider>
        </Fragment>
    )
}

export default memo(ItemNameSelect)
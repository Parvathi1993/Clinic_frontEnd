
import React, { Fragment, memo } from 'react'
import { CssVarsProvider } from '@mui/joy/styles';
import Checkbox from '@mui/joy/Checkbox';

const CusCheckbox = ({
    variant,
    color,
    size,
    disabled,
    label,
    value,
    onCheked,
    checked,
    name
}) => {
    return (
        <Fragment>
            <CssVarsProvider>
                <Checkbox
                    variant={variant}
                    color={color}
                    value={value === true ? 1 : 0}
                    size={size}
                    // defaultChecked={false}
                    disabled={disabled}
                    label={label}
                    onChange={(e) => onCheked(e)}
                    checked={checked}
                    name={name}
                />
            </CssVarsProvider>
        </Fragment>
    )
}

export default memo(CusCheckbox)


import React, { memo, useCallback, useMemo, useState } from 'react'
import { axioslogin } from '../../../AxiosConfig/Axios';
import Slide from '@mui/material/Slide';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import { Box, Paper } from '@mui/material'
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Typography from '@mui/joy/Typography'
import CustomInput from '../../../Components/CustomInput'
import { succesNotify, warningNotify } from '../../../Components/CommonCode';
const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="left" ref={ref} {...props} />;
});

const AppoinmentCancelModal = ({ open, modalcolse, tokentaken, cancelClose }) => {

    const [radiovalue, setRadioValue] = useState('1')

    //Radio button OnClick function starts
    const updateRadioClick = useCallback(async (e) => {
        e.preventDefault()
        // setOpen(false)
        setRadioValue(e.target.value)

    }, [])

    const [cancelReason, setCancelReason] = useState('')

    const updateCancelReason = useCallback((e) => {

        setCancelReason(e.target.value)

    }, [])

    const patchdata = useMemo(() => {
        return {
            visit_mast_slno: tokentaken,
            cancel_reason: cancelReason
        }

    }, [tokentaken, cancelReason])

    const cancelSavefunctn = useCallback(() => {

        const updateCancelAppoinment = async (patchdata) => {
            const result = await axioslogin.patch('/Appoinments/updateCancelAppoinment', patchdata);
            const { success, message } = result.data
            if (success === 1) {
                succesNotify("Appoinment Succesfully Canceled")
                modalcolse()
            } else {
                warningNotify(message)
            }
        }

        if (cancelReason !== '') {
            updateCancelAppoinment(patchdata)
        } else {
            warningNotify("Please enter the reason for cancel")
        }
    }, [cancelReason, patchdata, modalcolse])
    return (
        <Dialog
            open={open}
            TransitionComponent={Transition}
            keepMounted
            fullWidth

            aria-describedby="alert-dialog-slide-descriptiona"
        >
            < DialogContent id="alert-dialog-slide-descriptiona"
                sx={{
                    minWidth: "100%",
                    minHeight: 60
                }}
            >
                < DialogContentText id="alert-dialog-slide-descriptiona" sx={{ width: "100%", textAlign: "center" }}>
                    Are you sure to Cancel the selected token
                </DialogContentText>

                <Paper >
                    <Box sx={{
                        width: "100%",
                        pl: 1, pt: 0.5, pr: 1, pb: 0.5, flex: 1,
                        display: "flex",
                        flexDirection: { xl: "row", lg: "row", md: "row", sm: 'row', xs: "row" },
                        justifyContent: 'center',
                    }}>

                        <RadioGroup
                            row
                            aria-labelledby="demo-row-radio-buttons-group-label"
                            name="row-radio-buttons-group"
                            value={radiovalue}
                            onChange={(e) => updateRadioClick(e)}
                        >
                            <FormControlLabel value='1' control={<Radio />} label="Yes" />
                            <FormControlLabel value='2' control={<Radio />} label="No" />
                        </RadioGroup>


                    </Box>

                    {radiovalue !== '2' ?


                        <Box sx={{
                            width: "100%", pl: 1, pt: 0.5, pr: 1, pb: 0.5, flex: 1,
                            display: "flex", flexDirection: 'row'
                        }}>

                            <Box sx={{ width: "25%", pt: 0.5 }}>
                                <Typography sx={{ fontSize: 13, fontFamily: 'sans-serif', fontWeight: 550 }} >Enter Reason</Typography>
                            </Box>
                            <Box sx={{ width: "75%", }}>
                                <CustomInput
                                    type="text"
                                    size="sm"
                                    name="cancelReason"
                                    value={cancelReason}
                                    handleChange={updateCancelReason}
                                />
                            </Box>
                        </Box>
                        :
                        null}
                </Paper>



            </DialogContent>
            <DialogActions>
                {radiovalue !== '2' ?
                    <Button onClick={cancelSavefunctn} color="secondary" >Save</Button>
                    : null}
                <Button onClick={cancelClose} color="secondary" >Close</Button>
            </DialogActions>

        </Dialog>
    )
}

export default memo(AppoinmentCancelModal)
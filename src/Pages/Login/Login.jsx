import { Box, Input } from '@mui/joy'
import React, { memo, useCallback, useState } from 'react'
import Button from '@mui/joy/Button'
import { useNavigate } from 'react-router-dom'
import { axioslogin } from '../../AxiosConfig/Axios'
import { toast } from 'react-toastify'

/**
 * Renders a login form with input fields for user name and password, and a login button.
 *
 * @return {JSX.Element} The login form component.
 */
const Login = () => {
    const navigate = useNavigate()

    const [userName, setUserName] = useState('')
    const [password, setPassword] = useState('')

    /**
     * Handles the click event of the login button.
     *
     * @return {void} No return value.
     */
    const handleClickLoginButton = useCallback(async () => {
        if (userName === '' || password === '' || userName === null || password === null || userName === undefined || password === undefined) {
            toast.info('Please Enter User Name and Password')
            return
        }

        const postData = {
            usc_name: userName,
            usc_pass: password
        }

        const loginFun = await axioslogin.post('/login/login', postData)
        const { success, message, token } = await loginFun.data;

        if (success !== 1) {
            toast.error(message)
            return
        }

        if (success === 1) {
            sessionStorage.setItem('token', JSON.stringify({ token: token }));
            navigate('/Home')
        }

    }, [userName, password])

    return (
        <Box>
            <Box>User Name</Box>
            <Box>
                <Input placeholder='Enter User Name' variant='outlined' color='warning' onChange={(e) => setUserName(e.target.value)} />
            </Box>
            <Box>Password</Box>
            <Box>
                <Input placeholder='Enter Password' variant='outlined' color='warning' onChange={(e) => setPassword(e.target.value)} />
            </Box>
            <Box className="pt-2" >
                <Button onClick={handleClickLoginButton} fullWidth >Login</Button>
            </Box>
        </Box>
    )
}

export default memo(Login)
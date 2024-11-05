import React, { useEffect, memo, useState } from 'react'
import Box from "@mui/material/Box";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import { axioslogin } from '../../../AxiosConfig/Axios'

const UserGroupSelect = ({ userGroup, setUserGroup }) => {

    const [usergroup, setUsergroup] = useState([])
    useEffect(() => {
        const getUserGroup = async () => {
            const result = await axioslogin.get('/login/emp/userGroupget');
            const { success, data } = result.data
            if (success === 2) {
                setUsergroup(data)
            } else {
                setUsergroup([])
            }
        }
        getUserGroup()
    }, [])


    return (

        <Box >
            <FormControl fullWidth size="small"  >
                <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={userGroup}
                    onChange={(e) => setUserGroup(e.target.value)}
                    size="small"
                    fullWidth
                    variant='outlined'
                    sx={{ height: 30, p: 0, m: 0, lineHeight: 1.200 }}
                >
                    <MenuItem value={0} disabled >Select User Group</MenuItem>
                    {
                        usergroup && usergroup.map((val, index) => {
                            return <MenuItem key={index} value={val.user_group_slno}
                            >{val.user_group_name}
                            </MenuItem>
                        })
                    }
                </Select>
            </FormControl>
        </Box >
    )
}

export default memo(UserGroupSelect)
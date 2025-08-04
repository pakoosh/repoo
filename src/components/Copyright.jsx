import { Link, Typography } from '@mui/material'
import React from 'react'

export const Copyright = (props) => {
    return (
        <Typography variant="body2" color="text.secondary" align="center" {...props}>
            {'Copyright © '}
            <Link color="inherit" href="#">
                Grapners
            </Link>{' '}
            {new Date().getFullYear()}
            {'.'}
        </Typography>
    )
}

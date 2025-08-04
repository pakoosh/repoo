
import * as React from 'react';
import { Button, CssBaseline, TextField, Link, Box, Grid, Typography } from '@mui/material';
import { authService } from '../../services/authServices';
import { Copyright } from '../../components/Copyright';
import { useAuth } from '../../contexts/authContext';
import { useDispatch } from 'react-redux';

export const Login = () => {

    const { login } = useAuth();
    const dispatch = useDispatch();
    const handleSubmit = (event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        let email = data.get('email');
        let password = data.get('password');
        console.log({
            email: email,
            password: password,
        });
        authService.loginUser(email, password)
            .then(response => {
                console.log(response);
                if (response.accessToken) {
                    login(response.accessToken);
                    // setMessage(response.message);
                    console.log(response)
                    dispatch(setIsRegisteredUser(true));
                    dispatch(setUserName(response.name));
                    navigate("/");
                    // return <Toast message={"login Successfull"} severity={1}/>
                }
                alert(response)
            })
            .catch(error => {
                console.error(error);
                // return <Toast message={error} severity={3}/>
                // setMessage(error.message);
            });
    };

    return (
        <Grid container component="main" sx={{ height: '100vh' }}>
            <CssBaseline />
            <Box
                sx={{
                    my: 8,
                    mx: 4,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    margin: "auto",
                }}
            >
                <Typography component="h1" variant="h5">
                    Sign in
                </Typography>
                <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 1 }}>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                id="email"
                                label="Email Address"
                                name="email"
                                autoComplete="email"
                                autoFocus
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                name="password"
                                label="Password"
                                type="password"
                                id="password"
                                autoComplete="current-password"
                            />
                        </Grid>
                    </Grid>
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 3, mb: 2 }}
                    >
                        Sign In
                    </Button>
                    {/* <Grid container justifyContent="flex-start">
                        <Grid item>
                            <Link href="/register" variant="body2">
                                Don't have an account? Sign Up
                            </Link>
                        </Grid>
                    </Grid> */}
                    <Copyright sx={{ mt: 5 }} />
                </Box>
            </Box>
        </Grid>
    );
}

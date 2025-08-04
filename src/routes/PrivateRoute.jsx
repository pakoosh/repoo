import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/authContext';

const PrivateRoute = () => {
    const { authenticated } = useAuth();
    return authenticated ? <Outlet /> : <Navigate to="/login" />;
}

export default PrivateRoute;


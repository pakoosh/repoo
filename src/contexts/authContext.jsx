import React, { createContext, useState, useContext } from 'react';
import { useAppDispatch } from '../hooks/hooks';
import { setIsRegisteredUser } from '../features/Slicers/authSlice';
// import Cookies from 'js-cookie';
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const dispatch = useAppDispatch();
    // const [token, setToken] = useState(Cookies.get('authToken') || '');
    const [token, setToken] = useState(localStorage.getItem("token") || '');

    const authenticated = true;
    // const authenticated = !!token;
    const login = (t) => {
        if (t !== "") {
            setToken(t);
            // Cookies.set('authToken', t, { secure: true, sameSite: 'strict', expires: 1 });
            localStorage.setItem("token", t);
            dispatch(setIsRegisteredUser(true));
            return true;
        }
        return false;
    };

    const logout = () => {
        // Cookies.remove('authToken');
        localStorage.removeItem("token");
        dispatch(setIsRegisteredUser(false));
        setToken('');
    };
    return (
        <AuthContext.Provider value={{ authenticated, login, logout, token }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};


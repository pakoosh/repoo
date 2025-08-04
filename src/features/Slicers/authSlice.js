import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    // mode: "email",
    username: "",
    email: "",
    password: "",
    authFor: "authentication",
    phoneNum: "",
    // authMode: "otp",
    isRegisteredUser: false,
    // isLinkEnabled: true,
    // phoneType: "sms",
};

export const auth = createSlice({
    name: "auth",
    initialState,
    reducers: {
        // setMode: (state, action) => {
        //     state.mode = action.payload;
        // },
        setName: (state, action) => {
            state.username = action.payload;
        },
        setEmail: (state, action) => {
            state.email = action.payload;
        },
        setPassword: (state, action) => {
            state.password = action.payload;
        },
        setAuthFor: (state, action) => {
            state.authFor = action.payload;
        },
        setPhoneNum: (state, action) => {
            state.phoneNum = action.payload;
        },
        // setAuthMode: (state, action) => {
        //     state.authMode = action.payload;
        // },
        setIsRegisteredUser: (state, action) => {
            state.isRegisteredUser = action.payload;
        },
        // setIsLinkEnabled: (state, action) => {
        //     state.isLinkEnabled = action.payload;
        // },
        // setPhoneType: (state, action) => {
        //     state.phoneType = action.payload;
        // },
    },
});

// export const { setMode, setName, setEmail, setPassword, setAuthFor, setPhoneNum, setAuthMode, setIsRegisteredUser, setIsLinkEnabled, setPhoneType } = auth.actions;
export const { setName, setEmail, setPassword, setAuthFor, setPhoneNum, setIsRegisteredUser } = auth.actions;
export default auth.reducer;

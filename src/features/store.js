import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./Slicers/authSlice";
import userSlice from "./Slicers/userSlice";
import alertSlice from "./Slicers/alertSlice";
import alarmSlice from "./Slicers/alarmSlice";
import deviceSlice from "./Slicers/deviceSlice";

const store = configureStore({
  reducer: {
    auth: authSlice,
    user: userSlice,
    alert: alertSlice,
    alarm: alarmSlice,
    device: deviceSlice
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});


export default store;

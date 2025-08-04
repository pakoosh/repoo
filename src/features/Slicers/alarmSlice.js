// store/slices/alarmSlice.js
import { createSlice } from '@reduxjs/toolkit';

const getInitialSoundState = () => {
  const stored = localStorage.getItem('soundStatus');
  return stored ? JSON.parse(stored) : true;
};

const alarmSlice = createSlice({
  name: 'alarm',
  initialState: {
    isSoundOn: getInitialSoundState(),
    alarm: false
  },
  reducers: {
    triggerAlarm: (state) => {
      state.alarm = true;
    },
    resetAlarm: (state) => {
      state.alarm = false;
    },
    toggleSound: (state) => {
      state.isSoundOn = !state.isSoundOn;
      localStorage.setItem('soundStatus', JSON.stringify(state.isSoundOn));
    },
    setSound: (state, action) => {
      state.isSoundOn = action.payload;
      localStorage.setItem('soundStatus', JSON.stringify(state.isSoundOn));
    }
  },
});

export const { triggerAlarm, resetAlarm, toggleSound } = alarmSlice.actions;

export default alarmSlice.reducer;



import React, { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import music from '../assets/music01.mp3'; // Path to your sound file
import { resetAlarm, triggerAlarm } from '../features/Slicers/alarmSlice';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import VolumeOffIcon from '@mui/icons-material/VolumeOff';
import { Box, Button, Typography } from '@mui/material';

const AlertComponent = () => {
    const dispatch = useDispatch();
    const alarm = useSelector((state) => state.alarm.alarm);  // Accessing the alarm state from Redux store
    const isSoundOn = useSelector((state) => state.alarm.isSoundOn);
    const [audio, setAudio] = React.useState(null);
    const timeoutRef = useRef(null);  // Ref to store the setTimeout ID

    const alarmSoundPath = music; // Path to alarm sound file

    // Function to trigger the alarm (dispatching action to Redux)
    const handleTriggerAlarm = () => {
        dispatch(triggerAlarm());
    };

    // Function to stop the alarm sound
    const handleStopAlarm = () => {
        if (audio) {
            audio.pause();  // Stop the sound
            audio.currentTime = 0;  // Reset the sound to the beginning
            dispatch(resetAlarm());  // Reset alarm state in Redux
        }
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current); // Clear any existing timeout
        }
    };

    // Function to reset the alarm, restart the sound, and reset the setTimeout timer
    const handleResetAlarm = () => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current); // Clear the existing timeout
        }

        dispatch(resetAlarm());  // Reset the alarm state to false
        dispatch(triggerAlarm());  // Set alarm state to true again (start the alarm)

        // Set a new timeout to stop the alarm after 10 seconds
        const timer = setTimeout(() => {
            if (audio) {
                audio.pause();  // Stop the sound
                audio.currentTime = 0;  // Reset the sound to the beginning
            }
            dispatch(resetAlarm()); // Reset alarm state after the sound is stopped
        }, 10000); // 10 seconds

        timeoutRef.current = timer;  // Store the new timeout ID in the ref
    };

    useEffect(() => {
        if (alarm && isSoundOn) {
            // Create a new Audio object when the alarm is triggered
            const sound = new Audio(alarmSoundPath);
            setAudio(sound);

            // Set the audio to loop indefinitely
            sound.loop = true;

            // Play the alarm sound
            sound.play();

            // Set a timeout to stop the alarm after 10 seconds
            const timer = setTimeout(() => {
                sound.pause();
                sound.currentTime = 0;
                dispatch(resetAlarm()); // Reset alarm state after the sound is stopped
            }, 10000); // 10 seconds

            timeoutRef.current = timer;  // Store the timeout ID

            // Cleanup function when component unmounts or alarm changes
            return () => {
                clearTimeout(timer); // Clear the timeout if the component unmounts or alarm changes
                if (sound) {
                    sound.pause();
                    sound.currentTime = 0;
                }
            };
        } else if (alarm && !isSoundOn) {
            // Auto-reset alarm if sound is off and alarm was triggered
            dispatch(resetAlarm());
        }
    }, [alarm, isSoundOn, dispatch]);  // Runs whenever the alarm state changes

    return (
        <Box sx={{ my: 2 }}>
            {/* <Typography variant='h6'>Alarm {alarm ? <VolumeUpIcon /> : <VolumeOffIcon />}</Typography> */}
            <Button variant='contained' startIcon={alarm ? <VolumeUpIcon /> : <VolumeOffIcon />} disabled={!alarm} onClick={handleStopAlarm}>
                Stop Alarm
            </Button>
            {/* Uncomment this line if you want to trigger/reset the alarm from outside */}
            {/* <Button variant='contained' onClick={handleResetAlarm}>Reset and Start Alarm</Button> */}
        </Box>
    );
};

export default AlertComponent;

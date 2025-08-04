import { ThemeProvider, createTheme, useTheme } from '@mui/material';
import Router from './routes/Router'
import * as React from 'react';
import { deepOrange, grey } from '@mui/material/colors';
import IconButton from '@mui/material/IconButton';
import Box from '@mui/material/Box';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import ColorModeProvider, { useColorMode } from './contexts/colorModeContext';
import ThemeConfig from './styles/ThemeConfig';
import { ModeToggle } from './components/ModeToggle';
import { SnackbarProvider, useSnackbar } from 'notistack';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Modal from './components/Modal';
import { resetAlarm, triggerAlarm } from './features/Slicers/alarmSlice';
import AlertComponent from './components/Alarm';
import { fetchDevices } from './features/Slicers/deviceSlice';
import { acknowledgeAlert, addAlert, createAlert, deleteOldAlerts, fetchAlerts } from './features/Slicers/alertSlice';
import { getTimestamp } from './services/repository';


export default function App() {
  const { data: devices } = useSelector(state => state.device);
  const alerts = useSelector((state) => state.alert);
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const [showModal, setShowModal] = useState(true); // Modal visibility state

  const alertsData = alerts.data.length > 0 ? alerts.data.filter(alert => alert.acknowledge == false) : [];

  if (alertsData.length > 0) {
    dispatch(triggerAlarm());
  }

  const handleModalClose = () => {
    setShowModal(false); // Close modal when OK is clicked
  };

  const handleTriggerAlarm = () => {
    dispatch(triggerAlarm());
  };


  //============ Geo Location Alerts =======

  const toRadians = (degrees) => degrees * (Math.PI / 180);

  const getDistanceInMeters = (coord1, coord2) => {
    const R = 6371000; // Earth's radius in meters
    const lat1 = toRadians(coord1._lat);
    const lon1 = toRadians(coord1._long);
    const lat2 = toRadians(coord2._lat);
    const lon2 = toRadians(coord2._long);

    const dLat = lat2 - lat1;
    const dLon = lon2 - lon1;

    console.log("lat1", lat1)
    console.log("lon1", lon1)

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) * Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distance in meters
  };

  React.useEffect(() => {
    const checkDevices = async () => {
      try {
        devices?.forEach((device) => {
          const { actualLocation, currentLocation, radius } = device;
          if (!actualLocation || !currentLocation || !radius) return;

          const distance = getDistanceInMeters(currentLocation, actualLocation);
          if (distance > radius) {

            const alertExists = alerts.some(
              (alert) => alert.deviceId === device.id && alert.type === "location"
            );

            if (!alertExists) {
              handleTriggerAlarm();
              dispatch(
                addAlert({
                  deviceId: device.id,
                  alert: `${device.id} is out of radius!`,
                  type: "location"
                })
              );
              enqueueSnackbar(`${device.id} is out of radius!`, { variant: 'error' });
            }
          }
        });
      } catch (error) {
        console.error("Error fetching device data:", error);
      }
    };

    checkDevices();
    const interval = setInterval(checkDevices, 30000);

    return () => clearInterval(interval);
  }, [dispatch]);

  //===================

  //================= delete Alerts ================

  React.useEffect(() => {
    dispatch(deleteOldAlerts()); // Run once immediately

    const intervalId = setInterval(() => {
      dispatch(deleteOldAlerts());
      console.log("Old alerts deleted at:", new Date());
    }, 4 * 60 * 60 * 1000); // every 4 hours

    return () => clearInterval(intervalId);
  }, [dispatch]);

  //===================

  //================= fetch Alerts ================

  React.useEffect(() => {
    dispatch(fetchAlerts());
    const intervalId = setInterval(() => { fetchAlerts(), console.log("fetch Alerts --- ", new Date()) }, 5000); //30000
    return () => clearInterval(intervalId);
  }, []);

  //===================

  //================= fetch Devices ================

  React.useEffect(() => {
    dispatch(fetchDevices());
    const intervalId = setInterval(() => { fetchDevices(), console.log("Devices --- ", new Date()) }, 10000); //30000
    return () => clearInterval(intervalId);
  }, []);

  //===================

  //================= Generate Alerts ================

  const AlertData = async (id, name, type) => {
    let current_time = getTimestamp(new Date());
    await dispatch(createAlert({
      device_id: id, name, type, created_at: current_time, acknowledge: false, acknowledge_at: null
    }));
  }

  const GenerateAlerts = () => {
    if (devices) {
      devices.forEach(device => {
        // console.log("device", device)
        if (device.temperature >= device.temperature_threshold) {
          AlertData(device.id, device.name, 'temperature')
          // console.log(device.name + " temperature_threshold alert")
        }
        if (device.wind >= device.wind_threshold) {
          AlertData(device.id, device.name, 'wind')
          // console.log(device.name + " wind_threshold alert")
        }
        if (device.humidity >= device.humidity_threshold) {
          AlertData(device.id, device.name, 'humidity')
          // console.log(device.name + " humidity_threshold alert")
        }
        if (device.radius_threshold >= device.radius_threshold) {
          AlertData(device.id, device.name, 'radius')
          // console.log(device.name + " radius_threshold alert")
        }
      });
    }
  }

  React.useEffect(() => {
    GenerateAlerts();
    const intervalId = setInterval(() => { GenerateAlerts(), console.log("Generate Alerts --- ", new Date()) }, 5000);
    return () => clearInterval(intervalId);
  }, []);

  //===================

  return (
    <ColorModeProvider>
      <ThemeConfig>
        {showModal ? (
          <Modal open={showModal} onClose={handleModalClose} />
        ) : (
          <Router />)}
      </ThemeConfig>
    </ColorModeProvider>
  );
}


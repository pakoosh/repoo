import React, { useEffect, useRef, memo } from 'react';
import { Card, CardContent, Box, Typography, Chip } from '@mui/material';
import markerIcon from '../assets/marker.png';

// Constants
const DEFAULT_LOCATION = { lat: 24.861148924525455, lng: 67.05403384973215 };//24.861148924525455, 67.05403384973215
const MAP_OPTIONS = {
  zoom: 16,
  mapTypeId: "satellite",
  // mapTypeId: 'roadmap',
  mapTypeControl: false,
  streetViewControl: false,
  fullscreenControl: false,
  // zoomControl: false,
  gestureHandling: 'cooperative',
  styles: [{ featureType: "poi", elementType: "labels", stylers: [{ visibility: "off" }] }]
};

const MARKER_CONFIG = {
  scaledSize: [25, 35],
  anchor: [12.5, 35],
  origin: [0, 0]
};

const DEVICE_METRICS = [
  { key: 'temperature', label: 'Temperature' },
  { key: 'humidity', label: 'Humidity' },
  { key: 'wind', label: 'Wind Speed' },
  {
    key: 'gas',
    label: 'Gas Level',
    isChip: true,
    getColor: (value) => ({
      'Normal': 'success',
      'High': 'error',
      'Low': 'warning'
    }[value] || 'default')
  }
];


// Utility functions
const getLocation = (device) => {
  // console.log("device in get location", device)
  return ({
    lat: Number(device?.current_location?._lat) || DEFAULT_LOCATION.lat,
    lng: Number(device?.current_location?._lang) || DEFAULT_LOCATION.lng
  })
};

const createInfoWindow = (device) => {
  console.log("")
  return `
  <div style="text-align: center; width:"100%"; margin:auto">
      <div style="font-size: 14px; font-weight: 600; color: #1976d2; margin-bottom: 4px; text-align: center;">
        ${device.name}
      </div>
      <div style="padding-left: 2px; font-size: 12px; color: #1976d2; text-align: center; font-weight: 300;" >
        ${device?.current_location?.lat?.toFixed(4)}, ${device?.current_location?.long?.toFixed(4)}
      </div>
  </div>
`};

// Components
const StatusChip = memo(({ status }) => (
  <Chip
    label={status}
    color={status === 'active' ? 'success' : 'error'}
    size="small"
    sx={{ fontWeight: 500 }}
  />
));

const MetricDisplay = memo(({ metric, value }) => {
  if (metric.isChip) {
    return (
      <Chip
        label={value}
        color={metric.getColor(value)}
        size="small"
        sx={{ fontSize: '0.75rem' }}
      />
    );
  }
  return <Typography sx={{ fontSize: '0.875rem' }}>{value}</Typography>;
});

const DeviceMap = memo(({ device, option = true }) => {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markerRef = useRef(null);
  const infoWindowRef = useRef(null); // Define the ref for InfoWindow

  useEffect(() => {
    if (!window.google || !mapRef.current || !device) return;

    const location = getLocation(device);
    // console.log("mapRef.current", mapRef.current)
    mapInstanceRef.current = new window.google.maps.Map(mapRef.current, { ...MAP_OPTIONS, center: location, zoomControl: option });
    // console.log("mapInstanceRef.current", mapInstanceRef.current)

    markerRef.current = new window.google.maps.Marker({
      position: location,
      map: mapInstanceRef.current,
      title: `${device.id}`,
      optimized: true,
      icon: {
        url: markerIcon,
        scaledSize: new window.google.maps.Size(...MARKER_CONFIG.scaledSize),
        anchor: new window.google.maps.Point(...MARKER_CONFIG.anchor),
        origin: new window.google.maps.Point(...MARKER_CONFIG.origin)
      }
    });

    infoWindowRef.current = new window.google.maps.InfoWindow({
      content: createInfoWindow(device),
      // maxWidth: 200
    });

    markerRef.current.addListener('click', () => {
      if (infoWindowRef.current.getMap()) {
        infoWindowRef.current.close(); // Close if already open
      } else {
        infoWindowRef.current.open(mapInstanceRef.current, markerRef.current); // Open if closed
      }
    });

    return () => {
      markerRef.current?.setMap(null);
      infoWindowRef.current?.close();
    };
  }, [device]);

  return (
    <>
      <style>
        {`
          .gm-style-iw button {
            display: none !important;
          }
          .gm-style-iw {
            padding: 2px !important;
          }
        `}
      </style>
      <div ref={mapRef} className="device-map" style={{
        width: '100%',
        height: '300px',
        borderRadius: '8px 8px 0 0',
        boxShadow: 'inset 0 -2px 4px rgba(0,0,0,0.1)'
      }} />
    </>
  );
});

const DeviceDetails = memo(({ device }) => (
  <Box sx={{ display: 'grid', gap: 1.5 }}>
    <Typography variant="h6" sx={{ fontSize: '1.2rem', fontWeight: 600, color: 'primary.main' }}>
      {device.name}
    </Typography>

    {/* <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
      <Typography sx={{ fontWeight: 600, fontSize: '0.875rem' }}>Status:</Typography>
      <StatusChip status={device.status} />
    </Box> */}

    <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 1.5 }}>
      {DEVICE_METRICS.map(metric => (
        <Box key={metric.key}>
          <Typography sx={{ fontWeight: 600, fontSize: '0.875rem' }}>{metric.label}</Typography>
          <MetricDisplay metric={metric} value={device[metric.key]} />
        </Box>
      ))}
    </Box>
  </Box>
));

const DeviceContainer = memo(({ device }) => (
  <Card sx={{
    width: '100%',
    maxWidth: '300px',
    borderRadius: 2,
    overflow: 'hidden',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    transition: 'all 0.2s',
    '&:hover': {
      transform: 'translateY(-2px)',
      boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
    }
  }}>
    <DeviceMap device={device} option={false} />
    <CardContent sx={{ p: 1.5 }}>
      <DeviceDetails device={device} />
    </CardContent>
  </Card>
));

const DeviceGrid = ({ devices }) => {
  // const displayDevices = devices;

  return (
    <Box sx={{
      display: 'grid',
      gridTemplateColumns: {
        xs: '1fr',
        sm: 'repeat(2, 1fr)',
        md: 'repeat(3, 1fr)',
        lg: 'repeat(4, 1fr)'
      },
      gap: 2,
      p: 2,
      justifyItems: 'center'
    }}>
      {devices?.length ? devices.map((device, index) => (
        <DeviceContainer key={device.id || index} device={device} />
      )) : (
        <Box sx={{ p: 2, textAlign: 'center', color: 'text.secondary' }}>
          No devices available
        </Box>
      )}
    </Box>
  );
};
export default memo(DeviceGrid);
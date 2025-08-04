import React, { useEffect, useState, useRef } from 'react';
import { Box, Typography, Alert } from '@mui/material';
import { deviceService } from '../services/deviceServices';
import markerIcon from '../assets/marker.png';
import { useSelector } from 'react-redux';

const MapComponent = () => {
    // const [devices, setDevices] = useState([]);
    const { data: devices } = useSelector(state => state.device);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const mapRef = useRef(null);
    const markersRef = useRef([]);
    const infoWindowsRef = useRef([]);

    const defaultCenter = { lat: 24.861148924525455, lng: 67.05403384973215 };////24.861148924525455, 67.05403384973215

    useEffect(() => {
        if (!window.google || !mapRef.current) return;

        try {
            
            // Initialize map
            const map = new window.google.maps.Map(mapRef.current, {
                center: defaultCenter,
                zoom: 14,
                styles: [
                    {
                        featureType: "poi",
                        elementType: "labels",
                        stylers: [{ visibility: "off" }]
                    }
                ],
                mapTypeId: "satellite",
                mapTypeControl: false,
                streetViewControl: false,
            });

            // Clear existing markers and infoWindows
            markersRef.current.forEach(marker => marker?.setMap(null));
            infoWindowsRef.current.forEach(infoWindow => infoWindow?.close());
            markersRef.current = [];
            infoWindowsRef.current = [];

            // Add markers for devices
            devices.forEach((device, index) => {
                // console.log("device...", device)
                if (device?.current_location?._lat && device?.current_location?._long) {
                    // Create marker
                    const marker = new window.google.maps.Marker({
                        position: { lat: device?.current_location?._lat, lng: device?.current_location?._long },
                        map,
                        title: `Device ${device.objectId || device.id}`,
                        icon: {
                            url: markerIcon, // Replace with your marker icon
                            scaledSize: new window.google.maps.Size(20, 40),
                            anchor: new window.google.maps.Point(10, 40)
                        }
                    });

                    // Create info window content
                    const contentString = `
                        <div style="padding: 10px;">
                            <h3 style="margin: 0 0 10px 0;">${device.objectId || device.name}</h3>
                            ${device.temperature ? `<p style="margin: 5px 0;">Temperature: ${device.temperature}</p>` : ''}
                            ${device.humidity ? `<p style="margin: 5px 0;">Humidity: ${device.humidity}</p>` : ''}
                        </div>
                    `;

                    // Create info window
                    const infoWindow = new window.google.maps.InfoWindow({
                        content: contentString
                    });

                    // Add click listener
                    marker.addListener('click', () => {
                        // Close all other info windows
                        infoWindowsRef.current.forEach(window => window?.close());
                        infoWindow.open(map, marker);
                    });

                    // Store references
                    markersRef.current.push(marker);
                    infoWindowsRef.current.push(infoWindow);
                }
            });
        } catch (err) {
            console.error('Error initializing map:', err);
            setError('Unable to initialize map. Please try again later.');
        }
    }, [devices]);

    if (error) {
        return (
            <Alert severity="error" sx={{ mb: 2 }}>
                {error}
            </Alert>
        );
    }

    return (
        <Box
            ref={mapRef}
            sx={{
                height: "300px",
                width: "100%",
                borderRadius: 4,
                overflow: 'hidden',
                position: 'relative'
            }}
        />
    );
};

export default MapComponent;


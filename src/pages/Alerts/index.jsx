// import React, { useEffect, useState } from 'react';
// import MiniDrawer from '../../components/MiniDrawer';
// import ControledDataGrid from '../../components/ControledDataGrid';
// import { Box, Button, Chip, LinearProgress, Typography } from '@mui/material';
// import { useSnackbar } from 'notistack';
// import { useDispatch, useSelector } from 'react-redux';
// import { fetchDevices, createDevice, deleteDevice, updateDevice, fetchMyDevices } from '../../features/Slicers/deviceSlice';
// import { formattedDate } from '../../utils/helperFunctions';
// import { fetchAllAlerts } from '../../features/Slicers/alertSlice';


// export const Alerts = () => {

//     const entity = 'Alert';

//     const {  alerts, loading, error } = useSelector((state) => state.alert);

//     const { enqueueSnackbar } = useSnackbar();
//     const dispatch = useDispatch();

//     React.useEffect(() => {
//         dispatch(fetchAllAlerts());
//       }, []);

//     const columns = [
//         { field: 'name', headerName: 'Device Name', flex: 1 },
//         { field: 'type', headerName: 'Type', width: 200, headerAlign: 'center', align: 'center', },
//         {
//             field: 'created_at', headerName: 'Created At', width: 200, headerAlign: 'center', align: 'center',
//             renderCell: (params) => {
//                 return (
//                     <span>{formattedDate(params.row.created_at)}</span>
//                 );
//             }
//         },
//         { field: 'acknowledge', headerName: 'Acknowledge', width: 200, headerAlign: 'center', align: 'center', },
//         {
//             field: 'acknowledge_at', headerName: 'Acknowledge At', width: 200, headerAlign: 'center', align: 'center',
//             renderCell: (params) => {
//                 return (
//                     <span>{formattedDate(params.row.acknowledge_at)}</span>
//                 );
//             }
//         },
//     ];

//     return (
//         <MiniDrawer>
//             <Box sx={{ display: 'flex', justifyContent: "space-between", alignItems: 'center' }}>
//                 <Typography variant='h4' sx={{ fontWeight: 700, my: 2 }}>Alerts</Typography>
//             </Box>
//             {alerts && <ControledDataGrid entity={'Alerts'} tableData={alerts} columns={columns} action={false} />}
//         </MiniDrawer>
//     );
// };


import React, { useEffect, useState } from 'react';
import MiniDrawer from '../../components/MiniDrawer';
import ControledDataGrid from '../../components/ControledDataGrid';
import {
    Box,
    Typography,
    TextField,
    MenuItem,
    Grid,
    Button
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllAlerts } from '../../features/Slicers/alertSlice';
import { formattedDate } from '../../utils/helperFunctions';

export const Alerts = () => {
    const dispatch = useDispatch();
    const { alerts, loading } = useSelector((state) => state.alert);

    const [filters, setFilters] = useState({
        type: '',
        from: '',
        to: ''
    });

    // // Fetch all alerts on first render
    // useEffect(() => {
    //     dispatch(fetchAllAlerts({}));
    // }, [dispatch]);

    // const handleSearch = () => {
    //     dispatch(fetchAllAlerts(filters));
    // };

    // Fetch all alerts on first render
    useEffect(() => {
        dispatch(fetchAllAlerts([])); // Fetch all alerts with no filters initially
        console.log("alerts", alerts)
    }, [dispatch]);

    const handleSearch = () => {
        // Create an array of filter conditions
        const filterConditions = [];

        // Add type filter
        if (filters.type != "") {
            filterConditions.push({
                field: 'type',
                operator: '==',
                value: filters.type
            });
        }

        // Add from date filter
        if (filters.from != "") {
            filterConditions.push({
                field: 'created_at',
                operator: '>=',
                value: getTimestamp(new Date(filters.from)) // Convert to ISO string
            });
        }

        // Add to date filter
        if (filters.to != "") {
            filterConditions.push({
                field: 'created_at',
                operator: '<=',
                value: getTimestamp(new Date(filters.to)) // Convert to ISO string
            });
        }

        // Dispatch the fetch action with the filters
        dispatch(fetchAllAlerts(filterConditions));
    };

    // Extract unique alert types for dropdown
    const alertTypes = [...new Set(alerts?.map(alert => alert.type))].filter(Boolean);

    const columns = [
        { field: 'id', headerName: 'ID',  width: 50 },
        { field: 'name', headerName: 'Device Name', flex: 1 },
        { field: 'type', headerName: 'Type', width: 200, headerAlign: 'center', align: 'center' },
        {
            field: 'created_at',
            headerName: 'Created At',
            width: 200,
            headerAlign: 'center',
            align: 'center',
            renderCell: (params) => (
                <span>{formattedDate(params.row.created_at)}</span>
            )
        },
        {
            field: 'acknowledge',
            headerName: 'Acknowledge',
            width: 200,
            headerAlign: 'center',
            align: 'center'
        },
        {
            field: 'acknowledge_at',
            headerName: 'Acknowledge At',
            width: 200,
            headerAlign: 'center',
            align: 'center',
            renderCell: (params) => (
                <span>{formattedDate(params.row.acknowledge_at)}</span>
            )
        },
    ];

    return (
        <MiniDrawer>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant='h4' sx={{ fontWeight: 700, my: 2 }}>Alerts</Typography>
            </Box>

            {/* Filter Section */}
            <Box sx={{ mb: 2 }}>
                <Grid container spacing={2}>
                    <Grid item xs={12} md={3}>
                        <TextField
                            select
                            label="Type"
                            value={filters.type}
                            onChange={(e) => setFilters({ ...filters, type: e.target.value })}
                            fullWidth
                        >
                            <MenuItem value="">All</MenuItem>
                            <MenuItem value="radius">Radius</MenuItem>
                            <MenuItem value="wind">Wind</MenuItem>
                            <MenuItem value="humidity">Humidity</MenuItem>
                            <MenuItem value="temperature">Temperature</MenuItem>
                        </TextField>
                    </Grid>
                    <Grid item xs={12} md={3}>
                        <TextField
                            type="date"
                            label="From"
                            InputLabelProps={{ shrink: true }}
                            value={filters.from}
                            onChange={(e) => setFilters({ ...filters, from: e.target.value })}
                            fullWidth
                        />
                    </Grid>
                    <Grid item xs={12} md={3}>
                        <TextField
                            type="date"
                            label="To"
                            InputLabelProps={{ shrink: true }}
                            value={filters.to}
                            onChange={(e) => setFilters({ ...filters, to: e.target.value })}
                            fullWidth
                        />
                    </Grid>
                    <Grid item xs={12} md={3}>
                        <Button
                            variant="contained"
                            color="primary"
                            fullWidth
                            sx={{ height: '100%' }}
                            onClick={handleSearch}
                        >
                            Search
                        </Button>
                    </Grid>
                </Grid>
            </Box>

            {/* Data Table */}
            {alerts && (
                <ControledDataGrid
                    entity={'Alerts'}
                    tableData={alerts}
                    columns={columns}
                    action={false}
                />
            )}
        </MiniDrawer>
    );
};

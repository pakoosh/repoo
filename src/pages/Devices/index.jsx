import React, { useEffect, useState } from 'react';
import MiniDrawer from '../../components/MiniDrawer';
import ControledDataGrid from '../../components/ControledDataGrid';
import { Box, Button, Chip, LinearProgress, Typography } from '@mui/material';
import ScrollDialog from '../../components/Dialog';
import { camelToSentenceCase } from '../../utils/helperFunctions';
import RefreshIcon from '@mui/icons-material/Refresh';
import { useSnackbar } from 'notistack';
import { useDispatch, useSelector } from 'react-redux';
import { fetchDevices, createDevice, deleteDevice, updateDevice, fetchMyDevices } from '../../features/Slicers/deviceSlice';
import AddAndEditForm from './components/AddAndEditForm';
// import { hasActionPermission } from '../../utils/PermissionHelpers';

export const Devices = () => {

    const dispatch = useDispatch();
    const { data: devices, loading, error } = useSelector(state => state.device);
    const { permissions } = useSelector((state) => state.auth);

    const entity = 'Device';

    const [modalOpen, setModalOpen] = useState(false);
    const [data, setData] = useState(null);

    const { enqueueSnackbar } = useSnackbar();

    const handleOpenModal = () => {
        setModalOpen(true);
    };

    const handleCloseModal = () => {
        setModalOpen(false);
        setData(null);
    };

    const handleEditClick = async (rowData) => {
        setData(rowData);
        handleOpenModal();
    };

    const handleDeleteClick = async (rowId) => {
        if (rowId !== "") {
            if (confirm(`This ${entity} will be permanently deleted?`)) {
                const response = await dispatch(deleteDevice(rowId));
                console.log("Deleting Device: ", response);
                if (response.meta.requestStatus === 'fulfilled') {
                    enqueueSnackbar(`${entity} Deleted Successfully`, { variant: 'success' });
                } else {
                    const errorMessage = response.payload || response.error?.message || 'Something went wrong!';
                    enqueueSnackbar(errorMessage, { variant: 'error' });
                }
            }
        }
    };

    const handleSubmitForm = async (DeviceData) => {
        console.log("DeviceData", DeviceData);
        if (DeviceData.id) {
            console.log("updating DeviceData ...");
            const response = await dispatch(updateDevice(DeviceData));

            if (response.meta.requestStatus === 'fulfilled') {
                handleCloseModal();
                enqueueSnackbar(`${entity} Updated Successfully!`, { variant: 'success' });
            } else {
                const errorMessage = response.payload || response.error?.message || 'Something went wrong!';
                enqueueSnackbar(errorMessage, { variant: 'error' });
            }
        } else {
            const { id, ...DeviceDataWithoutId } = DeviceData;
            const response = await dispatch(createDevice(DeviceDataWithoutId));

            if (response.meta.requestStatus === 'fulfilled') {
                handleCloseModal();
                enqueueSnackbar(`${entity} Added Successfully!`, { variant: 'success' });
            } else {
                const errorMessage = response.payload || response.error?.message || 'Something went wrong!';
                enqueueSnackbar(errorMessage, { variant: 'error' });
            }
        }
    };

    useEffect(() => {
        dispatch(fetchDevices());
        console.log("devices", devices);
        // dispatch(fetchMyDevices());
    }, [dispatch]);

    const columns = [
        { field: 'name', headerName: 'Device Name', flex: 1 },
        { field: 'temperature_threshold', headerName: 'Temperature Threshold', width: 200, headerAlign: 'center', align: 'center', },
        { field: 'wind_threshold', headerName: 'Wind Threshold', width: 200, headerAlign: 'center', align: 'center', },
        { field: 'humidity_threshold', headerName: 'Humidity Threshold', width: 200, headerAlign: 'center', align: 'center', },
        { field: 'radius_threshold', headerName: 'Radius Threshold', width: 150, headerAlign: 'center', align: 'center' },
    ];

    const data_columns = [
        { field: 'name', headerName: 'Device Name', flex: 1 },
        { field: 'temperature', headerName: 'Temperature', width: 200, headerAlign: 'center', align: 'center', },
        { field: 'wind', headerName: 'Wind', width: 200, headerAlign: 'center', align: 'center', },
        { field: 'humidity', headerName: 'Humidity', width: 200, headerAlign: 'center', align: 'center', },
        { field: 'gas', headerName: 'Gas', width: 150, headerAlign: 'center', align: 'center' },
    ];

    return (
        <MiniDrawer>
            <Typography variant='h4' sx={{ fontWeight: 700, my: 2 }}>Devices Data</Typography>
            {devices && <ControledDataGrid entity={'Device'} tableData={devices} columns={data_columns} action={false} />}
            
            <Box sx={{ display: 'flex', justifyContent: "space-between", alignItems: 'center' }}>
                <Typography variant='h4' sx={{ fontWeight: 700, my: 2 }}>Devices</Typography>
                <Box>
                    <ScrollDialog title={"Device"} form={<AddAndEditForm submitHandler={handleSubmitForm} data={data} />} data={data} modalOpen={modalOpen} handleOpenModal={handleOpenModal} handleCloseModal={handleCloseModal} btn={true} />
                </Box>
            </Box>
            
            {devices && <ControledDataGrid entity={'Device'} tableData={devices} columns={columns} handleEditClick={handleEditClick} handleDeleteClick={handleDeleteClick} action={true} />}
        </MiniDrawer>
    );
};

import * as React from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import Button from '@mui/material/Button';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import MailIcon from '@mui/icons-material/Mail';
import { Typography } from '@mui/material';
import ErrorIcon from '@mui/icons-material/Error';
import { useDispatch, useSelector } from 'react-redux';
import { formatDate, formattedDate } from '../utils/helperFunctions';
// import { updateAlertStatus } from '../features/Slicers/alertSlice';
import { useSnackbar } from 'notistack';
import { fnAcknowledgeAlert } from '../features/Slicers/alertSlice';
import { triggerAlarm } from '../features/Slicers/alarmSlice';

export default function Alertbar({ openAlertDrawer }) {
    const dispatch = useDispatch();
    const alerts = useSelector((state) => state.alert);
    // const { alerts, loading, error } = useSelector((state) => state.alert);
    // const alertsCount = useSelector((state) => state.alertsCount);
    
    const alertsData = alerts.data.length > 0 ? alerts.data.filter(alert => alert.acknowledge == false) : [];
    
    // if (alertsData.length > 0) {
    //     dispatch(triggerAlarm());
    // }
    const { enqueueSnackbar } = useSnackbar();

    const handleUpdateAlert = async (alert) => {
        const resultAction = await dispatch(fnAcknowledgeAlert(alert));
        console.log("resultAction", resultAction)
        if (resultAction.meta.requestStatus == 'fulfilled') {
            enqueueSnackbar(`${resultAction.payload.ObjectId} Alert Acknowledged successfully!`, { variant: 'success' });
        } else {
            enqueueSnackbar(resultAction.error.message || "An error occurred while updating the alert.", { variant: 'error' });
            const error = resultAction.error.message || "An error occurred while updating the alert.";
            // alert(error);
        }
    }


    const list = (anchor) => (
        <Box
            sx={{ width: anchor === 'top' || anchor === 'bottom' ? 'auto' : 400 }}
            role="presentation"
        >
            <List sx={{ mt: 7 }}>
                {alertsData.map((alert, index) => {
                    if (!alert.acknowledge) return (
                        <Box key={index}>
                            <ListItem disablePadding>
                                <ListItemButton>
                                    <ListItemIcon>
                                        <ErrorIcon fontSize='large' />
                                    </ListItemIcon>
                                    <ListItemText
                                        primary={alert.deviceId}
                                        secondary={
                                            <React.Fragment>
                                                <Typography
                                                    component="span"
                                                    variant="body2"
                                                    sx={{ color: 'text.primary' }}
                                                >
                                                    Alert
                                                </Typography>
                                                {" — " + alert.type + " - " + alert.name}
                                                <Typography
                                                    // component="span"
                                                    variant="caption"
                                                    sx={{ color: 'text.primary', display: 'block' }}
                                                >
                                                    {formattedDate(alert.created_at)}
                                                </Typography>
                                            </React.Fragment>
                                        }
                                    />
                                </ListItemButton>
                                {!alert.acknowledge && <Button
                                    variant="contained"
                                    color="primary"
                                    size='small'
                                    // disabled={loading}
                                    onClick={() => handleUpdateAlert(alert)}
                                    sx={{ mx: 1 }}
                                >
                                    Ack
                                </Button>}
                            </ListItem>
                            <Divider />
                        </Box>
                    )
                })}
            </List>
        </Box>
    );

    return (
        <div style={{ display: "flex", bottom: 0 }}>
            <React.Fragment >
                <Drawer
                    anchor={"right"}
                    open={openAlertDrawer}
                >
                    {list("right")}
                </Drawer>
            </React.Fragment>
        </div>
    );
}
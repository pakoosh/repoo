import * as React from 'react';
import { styled, useTheme } from '@mui/material/styles';
import { Box, Toolbar, List, CssBaseline, Typography, Divider, IconButton, ListItem, ListItemButton, ListItemIcon, ListItemText, Chip, Button, Badge } from '@mui/material';
import MuiDrawer from '@mui/material/Drawer';
import MuiAppBar from '@mui/material/AppBar';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import DynamicBreadcrumbs from './DynamicBreadcrumbs';
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import FullscreenExitIcon from '@mui/icons-material/FullscreenExit';
import { navItems } from '../constants/NaveItems';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/authContext';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { useDispatch, useSelector } from 'react-redux';
import Alertbar from './alertbar';
import ErrorIcon from '@mui/icons-material/Error';
import Logo from "../assets/logo.jpeg";
import { Footer } from './Footer';
import screenfull from "screenfull";
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import VolumeOffIcon from '@mui/icons-material/VolumeOff';
import AlertComponent from './Alarm';
import { toggleSound } from '../features/Slicers/alarmSlice';

const drawerWidth = 240;

const openedMixin = (theme) => ({
    width: drawerWidth,
    transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
    }),
    overflowX: 'hidden',
});

const closedMixin = (theme) => ({
    transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: 'hidden',
    width: `calc(${theme.spacing(7)} + 1px)`,
    [theme.breakpoints.up('sm')]: {
        width: `calc(${theme.spacing(8)} + 1px)`,
    },
});

const DrawerHeader = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
}));

const AppBar = styled(MuiAppBar, {
    shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    ...(open && {
        marginLeft: drawerWidth,
        width: `calc(100% - ${drawerWidth}px)`,
        transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
    }),
}));

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
    ({ theme, open }) => ({
        width: drawerWidth,
        flexShrink: 0,
        whiteSpace: 'nowrap',
        boxSizing: 'border-box',
        ...(open && {
            ...openedMixin(theme),
            '& .MuiDrawer-paper': openedMixin(theme),
        }),
        ...(!open && {
            ...closedMixin(theme),
            '& .MuiDrawer-paper': closedMixin(theme),
        }),
    }),
);

export default function MiniDrawer({ children }) {
    const navigate = useNavigate()
    const theme = useTheme();
    const [open, setOpen] = React.useState(false);
    const [openAlertDrawer, setOpenAlertDrawer] = React.useState(false);
    const user = useSelector((state) => state.user);
    const alertsCount = useSelector((state) => state.alert.alertsCount);

    const [isFullscreen, setIsFullscreen] = React.useState(true);

    const toggleFullscreen = () => {
        if (screenfull.isEnabled) {
            screenfull.toggle();
            setIsFullscreen(screenfull.isFullscreen);
        }
    };

    const isSoundOn = useSelector((state) => state.alarm.isSoundOn);
    const dispatch = useDispatch();

    const { logout } = useAuth();

    const handleDrawerOpen = () => {
        setOpen(true);
    };

    const handleDrawerClose = () => {
        setOpen(false);
    };
    const handleAlertDrawerToggle = () => {
        setOpenAlertDrawer(!openAlertDrawer);
    };

    return (
        <Box sx={{ display: 'flex', backgroundColor: "#fbfbfb" }}>
            <CssBaseline />
            <Alertbar openAlertDrawer={openAlertDrawer} />
            <AppBar position="fixed" open={open}>
                <Toolbar>
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        onClick={handleDrawerOpen}
                        edge="start"
                        sx={{
                            marginRight: 5,
                            ...(open && { display: 'none' }),
                        }}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
                        Sites Monitoring Portal
                    </Typography>

                    <IconButton sx={{ ml: 1 }} onClick={() => dispatch(toggleSound())} color="inherit">
                        {isSoundOn ? <VolumeUpIcon /> : <VolumeOffIcon />}
                    </IconButton>
                    <IconButton sx={{ ml: 1 }} onClick={toggleFullscreen} color="inherit">
                        {isFullscreen ? <FullscreenIcon /> : <FullscreenExitIcon />}
                    </IconButton>
                    <IconButton aria-label={50} color='#fff' onClick={handleAlertDrawerToggle} sx={{ mr: 1 }}>
                        <Badge badgeContent={alertsCount} color="warning">
                            <ErrorIcon sx={{ color: "#fff" }} />
                        </Badge>
                    </IconButton>
                    <Chip
                        label={user.user_name ? user.user_name : "user"}
                        icon={<AccountCircleIcon color='#fff' />}
                        sx={{ color: "#fff" }}
                    />
                    {/* <ModeToggle />
                    <IconButton sx={{ ml: 1 }} onClick={() => {
                        authService.logout();
                        logout();
                        navigate("/login");
                    }} color="inherit">
                        <LogoutIcon />
                    </IconButton> */}
                    {/* </Box> */}
                </Toolbar>
            </AppBar>
            <Drawer variant="permanent" open={open}>
                <DrawerHeader>
                    <Box style={{ width: "100%", display: "flex", justifyContent: "center" }} >
                        <img src={Logo} alt="logo" style={{ width: "150px", ...(!open && { display: 'none' }) }} />
                    </Box>
                    <IconButton onClick={handleDrawerClose} >
                        {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
                    </IconButton>
                </DrawerHeader>
                <Divider />
                <List>
                    {navItems.map((navItem, index) => (
                        <Link to={navItem.url} key={index} style={{ textDecoration: 'none', color: theme.palette.text.primary }}>
                            <ListItem disablePadding sx={{ display: 'block' }}>
                                <ListItemButton
                                    sx={{
                                        minHeight: 48,
                                        justifyContent: open ? 'initial' : 'center',
                                        px: 2.5,
                                    }}
                                >
                                    <ListItemIcon
                                        sx={{
                                            minWidth: 0,
                                            mr: open ? 3 : 'auto',
                                            justifyContent: 'center',
                                        }}
                                    >
                                        {<navItem.icon />}
                                    </ListItemIcon>
                                    <ListItemText primary={navItem.title} sx={{ opacity: open ? 1 : 0 }} />
                                </ListItemButton>
                            </ListItem>
                        </Link>
                    ))}
                </List>

                {/* <DynamicNavList/> */}

            </Drawer>
            <Box component="main" sx={{ minHeight: '100vh', display: 'flex', flexGrow: 1, flexDirection: 'column' }}>
                <DrawerHeader />
                <Box sx={{ p: 3, flexGrow: 1 }}>
                    <DynamicBreadcrumbs />
                    <AlertComponent />
                    {children}
                </Box>
                <Footer />
            </Box>
        </Box>
    );
}

import ShoppingCartCheckoutIcon from '@mui/icons-material/ShoppingCartCheckout';
import SettingsIcon from '@mui/icons-material/Settings';
import HomeIcon from '@mui/icons-material/Home';
import SpeakerPhoneIcon from '@mui/icons-material/SpeakerPhone';
import TapAndPlayIcon from '@mui/icons-material/TapAndPlay';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import ErrorIcon from '@mui/icons-material/Error';
import DashboardIcon from '@mui/icons-material/Dashboard';
import NotificationImportantIcon from '@mui/icons-material/NotificationImportant';

export const navItems = [
    // { title: 'Home', icon: HomeIcon, url: "/" },
    // { title: 'Alerts', icon: ErrorIcon, url: "/alerts" },
    { title: 'Dashboard', icon: DashboardIcon, url: "/dashboard" },
    // { title: 'Manage Devices', icon: SpeakerPhoneIcon,
    { title: 'Devices', icon: SpeakerPhoneIcon, url: "/devices" },
    { title: 'Alerts', icon: NotificationImportantIcon, url: "/alerts" },
    // { title: 'Devices', icon: SpeakerPhoneIcon, url: "/manage-devices/devices" },
    // { title: 'Devices Logs', icon: TapAndPlayIcon, url: "/manage-devices/devices-logs" },
    // { title: 'Users', icon: PeopleAltIcon, url: "/users" },
    // { title: 'Settings', icon: SettingsIcon, url: "/settings" }
];

// export const navItems = [
//     { title: 'Home', icon: HomeIcon, url: "/" },
//     {
//       title: 'Manage Devices', icon: SpeakerPhoneIcon, children: [
//         { title: 'Devices', icon: SpeakerPhoneIcon, url: "/manage-devices/devices" },
//         { title: 'Devices Logs', icon: TapAndPlayIcon, url: "/manage-devices/devices-logs" }
//       ]
//     },
//     { title: 'Settings', icon: SettingsIcon, url: "/settings" }
//   ];
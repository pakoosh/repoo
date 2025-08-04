import { fetchApi } from "./utils";

export const deviceLogsService = {
    getDeviceLogs: async () => {
        try {
            const res = await fetchApi("device-log", "GET"); 
            return res;
        } catch (error) {
            return error;
        }
    },
    getDeviceAlerts: async () => {
        try {
            const res = await fetchApi("device-alerts", "GET"); 
            return res;
        } catch (error) {
            return error;
        }
    },
    getDevicesMACs: async () => {
        try {
            const res = await fetchApi("device-log/macs", "GET"); 
            return res;
        } catch (error) {
            return error;
        }
    },
    // updateUser: async (phone, email, fullname, gender) => {
    //     try {
    //         const res = await fetchApi("user", "PUT", {
    //             fullname: fullname,
    //             gender: gender,
    //             email: email,
    //             phone: phone,
    //         });
    //         return res;
    //     } catch (error) {
    //         return error;
    //     }
    // }
}
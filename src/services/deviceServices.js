import { get, getAll } from "./repository";
import { fetchApi } from "./utils";

export const deviceService = {
    // getDevices: async () => {
    //     try {
    //         // const res = await fetchApi("devices", "GET");
    //         const res = await getAll("Devices");
    //         console.log("res", res);
    //         return res
    //         return [
    //             {
    //                 id: 1,
    //                 status: "active",
    //                 lat: 0.5464,
    //                 long: 0.6878764,
    //                 temperature: "25°C",
    //                 humidity: "60%",
    //                 gasDetection: "Normal",
    //                 windSpeed: "15 km/h"
    //             },
    //             {
    //                 id: 2,
    //                 status: "inactive",
    //                 lat: 0.05845,
    //                 long: 0.36644,
    //                 temperature: "28°C",
    //                 humidity: "55%",
    //                 gasDetection: "High",
    //                 windSpeed: "10 km/h"
    //             },
    //             {
    //                 id: 3,
    //                 status: "active",
    //                 lat: 0.05845,
    //                 long: 0.36644,
    //                 temperature: "24°C",
    //                 humidity: "70%",
    //                 gasDetection: "Low",
    //                 windSpeed: "20 km/h"
    //             },
    //             {
    //                 id: 4,
    //                 status: "active",
    //                 lat: 0.5464,
    //                 long: 0.6878764,
    //                 temperature: "26°C",
    //                 humidity: "65%",
    //                 gasDetection: "Normal",
    //                 windSpeed: "12 km/h"
    //             }
    //         ];
    //     } catch (error) {
    //         return error;
    //     }
    // },
    getDevicesIPs: async () => {
        try {
            const res = await fetchApi("devices/ips", "GET");
            return res;
        } catch (error) {
            return error;
        }
    },
    getDevicesWithLog: async () => {
        try {
            const res = await fetchApi("devices/with-log", "GET");
            return res;
        } catch (error) {
            return error;
        }
    },
    updateDevices: async (_id, deviceData) => {
        try {
            const res = await fetchApi("devices/" + _id, "PUT", {
                name: deviceData.name,
                ip: deviceData.ip,
                port: deviceData.port,
                mac: deviceData.mac,
                Longitude: deviceData.Longitude,
                Latitude: deviceData.Latitude
            });
            return res;
        } catch (error) {
            return error;
        }
    },
    createDevice: async (name, ip, port, mac, Longitude, Latitude) => {
        try {
            const res = await fetchApi("devices", "POST", {
                name: name,
                ip: ip,
                port: port,
                mac: mac,
                Longitude: Longitude,
                Latitude: Latitude
            });
            return res;
        } catch (error) {
            return error;
        }
    },
    deleteDevices: async (_id) => {
        try {
            const res = await fetchApi("devices/" + _id, "DELETE");
            return res;
        } catch (error) {
            return error;
        }
    },
}

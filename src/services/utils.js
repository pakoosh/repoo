import axios from "axios";
//import { useAuth } from "../contexts/authContext";

const BASE_URL = `${import.meta.env.VITE_BACKEND_URL}`;

export const fetchApi = async (endpoint, method, body, headers) => {
    try {
        //const { token } = useAuth();
        // const token = localStorage.getItem("token");

        const combinedHeaders = {
            "Content-Type": "application/json",
            Accept: "application/json",
            // Authorization: token ? `Bearer ${token}` : "",
            ...headers,
        };

        const response = await axios({
            method: method,
            url: `${BASE_URL}${endpoint}`,
            headers: combinedHeaders,
            data: body,
        });
        // console.log("response",response);
        return response.data;
    } catch (error) {
        return error;
    }
};

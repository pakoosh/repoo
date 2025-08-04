import { fetchApi } from "./utils";

export const userService = {
    getUsers: async () => {
        try {
            const res = await fetchApi("users", "GET");
            return res;
        } catch (error) {
            return error;
        }
    },
    updateUser: async (_id, data) => {
        try {
            const res = await fetchApi("users/" + _id, "PUT", {
                name: data.name,
                email: data.email,
                username: data.username,
                number: data.number,
                role: data.role
            });
            return res;
        } catch (error) {
            return error;
        }
    },
    createUser: async (name, email, username, number, role) => {
        try {
            const res = await fetchApi("users", "POST", {
                name: name,
                email: email,
                username: username,
                number: number,
                role: role
            });

            return res;
        } catch (error) {
            return error;
        }
    },
    deleteUsers: async (_id) => {
        try {
            const res = await fetchApi("users/" + _id, "DELETE");
            return res;
        } catch (error) {
            return error;
        }
    },
}

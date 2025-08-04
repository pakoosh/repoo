import React, { useEffect, useState } from 'react';
import MiniDrawer from '../components/MiniDrawer';
import ControledDataGrid from '../components/ControledDataGrid';
import { Box, Button, Grid, Modal, TextField, Typography, MenuItem } from '@mui/material';
import ScrollDialog from '../components/Dialog';
import { userService } from '../services/userServices';
import { convertUtcToLocal } from '../utils/helperFunctions';
import RefreshIcon from '@mui/icons-material/Refresh';

export const Users = () => {
    const [users, setUsers] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [data, setData] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');

    const handleOpenModal = () => {
        setModalOpen(true);
    };

    const handleCloseModal = () => {
        setModalOpen(false);
        setData(null);
    };

    const handleEditClick = async (rowData) => {
        // Implement edit logic here
        setData(rowData);
        handleOpenModal();
        console.log('Edit clicked:', rowData);
    };

    const handleDeleteClick = async (rowId) => {
        console.log('Delete clicked:', rowId);
        if (rowId !== "") {
            if (confirm("This User will be permanently deleted?")) {
                const response = await userService.deleteUsers(rowId);
                if (response) {
                    alert("User Deleted Successfully");
                    // Update the users state to reflect the deletion
                    setUsers((prevUsers) => prevUsers.filter(user => user._id !== rowId));
                }
                console.log(response);
            }
        }
    };

    const handleSubmitForm = async (userData) => {
        if (userData._id) {
            const response = await userService.updateUser(userData._id, userData);
            if (response._id) {
                setUsers((prevUsers) => prevUsers.map(user => user._id === userData._id ? response : user));
                handleCloseModal();
                alert("User Updated Successfully");
            } else {
                alert(response.response.data.message);
            }
        } else {
            const { _id, ...userDataWithoutId } = userData;
            const response = await userService.createUser(userDataWithoutId.name, userDataWithoutId.email, userDataWithoutId.username, userDataWithoutId.number, userDataWithoutId.role);
            if (response.status == 201) {
                // Update the users state to reflect the addition
                setUsers((prevUsers) => [...prevUsers, response]);
                handleCloseModal();
                alert("User Added Successfully");
            } else {
                alert(response.response.data.message);
            }
        }
    };

    const fetchUser = async () => {
        try {
            const response = await userService.getUsers();
            // console.log(response);
            setUsers(response);
        } catch (error) {
            console.error('Error fetching user:', error);
        }
    };

    useEffect(() => {
        fetchUser();
    }, []);

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    };

    const handleFilterChange = (e) => {
        setFilter(e.target.value);
    };

    const filteredUsers = users
        ? users
            .filter((user) => {
                const query = searchQuery.toLowerCase();
                // console.log("user", user);
                return (
                    user.name.toLowerCase().includes(query) ||
                    user.email.toLowerCase().includes(query) ||
                    user.username.toLowerCase().includes(query)
                );
            })
        : [];

    const columns = [
        { field: 'name', headerName: 'Name', width: 210 },
        { field: 'email', headerName: 'Email', width: 210 },
        { field: 'username', headerName: 'Username', width: 180 },
        { field: 'number', headerName: 'Number', width: 180 },
        { field: 'role', headerName: 'Role', width: 180, editable: false },
        {
            field: 'created_at', headerName: 'Created at', width: 200,
            valueFormatter: (params) => {
                return convertUtcToLocal(params);
            }
        },
    ];

    return (
        <MiniDrawer>
            <h1>Users</h1>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                    <ScrollDialog title={"User"} form={<Form submitHandler={handleSubmitForm} data={data} />} data={data} modalOpen={modalOpen} handleOpenModal={handleOpenModal} handleCloseModal={handleCloseModal} />
                    <Button sx={{ mb: 2, mx: 1 }} onClick={fetchUser} variant="contained" startIcon={<RefreshIcon />}>Refresh</Button>
                </Box>
                <TextField
                    id="search"
                    label="Search"
                    variant="outlined"
                    size="small"
                    value={searchQuery}
                    onChange={handleSearchChange}
                />
            </Box>

            {/* {users && <ControledDataGrid tableData={users} columns={columns} handleEditClick={handleEditClick} handleDeleteClick={handleDeleteClick} action={true} />} */}
            {users && <ControledDataGrid tableData={filteredUsers} columns={columns} handleEditClick={handleEditClick} handleDeleteClick={handleDeleteClick} action={true} />}
        </MiniDrawer>
    );
};



const Form = ({ submitHandler, data }) => {
    const [formValues, setFormValues] = useState({
        _id: '',
        name: '',
        email: '',
        username: '',
        number: '',
        role: ''
    });

    useEffect(() => {
        if (data) {
            setFormValues(data);
        }
    }, [data]);

    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormValues({ ...formValues, [id]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        submitHandler(formValues);
    };

    return (
        <Box
            component="form"
            sx={{
                '& > :not(style)': { my: 1, width: '100%' },
            }}
            noValidate
            autoComplete="off"
            onSubmit={handleSubmit}
        >
            <TextField id="_id" label="ID" variant="outlined" size="small" fullWidth value={formValues._id} onChange={handleChange} sx={{ display: "none" }} />
            <TextField id="name" label="Name" variant="outlined" size="small" fullWidth value={formValues.name} onChange={handleChange} />
            <TextField id="email" label="Email" variant="outlined" size="small" fullWidth value={formValues.email} onChange={handleChange} />
            <TextField id="username" label="Username" variant="outlined" size="small" fullWidth value={formValues.username} onChange={handleChange} />
            <TextField id="number" label="Number" variant="outlined" size="small" fullWidth value={formValues.number} onChange={handleChange} />
           
            <TextField
                id="role"
                select
                size="small"
                label="Role"
                sx={{ width: "100%", display: !data && "none"}}
                value={formValues.role}
                onChange={handleChange}
            >
                <MenuItem value="user">User</MenuItem>
                <MenuItem value="admin">Admin</MenuItem>
            </TextField>
            <Button type="submit" variant="contained" size="small" sx={{ mt: 2 }}>{data ? "Update" : "Add"}</Button>
        </Box>
    );
};

export default Form;
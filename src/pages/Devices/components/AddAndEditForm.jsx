import { Box, Button, CircularProgress, TextField } from "@mui/material";
import { useEffect, useState } from "react";
import { getGeoLocation } from "../../../services/repository";
import { useSelector } from "react-redux";

const AddAndEditForm = ({ submitHandler, data }) => {

    const { loading } = useSelector(state => state.device);

    const [formErrors, setFormErrors] = useState({});
    const [formValues, setFormValues] = useState({
        id: '',
        name: '',
        temperature: 0.0,
        wind: 0.0,
        humidity: 0.0,
        gas: false,
        temperature_threshold: 0.0,
        wind_threshold: 0.0,
        humidity_threshold: 0.0,
        radius_threshold: 0,
        actual_location: getGeoLocation(),
        current_location: getGeoLocation()
    });

    useEffect(() => {
        if (data) {
            console.log("data", data)
            setFormValues(data);
        }
    }, [data]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormValues((prevValues) => ({
            ...prevValues,
            [name]: value
        }));
    };

    const validate = () => {
        let errors = {};

        if (!formValues.name) errors.name = 'name is required';
        // if (!formValues.description) errors.description = 'Description is required';
        // if (!formValues.email) errors.email = 'Email is required';
        // if (!formValues.contact) errors.contact = 'Contact person is required';
        // if (!formValues.phone) errors.phone = 'Phone number is required';
        // if (!formValues.radius) errors.radius = 'Radius number is required';

        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validate()) {
            submitHandler(formValues);
        }
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
            <TextField id="id" label="ID" variant="outlined" size="small" fullWidth value={formValues.id} onChange={handleChange} sx={{ display: "none" }} />

            <TextField
                label="Name"
                name="name"
                variant="outlined"
                size="small"
                value={formValues.name}
                onChange={handleChange}
                error={!!formErrors.name}
                helperText={formErrors.name}
            />

            <TextField
                label="Temperature Threshold"
                name="temperature_threshold"
                variant="outlined"
                size="small"
                value={formValues.temperature_threshold}
                onChange={handleChange}
                error={!!formErrors.temperature_threshold}
                helperText={formErrors.temperature_threshold}
            />

            <TextField
                label="Wind Threshold"
                name="wind_threshold"
                variant="outlined"
                size="small"
                value={formValues.wind_threshold}
                onChange={handleChange}
                error={!!formErrors.wind_threshold}
                helperText={formErrors.wind_threshold}
            />

            <TextField
                label="Humidity Threshold"
                name="humidity_threshold"
                variant="outlined"
                size="small"
                value={formValues.humidity_threshold}
                onChange={handleChange}
                error={!!formErrors.humidity_threshold}
                helperText={formErrors.humidity_threshold}
            />

            <TextField
                label="Radius Threshold"
                name="radius_threshold"
                variant="outlined"
                size="small"
                value={formValues.radius_threshold}
                onChange={handleChange}
                error={!!formErrors.radius_threshold}
                helperText={formErrors.radius_threshold}
            />

            <Button type="submit" variant="contained" size="small" sx={{ mt: 2 }} disabled={loading}>
                {loading ? (
                    <CircularProgress size={20} color="inherit" />
                ) : (
                    data ? "Update" : "Add"
                )}

            </Button>
        </Box>
    );
};

export default AddAndEditForm;

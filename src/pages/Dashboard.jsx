import React, { useState } from "react";
import MiniDrawer from "../components/MiniDrawer";
import { Box, Grid, Typography, Card, CardContent, Table, TableBody, TableCell, TableHead, TableRow, TextField, MenuItem } from "@mui/material";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip } from "chart.js";
import Icon1 from '../assets/Icon1.png';
import Icon2 from '../assets/Icon2.png';
import ackIcon from '../assets/ack.png';
import resIcon from '../assets/icon3.png';
import MapComponent from '../components/MapComponent';
import AlertComponent from '../components/Alarm';
import DeviceGrid from '../components/DeviceGrid';
import { useSelector } from "react-redux";
ChartJS.register(ArcElement, Tooltip);

// const SummaryCard = ({ title, value, color, icon }) => (
//   <Card sx={{ padding: 1, borderRadius: "20px", boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)" }}>

//     <CardContent sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
//       <Box>
//         <Typography variant="h6" gutterBottom>{title}</Typography>
//         <Typography variant="h4" sx={{ color, fontWeight: "bold" }}>{value}</Typography>
//       </Box>
//       <img src={icon} alt={`${title} Icon`} style={{ width: 70, height: 70, marginLeft: "60px" }} />
//     </CardContent>
//   </Card>
// );

const SummaryCard = ({ title, value, color, icon }) => (
  <Card
    sx={{
      padding: 2,
      borderRadius: "20px",
      boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-start',
      justifyContent: 'space-between',
      '@media (min-width:600px)': {
        flexDirection: 'row', // On medium screens and above, use row layout
      },
    }}
  >
    <CardContent sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: '100%' }}>
      <Box sx={{ flex: 1 }}>
        <Typography variant="h6" gutterBottom sx={{ fontSize: { xs: '1.2rem', sm: '1.2rem' } }}>
          {title}
        </Typography>
        <Typography
          variant="h4"
          sx={{ color, fontWeight: "bold", fontSize: { xs: '1.5rem', sm: '2rem' } }}
        >
          {value}
        </Typography>
      </Box>
      <img
        src={icon}
        alt={`${title} Icon`}
        style={{
          width: '50px',
          height: '50px',
          marginLeft: '20px',
          '@media (min-width:600px)': {
            width: '70px',
            height: '70px',
            marginLeft: '60px',
          },
        }}
      />
    </CardContent>
  </Card>
);

const DeviceList = ({ devices }) => (
  <Table>
    <TableHead>
      <TableRow>
        <TableCell>Device ID</TableCell>
        <TableCell>Name</TableCell>
        <TableCell>Temperature</TableCell>
        <TableCell>Humidity</TableCell>
        <TableCell>Wind Speed</TableCell>
        <TableCell>Gas Detection</TableCell>
      </TableRow>
    </TableHead>
    <TableBody>
      {devices?.map(device => (
        <TableRow key={device.id}>
          <TableCell>{device.id}</TableCell>
          <TableCell>{device.name}</TableCell>
          <TableCell>{device.temperature}</TableCell>
          <TableCell>{device.humidity}</TableCell>
          <TableCell>{device.wind}</TableCell>
          <TableCell>{device.gas}</TableCell>
        </TableRow>
      ))}
    </TableBody>
  </Table>
);

export default function Dashboard() {

  const { data: devices, loading, error } = useSelector(state => state.device);
  const [searchQuery, setSearchQuery] = useState('');
  const alerts = useSelector((state) => state.alert);
  const alertsCount = useSelector((state) => state.alert.alertsCount);
  const [filter, setFilter] = useState('all');

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleFilterChange = (event) => {
    setFilter(event.target.value);
  };

  return (
    <MiniDrawer>
      <Box>
        {/* <AlertComponent /> */}
        <Grid container spacing={3}>

          {/* {/* Summary Cards */}

          <Grid item xs={12} sm={6} md={3} >
            <SummaryCard title={"Total Devices"} value={devices ? devices.length : '---'} color={"#8583ff"} icon={Icon1} />
          </Grid>
          <Grid item xs={12} sm={6} md={3} >
            <SummaryCard title={"Total Alerts"} value={alerts ? alerts.data.length : '---'} color={"#fec94c"} icon={Icon2} />
          </Grid>
          <Grid item xs={12} sm={6} md={3} >
            <SummaryCard title={"Acknowledge Alerts"} value={alertsCount ? alerts.data.length - alertsCount : '---'} color={"#fec94c"} icon={Icon2} />
          </Grid>
          <Grid item xs={12} sm={6} md={3} >
            <SummaryCard title={"Not Acknolodge Alerts"} value={alerts ? alertsCount : '---'} color={"#fec94c"} icon={Icon2} />
          </Grid>

          {/* Map Section */}
          <Grid item xs={12}>
            <Card sx={{ padding: 1, borderRadius: "20px", boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)" }}>
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: "bold" }}>Device Map</Typography>
                <Box sx={{ height: 300 }}>
                  <MapComponent devices={devices} />
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Device Grid Section */}
          <Grid item xs={12}>
            <Card sx={{ padding: 1, borderRadius: "20px", boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)" }}>
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: "bold" }}>Device Details</Typography>
                <DeviceGrid devices={devices} />
              </CardContent>
            </Card>
          </Grid>

          {/* Device List */}
          <Grid item xs={12}>
            <Card sx={{ padding: 1, borderRadius: "20px", boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)" }}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h6" sx={{ fontWeight: "bold" }}>Device List</Typography>
                  <Box>
                    <TextField
                      id="search"
                      label="Search"
                      variant="outlined"
                      size="small"
                      value={searchQuery}
                      onChange={handleSearchChange}
                    />
                    <TextField
                      id="filter"
                      select
                      value={filter}
                      onChange={handleFilterChange}
                      size="small"
                      sx={{ ml: 2 }}
                    >
                      <MenuItem value="all">All</MenuItem>
                      <MenuItem value="true">acitve</MenuItem>
                      <MenuItem value="false">inactive</MenuItem>
                    </TextField>
                  </Box>
                </Box>
                <DeviceList devices={devices} />
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </MiniDrawer>
  );
}
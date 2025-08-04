import React, { useEffect, useState } from 'react'
import MiniDrawer from '../components/MiniDrawer';
import { Box, Divider, Grid, MenuItem, TextField, Typography } from '@mui/material';
import {  formatDate } from '../utils/helperFunctions';
import MapComponent from '../components/MapComponent';
import AlertComponent from '../components/Alarm';
import { useDispatch } from 'react-redux';

export const Home = () => {
  const dispatch = useDispatch();
  const { data: devices, loading, error } = useSelector(state => state.device);
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState('all');

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleFilterChange = (e) => {
    setFilter(e.target.value);
  };


  return (
    <MiniDrawer>
      <AlertComponent />
      <h1>MAP</h1>
      <Box sx={{ height: 500 }}>
        <MapComponent devices={devices} />
      </Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>Devices</h1>
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
            style={{ marginLeft: 10 }}
          >
            <MenuItem value="all">All</MenuItem>
            <MenuItem value="true">Connected</MenuItem>
            <MenuItem value="false">Disconnected</MenuItem>
          </TextField>
        </Box>
      </Box>

      {devices ? (
        <Grid container spacing={2}>
          {devices.length > 0 && devices.map((data, index) => {
            return (
              <Grid item xs={12} sm={6} md={4} lg={3} xl={3} key={index}>
                <DeviceCard data={data} />
              </Grid>
            )
          })}
        </Grid>
      ) : (
        'Loading...'
      )}
    </MiniDrawer>
  );
};

const DeviceCard = ({ data }) => {
  return <Box sx={style.card}>
    <Grid container spacing={2}>
      <Grid item xs={9}>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 700, my: 1 }}>
            {data.name}
          </Typography>
          <Typography variant="caption" display="block">
            ID: {data.objectId}
          </Typography>
          <Typography variant="caption" display="block">
            IMEI: {data.imei}
          </Typography>
          <Typography variant="caption" display="block">
            Gps Time: {formatDate(data.GpsTime)}
          </Typography>
          <Typography variant="caption" display="block">
            Y: {data.y}
          </Typography>
          <Typography variant="caption" display="block">
            X: {data.x}
          </Typography>
        </Box>
      </Grid>
      <Grid item xs={3}>
        <Box>
        </Box>
      </Grid>
    </Grid>

    <Divider sx={{ my: 1 }} />

  </Box>
}

const style = { card: { bgcolor: '#eceff1', p: 2, borderRadius: "15px" }, cardIcons: { display: "flex", alignItems: "center" } }

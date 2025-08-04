import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { add, getAll, getAllSelf, update, softDelete } from "../../services/repository";

//dummy data

function getRandomCoordinate(base, range) {
  return base + (Math.random() * range * 2 - range);
}

function generateDummyDevices() {
  const devices = [];
  const baseLatitude = 24.855584504137283;
  const baseLongitude = 67.05136258985002;
  const coordinateRange = 0.0005; // Minor displacement for realistic movement
  
  for (let i = 1; i <= 10; i++) {
      const deviceID = `Device${i}`;
      const temperature = (Math.random() * 10 + 20).toFixed(2);
      const gasDetection = Math.floor(Math.random() * 50).toString();
      const humidity = Math.floor(Math.random() * 50).toString();
      const windSpeed = Math.floor(Math.random() * 20).toString();
      const radius = "50";
      const updatedAt = new Date().toISOString();
      
      const actualLocation = {
          _lat: getRandomCoordinate(baseLatitude, coordinateRange),
          _long: getRandomCoordinate(baseLongitude, coordinateRange),
      };

      const currentLocation = {
          _lat: getRandomCoordinate(actualLocation._lat, coordinateRange),
          _long: getRandomCoordinate(actualLocation._long, coordinateRange),
      };

      devices.push({
          id: deviceID,
          updated_at: updatedAt,
          humidity,
          radius,
          deviceID,
          updated_by: null,
          actualLocation,
          windSpeed,
          currentLocation,
          temperature,
          is_updated: true,
          gasDetection,
      });
  }
  return devices;
}




// Fetch Devices
export const fetchDevices = createAsyncThunk(
  'Devices/fetchDevices',
  async (_, { rejectWithValue }) => {
    try {
      const response = await getAll("Devices");
      return response;
      // return generateDummyDevices();
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to fetch Devices');
    }
  }
);

// Fetch My Devices
export const fetchMyDevices = createAsyncThunk(
  'Devices/fetchMyDevices',
  async (_, { rejectWithValue }) => {
    try {
      const response = await getAllSelf("Devices");
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to fetch my Devices');
    }
  }
);

// Create Device
export const createDevice = createAsyncThunk(
  'Devices/createDevice',
  async (newDevice, { rejectWithValue }) => {
    try {
      const response = await add("Devices", { ...newDevice, paidAmount: 0 });
      return response;
    } catch (error) {
      return rejectWithValue(error || 'Failed to create company');
    }
  }
);

// Update Device
export const updateDevice = createAsyncThunk(
  'Devices/updateDevice',
  async (updatedDevice, { rejectWithValue }) => {
    try {
      console.log("updatedDevice", updatedDevice)
      // const { id, deleted_at, updated_at, ...DeviceData } = updatedDevice;
      const { id, created_at, deleted_at, updated_at, ...DeviceData } = updatedDevice;
      console.log("DeviceData", DeviceData)
      const response = await update('Devices', id, DeviceData);
      return response;
    } catch (error) {
      return rejectWithValue(error || 'Failed to update company');
    }
  }
);

// Delete Device
export const deleteDevice = createAsyncThunk(
  'Devices/deleteDevice',
  async (_id, { rejectWithValue }) => {
    try {
      await softDelete(`Devices`, _id);
      return _id;
    } catch (error) {
      return rejectWithValue(error || 'Failed to delete company');
    }
  }
);

const companySlice = createSlice({
  name: 'Devices',
  initialState: {
    data: [],
    myDevices: [],
    loading: false,
    error: null
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch Devices
      .addCase(fetchDevices.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDevices.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchDevices.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch My Devices
      .addCase(fetchMyDevices.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMyDevices.fulfilled, (state, action) => {
        state.loading = false;
        state.myDevices = action.payload;
      })
      .addCase(fetchMyDevices.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Create Device
      .addCase(createDevice.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createDevice.fulfilled, (state, action) => {
        state.loading = false;
        state.data.push(action.payload);
      })
      .addCase(createDevice.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Update Device
      .addCase(updateDevice.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateDevice.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.data.findIndex(company => company.id === action.payload.id);
        if (index !== -1) {
          state.data[index] = action.payload;
        }
      })
      .addCase(updateDevice.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Delete Device
      .addCase(deleteDevice.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteDevice.fulfilled, (state, action) => {
        state.loading = false;
        state.data = state.data.filter(company => company.id !== action.payload);
      })
      .addCase(deleteDevice.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default companySlice.reducer;

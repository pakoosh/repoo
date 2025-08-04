import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { add, getAll, getByConditions, getTimestamp, update } from "../../services/repository";

const initialState = [];

// Fetch Alerts
export const fetchAlerts = createAsyncThunk(
  'Alerts/fetchAlerts',
  async (_, { rejectWithValue }) => {
    try {
      const response = await getAll("Alerts");
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to fetch alerts');
    }
  }
);

// Fetch All Alerts with optional filters
export const fetchAllAlerts = createAsyncThunk(
  'Alerts/fetchAllAlerts',
  async (filters = {}, { rejectWithValue }) => {
    try {
      // Pass the filters to the getByConditions method
      const response = await getByConditions("Alerts", filters);

      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to fetch all alerts');
    }
  }
);

// Create Alert
export const createAlert = createAsyncThunk(
  'Alerts/createAlert',
  async (newAlert, { rejectWithValue }) => {
    try {

      // console.log("newAlert",newAlert)
      // Get the timestamp from 5 minutes ago
      const fiveMinutesAgo = getTimestamp(new Date(Date.now() - 5 * 60 * 1000));

      // Query for existing alerts in the last 5 minutes
      const existingAlerts = await getByConditions("Alerts", [
        { field: "device_id", operator: "==", value: newAlert.device_id },
        { field: "type", operator: "==", value: newAlert.type },
        { field: "created_at", operator: ">=", value: fiveMinutesAgo } //5 minutes ago
      ]);

      // Only create a new alert if none exist recently
      if (existingAlerts.length === 0) {
        console.log(newAlert.name + " " + newAlert.type + "_threshold alert")
        const response = await add("Alerts", newAlert);
        console.log("alert created", response);
        return response;
      }

      // Optionally return something to indicate no new alert was created
      return null;
    } catch (error) {
      return rejectWithValue(error || 'Failed to create Alert');
    }
  }
);

// delete Alerts
export const deleteOldAlerts = createAsyncThunk(
  'Alerts/deleteOldAlerts',
  async (_, { rejectWithValue }) => {
    try {
      const oneWeekAgo = getTimestamp(new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)); // 7 days ago

      // Get alerts older than 7 days
      const oldAlerts = await getByConditions("Alerts", [
        { field: "created_at", operator: "<", value: oneWeekAgo }
      ]);

      if (!oldAlerts.length) {
        console.log("No old alerts found to delete.");
        return { deletedIds: [], failedDeletions: [] };
      }

      // Use Promise.allSettled for better error handling
      const results = await Promise.allSettled(
        oldAlerts.map(alert => remove("Alerts", alert.id))
      );

      const deletedIds = [];
      const failedDeletions = [];

      results.forEach((result, index) => {
        const id = oldAlerts[index].id;
        if (result.status === "fulfilled") {
          deletedIds.push(id);
        } else {
          console.error(`Failed to delete alert with id ${id}:`, result.reason);
          failedDeletions.push({ id, reason: result.reason });
        }
      });

      console.log(`${deletedIds.length} old alerts deleted. ${failedDeletions.length} failed.`);

      return { deletedIds, failedDeletions };
    } catch (error) {
      console.error("Error in deleteOldAlerts thunk:", error);
      return rejectWithValue(error || 'Failed to delete old alerts');
    }
  }
);

// acknowledge alert
export const fnAcknowledgeAlert = createAsyncThunk(
  'Alerts/fnAcknowledgeAlert',
  async (alert, { rejectWithValue }) => {
    try {
      const { id, ...alertData } = alert;
      // Use the existing update function from your repo
      const response = await update("alerts", id, { ...alertData, acknowledge: true, acknowledge_at: getTimestamp(new Date()) });

      console.log(`Alert ${id} acknowledged successfully`);
      return response;
    } catch (error) {
      return rejectWithValue(error || 'Failed to acknowledging alert');
    }
  }
);

const alertSlice = createSlice({
  name: "Alerts",
  initialState: {
    data: [],
    loading: false,
    alertsCount: 0,
    alerts: [],
    error: null

  },
  reducers: {
    addAlert: (state, action) => {
      const { deviceId, alert, type } = action.payload;
      const alertExists = state.some(
        (existingAlert) => existingAlert.deviceId === deviceId && existingAlert.type === type
      );

      if (!alertExists) {
        state.push({
          deviceId,
          alert,
          type,
          ack: false,
          timestamp: new Date().toISOString(),
        });
      }
    },
    acknowledgeAlert: (state, action) => {
      const { deviceId, type } = action.payload;
      return state.map((alert) =>
        alert.deviceId === deviceId && alert.type === type
          ? { ...alert, ack: true }
          : alert
      );
    },
    removeAlert: (state, action) => {
      return state.filter((alert) => alert.deviceId !== action.payload.deviceId);
    },
    clearAlerts: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      // Fetch Alerts
      .addCase(fetchAlerts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAlerts.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
        state.alertsCount = state.data.filter(a => a.acknowledge === false).length;
      })
      .addCase(fetchAlerts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch All Alerts
      .addCase(fetchAllAlerts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllAlerts.fulfilled, (state, action) => {
        state.loading = false;
        state.alerts = action.payload;
      })
      .addCase(fetchAllAlerts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Create Alert
      .addCase(createAlert.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createAlert.fulfilled, (state, action) => {
        state.loading = false;
        // state.data.push(action.payload);
      })
      .addCase(createAlert.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Acknowledge Alert
      .addCase(fnAcknowledgeAlert.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fnAcknowledgeAlert.fulfilled, (state, action) => {
        state.loading = false;
        const updatedAlert = action.payload;
        const index = state.alerts.findIndex(alert => alert.id === updatedAlert.id);
        if (index !== -1) {
          state.alerts[index] = updatedAlert;
        } else {
          state.alerts.push(updatedAlert);
        }
      })
      .addCase(fnAcknowledgeAlert.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to acknowledge alert';
      });
  },
});

export const { addAlert, acknowledgeAlert, removeAlert, clearAlerts } = alertSlice.actions;
export default alertSlice.reducer;

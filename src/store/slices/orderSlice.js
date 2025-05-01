import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import orderApi from '../../api/orderApi';


export const calculatePreOrder = createAsyncThunk(
  'orders/calculatePreOrder',
  async (orderData, { rejectWithValue }) => {
    try {
      const response = await orderApi.calculatePreOrder(orderData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to calculate order cost');
    }
  }
);

export const createOrder = createAsyncThunk(
  'orders/createOrder',
  async (orderData, { rejectWithValue }) => {
    try {
      const response = await orderApi.createOrder(orderData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to create order');
    }
  }
);

export const getCurrentOrder = createAsyncThunk(
  'orders/getCurrentOrder',
  async (orderId, { rejectWithValue }) => {
    try {
      const response = await orderApi.getOrderDetails(orderId);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to get order details');
    }
  }
);

const initialState = {
  currentOrder: null,
  preOrderDetails: null,
  orderHistory: [],
  loading: false,
  orderStatus: 'idle', 
  error: null,
  orderProcess: {
    pickupLocation: null,
    deliveryLocation: null,
    routePoints: [],
    currentAddress: '',
    destinationAddress: '',
    stops: [],
    selectedVehicle: 1, 
    vehicleData: null,
    price: 0,
    distance: 0,
    time: 0,
    notes: '',
  },
};

const orderSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    setPickupLocation: (state, action) => {
      state.orderProcess.pickupLocation = action.payload;
    },
    setDeliveryLocation: (state, action) => {
      state.orderProcess.deliveryLocation = action.payload;
    },
    setCurrentAddress: (state, action) => {
      state.orderProcess.currentAddress = action.payload;
    },
    setDestinationAddress: (state, action) => {
      state.orderProcess.destinationAddress = action.payload;
    },
    setRoutePoints: (state, action) => {
      state.orderProcess.routePoints = action.payload;
    },
    setSelectedVehicle: (state, action) => {
      state.orderProcess.selectedVehicle = action.payload;
    },
    setOrderNotes: (state, action) => {
      state.orderProcess.notes = action.payload;
    },
    addStop: (state, action) => {
      state.orderProcess.stops.push(action.payload);
    },
    removeStop: (state, action) => {
      state.orderProcess.stops = state.orderProcess.stops.filter(
        stop => stop.id !== action.payload
      );
    },
    updateStop: (state, action) => {
      const { id, address } = action.payload;
      const stopIndex = state.orderProcess.stops.findIndex(stop => stop.id === id);
      if (stopIndex !== -1) {
        state.orderProcess.stops[stopIndex].address = address;
      }
    },
    setOrderStatus: (state, action) => {
      state.orderStatus = action.payload;
    },
    clearOrderProcess: (state) => {
      state.orderProcess = initialState.orderProcess;
      state.preOrderDetails = null;
    },
    setVehicleData: (state, action) => {
      state.orderProcess.vehicleData = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Calculate Pre-Order
      .addCase(calculatePreOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(calculatePreOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.preOrderDetails = action.payload;
        state.orderProcess.price = action.payload.cost;
        state.orderProcess.distance = action.payload.distance;
        state.orderProcess.time = action.payload.time;
      })
      .addCase(calculatePreOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Create Order
      .addCase(createOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.currentOrder = action.payload;
        state.orderStatus = 'locating';
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Get Current Order
      .addCase(getCurrentOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getCurrentOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.currentOrder = action.payload;
      })
      .addCase(getCurrentOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const {
  setPickupLocation,
  setDeliveryLocation,
  setCurrentAddress,
  setDestinationAddress,
  setRoutePoints,
  setSelectedVehicle,
  setOrderNotes,
  addStop,
  removeStop,
  updateStop,
  setOrderStatus,
  clearOrderProcess,
  setVehicleData,
} = orderSlice.actions;

export default orderSlice.reducer;
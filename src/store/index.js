import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import AsyncStorage from "@react-native-async-storage/async-storage";
import orderReducer from "./slices/orderSlice";


const ordersPersistConfig = {
  key: "orders",
  storage: AsyncStorage,
  whitelist: ["orderHistory"], 
};


const persistedOrderReducer = persistReducer(ordersPersistConfig, orderReducer);


const store = configureStore({
  reducer: {
    orders: persistedOrderReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["persist/PERSIST", "persist/REHYDRATE"],
      },
    }),
});


export const persistor = persistStore(store);

export default store;

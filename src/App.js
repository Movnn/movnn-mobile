import React from "react";
import { StatusBar, View } from "react-native";
import { Provider } from "react-redux";
import store, { persistor } from "./store";
import AppNavigator from "./navigation/AppNavigator";
import { SafeAreaProvider } from "react-native-safe-area-context";
import AuthProvider from "./context/AuthProvider";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { PersistGate } from "redux-persist/integration/react";

const App = () => {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <SafeAreaProvider>
          <GestureHandlerRootView style={{ flex: 1 }}>
            <AuthProvider>
              <StatusBar barStyle="dark-content" />
              <AppNavigator />
            </AuthProvider>
          </GestureHandlerRootView>
        </SafeAreaProvider>
      </PersistGate>
    </Provider>
  );
};

export default App;

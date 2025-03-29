import React, { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  View,
  LogBox,
} from "react-native";


import AuthScreen from "../screens/auth/AuthScreen";
import Auth from "../screens/auth/Auth";
import ConfirmOtp from "../components/auth/ConfirmOtp";
import TabNavigator from "./TabNavigator";


import { ROUTES } from "./routes";

import { useAuth } from "../context/AuthProvider";
import OrderMap from "../screens/orders/OrderMap";
import OrderMapOne from "../screens/orders/OrderMapOne";
import OrderMapTwo from "../screens/orders/OrderMapTwo";
import ProcessOrder from "../screens/orders/ProcessOrder";
import ProcessDelivery from "../screens/orders/ProcessDelivery";
import RateOrder from "../screens/orders/RateOrder";
import Storage from "../screens/warehouse/Storage";
import StorageEstimate from "../screens/warehouse/StorageEstimate";
import ViewOrderDetails from "../screens/warehouse/ViewOrderDetails";
import ViewStorageDetails from "../screens/warehouse/ViewStorageDetails";
import SendStorageEstimate from "../screens/warehouse/SendStorageEstimate";
import ProcessStorageOrder from "../screens/warehouse/ProcessStorageOrder";
import StorageRateOrder from "../screens/warehouse/StorageRateOrder";

const Stack = createNativeStackNavigator();

LogBox.ignoreLogs([
  "Non-serializable values were found in the navigation state",
]);

const LoadingScreen = () => (
  <View style={styles.loadingContainer}>
    <ActivityIndicator size="large" color="#005DD2" />
    <Text style={styles.loadingText}>Loading...</Text>
  </View>
);

const AppNavigator = () => {
  const { isAuthenticated, isLoading } = useAuth();

  const [isInitialized, setIsInitialized] = useState(false);
  const [initialRoute, setInitialRoute] = useState(ROUTES.AUTH_SCREEN);

  useEffect(() => {
    if (!isInitialized) {
      setInitialRoute(isAuthenticated ? ROUTES.DASHBOARD : ROUTES.AUTH_SCREEN);
      setIsInitialized(true);
    }
  }, [isAuthenticated, isInitialized]);

  if (isLoading && !isInitialized) {
    return <LoadingScreen />;
  }

  return (
    <NavigationContainer
      onError={(error) => {
        console.error("Navigation error:", error);
      }}
    >
      <Stack.Navigator
        initialRouteName={initialRoute}
        screenOptions={{
          headerTintColor: "#005DD2",
          headerTitle: "",
          headerBackTitleVisible: false,
          headerTransparent: true,
          headerStyle: {
            backgroundColor: "transparent",
          },
          headerShadowVisible: false,
          animation: "slide_from_right",
          animationTypeForReplace: "push",
        }}
      >
        <Stack.Screen
          name={ROUTES.AUTH_SCREEN}
          component={AuthScreen}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name={ROUTES.AUTH}
          component={Auth}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name={ROUTES.CONFIRM_OTP}
          component={ConfirmOtp}
          options={{
            headerShown: false,
            gestureEnabled: false,
          }}
        />

        <Stack.Screen
          name={ROUTES.DASHBOARD}
          component={TabNavigator}
          options={{
            headerShown: false,
            gestureEnabled: false,
          }}
        />

        <Stack.Screen name={ROUTES.MAP} component={OrderMap} />

        <Stack.Screen name={ROUTES.ORDER_MAP_ONE} component={OrderMapOne} />

        <Stack.Screen name={ROUTES.ORDER_MAP_TWO} component={OrderMapTwo} />

        <Stack.Screen name={ROUTES.PROCESS_ORDER} component={ProcessOrder} />

        <Stack.Screen
          name={ROUTES.PROCESS_DELIVERY}
          component={ProcessDelivery}
        />

        <Stack.Screen name={ROUTES.RATE_ORDER} component={RateOrder} />
        <Stack.Screen name={ROUTES.STORAGE} component={Storage} />
        <Stack.Screen
          name={ROUTES.STORAGE_ESTIMATE}
          component={StorageEstimate}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name={ROUTES.SEND_STORAGE_ESTIMATE}
          component={SendStorageEstimate}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name={ROUTES.PROCESS_STORAGE_ORDER}
          component={ProcessStorageOrder}
          // options={{
          //   headerShown: false,
          // }}
        />
        <Stack.Screen
          name={ROUTES.STORAGE_RATE_ORDER}
          component={StorageRateOrder}
          // options={{
          //   headerShown: false,
          // }}
        />
        <Stack.Screen
          name={ROUTES.VIEW_ORDER_DETAILS}
          component={ViewOrderDetails}
        />
        <Stack.Screen
          name={ROUTES.VIEW_STORAGE_DETAILS}
          component={ViewStorageDetails}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#333333",
  },
});

export default AppNavigator;

import * as Location from "expo-location";

export const requestLocationPermissions = async () => {
  try {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      console.log("Location permission denied");
    }
    return status === "granted";
  } catch (error) {
    console.error("Error requesting location permissions:", error);
    return false;
  }
};

export const getCurrentLocation = async () => {
  try {
    const hasPermission = await requestLocationPermissions();

    if (!hasPermission) {
      return {
        success: false,
        error: "Location permission not granted",
      };
    }


    const locationPromise = Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.Balanced, 
      timeout: 15000, 
    });

    const location = await locationPromise;

    return {
      success: true,
      location: {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      },
    };
  } catch (error) {
    console.error("Error getting current location:", error);
    return {
      success: false,
      error: error.message || "Unknown error getting location",
    };
  }
};

export const watchLocation = async (callback) => {
  try {
    const hasPermission = await requestLocationPermissions();

    if (!hasPermission) {
      return {
        success: false,
        error: "Location permission not granted",
      };
    }

    const locationSubscription = await Location.watchPositionAsync(
      {
        accuracy: Location.Accuracy.Balanced, 
        timeInterval: 5000,
        distanceInterval: 10,
        mayShowUserSettingsDialog: true,
      },
      (location) => {
        if (callback && typeof callback === "function") {
          callback({
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
          });
        }
      }
    );

    return {
      success: true,
      locationSubscription,
    };
  } catch (error) {
    console.error("Error watching location:", error);
    return {
      success: false,
      error: error.message || "Unknown error watching location",
    };
  }
};

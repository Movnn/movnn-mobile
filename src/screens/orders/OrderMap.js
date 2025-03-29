import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Dimensions,
  SafeAreaView,
  StatusBar,
  Alert,
} from "react-native";
import React, { useRef, useState, useCallback, useEffect } from "react";
import EvilIcons from "@expo/vector-icons/EvilIcons";
import { useNavigation } from "@react-navigation/native";
import { ROUTES } from "../../navigation/routes";
import BottomSheet, {
  BottomSheetScrollView,
  BottomSheetBackdrop,
} from "@gorhom/bottom-sheet";
import * as locationUtils from "../../utils/locationUtils";
import tomtomService from "../../services/tomtomServices";
import MapComponent from "../../components/map/MapComponent";
import FallbackMapComponent from "../../components/map/FallbackMapComponent";
import * as Location from "expo-location";

const { height: SCREEN_HEIGHT } = Dimensions.get("window");

const OrderMap = () => {
  const navigation = useNavigation();
  const bottomSheetRef = useRef(null);

  const snapPoints = ["30%", "50%", "85%"];
  const [currentSnapIndex, setCurrentSnapIndex] = useState(1);
  const [mapLoadError, setMapLoadError] = useState(false);

  const [currentLocation, setCurrentLocation] = useState(null);
  const [pickupLocation, setPickupLocation] = useState(null);
  const [deliveryLocation, setDeliveryLocation] = useState(null);
  const [routePoints, setRoutePoints] = useState([]);
  const [currentAddress, setCurrentAddress] = useState("");
  const [destinationAddress, setDestinationAddress] = useState("");

  const fetchLocation = async () => {
    try {
      
      const isLocationEnabled = await Location.hasServicesEnabledAsync();

      if (!isLocationEnabled) {
        Alert.alert(
          "Location Services Disabled",
          "Please enable location services in your device settings to use the map.",
          [
            {
              text: "OK",
              onPress: () => {
             
                if (isMounted) {
                  setCurrentLocation(ABUJA_COORDINATES);
                  setPickupLocation(ABUJA_COORDINATES);
                }
              },
            },
          ]
        );
        return;
      }

      const result = await locationUtils.getCurrentLocation();

      if (result.success && isMounted) {
        setCurrentLocation(result.location);
        setPickupLocation(result.location);


        try {
          const addressResult = await tomtomService.reverseGeocode(
            result.location.latitude,
            result.location.longitude
          );

          if (addressResult.success && isMounted) {
            setCurrentAddress(addressResult.address);
          }
        } catch (addressError) {
          console.error("Error getting address:", addressError);

        }
      } else if (isMounted) {

       

    
        setCurrentLocation(ABUJA_COORDINATES);
        setPickupLocation(ABUJA_COORDINATES);

     
        if (result.error === "Location permission not granted") {
          Alert.alert(
            "Location Permission Required",
            "This app needs location permission to work properly. You can enable it in app settings.",
            [{ text: "OK" }]
          );
        }
      }
    } catch (error) {
      console.error("Unexpected error in fetchLocation:", error);
      if (isMounted) {
     
        setCurrentLocation(ABUJA_COORDINATES);
        setPickupLocation(ABUJA_COORDINATES);
      }
    }
  };
 let isMounted = true;
useEffect(() => {
 

  

  fetchLocation();

  const startWatchingLocation = async () => {
    try {
      const watchResult = await locationUtils.watchLocation((location) => {
        if (isMounted) {
          setCurrentLocation(location);
        }
      });

      return watchResult.locationSubscription;
    } catch (error) {
      console.error("Error watching location:", error);
      return null;
    }
  };

  let locationSubscription;
  startWatchingLocation().then((sub) => {
    locationSubscription = sub;
  });


  return () => {
    isMounted = false;
    if (locationSubscription && locationSubscription.remove) {
      locationSubscription.remove();
    }
  };
}, []);

  useEffect(() => {
    if (pickupLocation && deliveryLocation) {
      calculateRoute();
    }
  }, [pickupLocation, deliveryLocation]);

  const calculateRoute = async () => {
    if (!pickupLocation || !deliveryLocation) return;

    const result = await tomtomService.calculateRoute(
      pickupLocation,
      deliveryLocation
    );

    if (result.success) {
      setRoutePoints(result.points);
    } else {
      Alert.alert(
        "Route Error",
        "Could not calculate route. Please try again."
      );
    }
  };

  const handleSheetChanges = useCallback((index) => {
    setCurrentSnapIndex(index);
  }, []);

  const renderBackdrop = useCallback(
    (props) => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
        opacity={0.1}
      />
    ),
    []
  );

  const handleMapTouchStart = () => {
    if (currentSnapIndex !== 0) {
      bottomSheetRef.current?.snapToIndex(0);
    }
  };

  const handleLocationSelection = (location) => {
    if (!pickupLocation) {
      Alert.alert("Error", "Waiting for your current location...");
      return;
    }

    setDestinationAddress(location.address);

    if (location.latitude && location.longitude) {
      setDeliveryLocation({
        latitude: location.latitude,
        longitude: location.longitude,
      });
    } else {
      tomtomService.geocode(location.address).then((result) => {
        if (result.success) {
          setDeliveryLocation(result.coordinates);
        } else {
          Alert.alert("Error", "Could not find coordinates for this location");
        }
      });
    }
  };

  useEffect(() => {
    if (pickupLocation && deliveryLocation && routePoints.length > 0) {
      const timer = setTimeout(() => {
        navigation.navigate(ROUTES.ORDER_MAP_TWO, {
          pickupLocation,
          deliveryLocation,
          routePoints,
          currentAddress,
          destinationAddress,
        });
      }, 800);

      return () => clearTimeout(timer);
    }
  }, [
    routePoints,
    pickupLocation,
    deliveryLocation,
    currentAddress,
    destinationAddress,
    navigation,
  ]);

  const quickSendLocations = [
    {
      id: "1",
      name: "Work",
      address: "304 Epmatak Close, Wuse, Abuja",
      icon: "W",
      latitude: 9.0765,
      longitude: 7.4971,
    },
    {
      id: "2",
      name: "Home",
      address: "27 Lorem Street, Maitama, Abuja",
      icon: "H",
      latitude: 9.0693,
      longitude: 7.4898,
    },
  ];

  const recentLocations = [
    {
      id: "3",
      name: "Grocery Store",
      address: "412 Market Road, Garki, Abuja",
      icon: "G",
      latitude: 9.0574,
      longitude: 7.4898,
    },
    {
      id: "4",
      name: "Gym",
      address: "78 Fitness Avenue, Central District, Abuja",
      icon: "G",
      latitude: 9.0429,
      longitude: 7.4913,
    },
    {
      id: "5",
      name: "Coffee Shop",
      address: "143 Brew Lane, Garki, Abuja",
      icon: "C",
      latitude: 9.051,
      longitude: 7.4864,
    },
    {
      id: "6",
      name: "University",
      address: "200 Academic Road, Abuja",
      icon: "U",
      latitude: 9.062,
      longitude: 7.481,
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="dark-content"
      />

      <View style={styles.mapContainer} onTouchStart={handleMapTouchStart}>
        {mapLoadError ? (
          <FallbackMapComponent
            onRetry={() => {
              setMapLoadError(false);
              fetchLocation(); // Call your location function again
            }}
          />
        ) : (
          <MapComponent
            currentLocation={currentLocation}
            pickupLocation={pickupLocation}
            deliveryLocation={deliveryLocation}
            routePoints={routePoints}
            onRegionChange={() => {}}
            onUserLocationChange={() => {}}
            onMapError={() => setMapLoadError(true)}
          />
        )}
      </View>

      {currentSnapIndex === 0 && (
        <View style={styles.mapControlsContainer}>
          <TouchableOpacity
            style={styles.expandButton}
            onPress={() => bottomSheetRef.current?.snapToIndex(1)} // Go to middle position
          >
            <Text style={styles.expandButtonText}>Expand Options</Text>
          </TouchableOpacity>
        </View>
      )}

      <BottomSheet
        ref={bottomSheetRef}
        index={1}
        snapPoints={snapPoints}
        onChange={handleSheetChanges}
        enablePanDownToClose={false}
        backdropComponent={renderBackdrop}
        handleIndicatorStyle={styles.handleIndicator}
        backgroundStyle={styles.bottomSheetBackground}
      >
        <BottomSheetScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.greeting}>Hi John Doe,</Text>
          <Text style={styles.question}>
            Where are we <Text style={{ color: "#005DD2" }}>movnn</Text> today?
          </Text>

          <View style={styles.inputContainer}>
            <TouchableOpacity
              style={styles.inputWrapper}
              onPress={() => navigation.navigate(ROUTES.ORDER_MAP_ONE)}
            >
              <EvilIcons name="search" size={22} color="#9B9B9B" />
              <Text style={[styles.input, { color: "#666" }]}>
                Moving to where?
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Quick Send</Text>
            <TouchableOpacity>
              <Text style={styles.linkText}>Add</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.locationList}>
            {quickSendLocations.map((location) => (
              <TouchableOpacity
                key={location.id}
                style={styles.locationItem}
                onPress={() => handleLocationSelection(location)}
              >
                <View style={styles.locationIcon}>
                  <Text style={styles.iconText}>{location.icon}</Text>
                </View>
                <View style={styles.locationInfo}>
                  <Text style={styles.locationName}>{location.name}</Text>
                  <Text style={styles.locationAddress}>{location.address}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent</Text>
            <TouchableOpacity>
              <Text style={styles.linkText}>View all</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.locationList}>
            {recentLocations.map((location) => (
              <TouchableOpacity
                key={location.id}
                style={styles.locationItem}
                onPress={() => handleLocationSelection(location)}
              >
                <View style={styles.locationIcon}>
                  <Text style={styles.iconText}>{location.icon}</Text>
                </View>
                <View style={styles.locationInfo}>
                  <Text style={styles.locationName}>{location.name}</Text>
                  <Text style={styles.locationAddress}>{location.address}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.bottomPadding} />
        </BottomSheetScrollView>
      </BottomSheet>
    </SafeAreaView>
  );
};

export default OrderMap;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  mapContainer: {
    flex: 1,
    backgroundColor: "#EAF4FF",
  },
  mapControlsContainer: {
    position: "absolute",
    bottom: 40,
    left: 0,
    right: 0,
    alignItems: "center",
  },
  expandButton: {
    backgroundColor: "#005DD2",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  expandButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },

  bottomSheetBackground: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  handleIndicator: {
    width: 40,
    height: 5,
    backgroundColor: "#DDD",
    marginTop: 10,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 30,
  },
  greeting: {
    fontSize: 16,
    color: "#333",
    marginBottom: 4,
  },
  question: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 20,
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F5F5F5",
    borderRadius: 10,
    marginBottom: 10,
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  input: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
    color: "#333",
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#787878",
  },
  linkText: {
    fontSize: 14,
    color: "#005DD2",
    fontWeight: "500",
  },
  locationList: {
    marginBottom: 16,
  },
  locationItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    marginBottom: 8,
    borderRadius: 10,
    backgroundColor: "#F9F9F9",
  },
  locationIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#AAD5FF",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  iconText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#005DD2",
  },
  locationInfo: {
    flex: 1,
  },
  locationName: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333",
    marginBottom: 2,
  },
  locationAddress: {
    fontSize: 14,
    color: "#666",
  },
  bottomPadding: {
    height: 100,
  },
});

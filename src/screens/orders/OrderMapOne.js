import React, { useRef, useState, useEffect, useCallback } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  StatusBar,
  Keyboard,
  TouchableWithoutFeedback,
  SafeAreaView,
  Platform,
  Dimensions,
  Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import BottomSheet, {
  BottomSheetScrollView,
  BottomSheetBackdrop,
} from "@gorhom/bottom-sheet";
import { ROUTES } from "../../navigation/routes";
import * as locationUtils from "../../utils/locationUtils";
import tomtomService from "../../services/tomtomServices";
import AddressInput from "../../components/map/AddressInput";
import MapComponent from "../../components/map/MapComponent";

const { height: SCREEN_HEIGHT } = Dimensions.get("window");

const OrderMapOne = () => {
  const navigation = useNavigation();
  const bottomSheetRef = useRef(null);

  const snapPoints = ["15%", "50%", "85%"];
  const [currentSnapIndex, setCurrentSnapIndex] = useState(1);

  const [currentLocation, setCurrentLocation] = useState(null);
  const [pickupLocation, setPickupLocation] = useState(null);
  const [deliveryLocation, setDeliveryLocation] = useState(null);
  const [routePoints, setRoutePoints] = useState([]);
  const [currentAddress, setCurrentAddress] = useState("");
  const [destinationAddress, setDestinationAddress] = useState("");
  const [suggestionVisible, setSuggestionVisible] = useState(false);
  const [activeInput, setActiveInput] = useState(null);
  const [keyboardVisible, setKeyboardVisible] = useState(false);

  useEffect(() => {
    const fetchLocation = async () => {
      const result = await locationUtils.getCurrentLocation();
      if (result.success) {
        setCurrentLocation(result.location);
        setPickupLocation(result.location);

        const addressResult = await tomtomService.reverseGeocode(
          result.location.latitude,
          result.location.longitude
        );

        if (addressResult.success) {
          setCurrentAddress(addressResult.address);
        }
      }
    };

    fetchLocation();

    const startWatchingLocation = async () => {
      const watchResult = await locationUtils.watchLocation((location) => {
        setCurrentLocation(location);
      });

      return watchResult.locationSubscription;
    };

    const locationSubscription = startWatchingLocation();

    const keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      () => {
        setKeyboardVisible(true);

        bottomSheetRef.current?.snapToIndex(2);
      }
    );

    const keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      () => {
        setKeyboardVisible(false);
      }
    );

    return () => {
      if (locationSubscription && locationSubscription.then) {
        locationSubscription.then((sub) => {
          if (sub && sub.remove) sub.remove();
        });
      }

      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
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
        disappearsOnIndex={0}
        appearsOnIndex={1}
        opacity={0.1}
      />
    ),
    []
  );

  const handleSuggestionShow = (inputType) => {
    setSuggestionVisible(true);
    setActiveInput(inputType);
    bottomSheetRef.current?.snapToIndex(2);
  };

  const handleSuggestionHide = () => {
    setSuggestionVisible(false);
    setActiveInput(null);
  };

  const handleBackgroundPress = () => {
    if (keyboardVisible || suggestionVisible) {
      Keyboard.dismiss();
      setSuggestionVisible(false);
    }
  };

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
  ];

  const handleLocationSelection = (location) => {
    setDestinationAddress(location.address);
    setDeliveryLocation({
      latitude: location.latitude,
      longitude: location.longitude,
    });
    setSuggestionVisible(false);
    bottomSheetRef.current?.snapToIndex(2);
  };

  const handleConfirmPickup = () => {
    if (currentLocation) {
      setPickupLocation(currentLocation);
      bottomSheetRef.current?.snapToIndex(2);
      setActiveInput("to");
    } else {
      Alert.alert("Error", "Cannot determine your current location");
    }
  };

  const handleConfirmRoute = () => {
    if (deliveryLocation) {
      navigation.navigate(ROUTES.ORDER_MAP_TWO, {
        pickupLocation,
        deliveryLocation,
        routePoints,
        currentAddress,
        destinationAddress,
      });
    } else {
      Alert.alert("Error", "Please select a destination first");
    }
  };

  const handleMapTouchStart = () => {
    if (currentSnapIndex !== 0) {
      bottomSheetRef.current?.snapToIndex(0);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="dark-content"
      />

      <TouchableWithoutFeedback onPress={handleBackgroundPress}>
        <View style={styles.mapContainer} onTouchStart={handleMapTouchStart}>
          <MapComponent
            currentLocation={currentLocation}
            pickupLocation={pickupLocation}
            deliveryLocation={deliveryLocation}
            routePoints={routePoints}
            onRegionChange={() => {}}
            onUserLocationChange={() => {}}
          />
        </View>
      </TouchableWithoutFeedback>

      {currentSnapIndex === 0 && (
        <View style={styles.mapControlsContainer}>
          <TouchableOpacity
            style={styles.expandButton}
            onPress={() => bottomSheetRef.current?.snapToIndex(1)} 
          >
            <Text style={styles.expandButtonText}>Edit Route</Text>
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
        keyboardBehavior={Platform.OS === "ios" ? "extend" : "interactive"}
        keyboardBlurBehavior="restore"
        android_keyboardInputMode="adjustResize"
        handleIndicatorStyle={styles.handleIndicator}
        backgroundStyle={styles.bottomSheetBackground}
      >
        <BottomSheetScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.inputContainer}>
            <AddressInput
              label=""
              placeholder="From"
              value={currentAddress}
              onAddressChange={(address) => setCurrentAddress(address)}
              onCoordinatesChange={(coords) => setPickupLocation(coords)}
              isPrimary={true}
              editable={true}
              showLocationButton={true}
              onSuggestionShow={() => handleSuggestionShow("from")}
              onSuggestionHide={handleSuggestionHide}
              zIndex={3}
            />

            <AddressInput
              label=""
              placeholder="To"
              value={destinationAddress}
              onAddressChange={(address) => setDestinationAddress(address)}
              onCoordinatesChange={(coords) => setDeliveryLocation(coords)}
              isPrimary={false}
              editable={true}
              showLocationButton={false}
              onSuggestionShow={() => handleSuggestionShow("to")}
              onSuggestionHide={handleSuggestionHide}
              zIndex={2}
            />

            <View style={styles.linksContainer}>
              <View style={{ flex: 1 }} />
              <TouchableOpacity>
                <Text style={styles.linkTextRight}>Send to movnn storage</Text>
              </TouchableOpacity>
            </View>
          </View>

          {!suggestionVisible && (
            <>
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
                      <Text style={styles.locationAddress} numberOfLines={1}>
                        {location.address}
                      </Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            </>
          )}

          {deliveryLocation && (
            <TouchableOpacity
              style={styles.confirmButton}
              onPress={handleConfirmRoute}
            >
              <Text style={styles.confirmButtonText}>Confirm Pickup</Text>
            </TouchableOpacity>
          )}

          <View style={styles.bottomPadding} />
        </BottomSheetScrollView>
      </BottomSheet>
    </SafeAreaView>
  );
};

export default OrderMapOne;

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
  inputContainer: {
    marginTop: 10,
    marginBottom: 20,
    paddingHorizontal: 4,
  },
  linksContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 12,
    paddingHorizontal: 4,
  },
  linkTextLeft: {
    fontSize: 14,
    color: "#005DD2",
    textDecorationLine: "underline",
  },
  linkTextRight: {
    fontSize: 14,
    color: "#005DD2",
    textDecorationLine: "underline",
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
  confirmButton: {
    backgroundColor: "#005DD2",
    borderRadius: 10,
    paddingVertical: 16,
    alignItems: "center",
    marginBottom: 20,
    marginTop: 10,
  },
  confirmButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
});

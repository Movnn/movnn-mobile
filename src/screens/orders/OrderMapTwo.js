import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  StatusBar,
  Dimensions,
  TextInput,
  FlatList,
  Keyboard,
  Alert,
  Platform,
} from "react-native";
import React, { useRef, useState, useEffect, useCallback } from "react";
import scooter from "../../assets/images/scooter.png";
import van from "../../assets/images/van.png";
import drone from "../../assets/images/drone.png";
import BottomSheet, {
  BottomSheetScrollView,
  BottomSheetBackdrop,
} from "@gorhom/bottom-sheet";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import { ROUTES } from "../../navigation/routes";
import MapComponent from "../../components/map/MapComponent";

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get("window");

const vehicleList = [
  {
    id: 1,
    name: "Bike",
    price: 300,
    img: scooter,
  },
  {
    id: 2,
    name: "Van",
    price: 700,
    img: van,
  },
  {
    id: 3,
    name: "Drone",
    price: 500,
    img: drone,
  },
];

const OrderMapTwo = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const bottomSheetRef = useRef(null);

  const {
    pickupLocation,
    deliveryLocation,
    routePoints,
    currentAddress,
    destinationAddress,
  } = route.params || {};

  const snapPoints = ["25%", "60%", "85%"];
  const [currentSnapIndex, setCurrentSnapIndex] = useState(1);

  const [stops, setStops] = useState([]);
  const [notes, setNotes] = useState("");
  const [selectedVehicle, setSelectedVehicle] = useState(1);
  const [keyboardVisible, setKeyboardVisible] = useState(false);

  useEffect(() => {
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
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

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

  const handleMapTouchStart = () => {
    if (currentSnapIndex !== 0) {
      bottomSheetRef.current?.snapToIndex(0);
    }
  };

  const handleAddStop = () => {
    if (stops.length < 3) {
      setStops([...stops, { id: Date.now(), address: "" }]);
      bottomSheetRef.current?.snapToIndex(2);
    } else {
      Alert.alert(
        "Maximum Stops",
        "You can add a maximum of 3 additional stops."
      );
    }
  };

  const handleRemoveStop = (id) => {
    const updatedStops = stops.filter((stop) => stop.id !== id);
    setStops(updatedStops);
  };

  const handleUpdateStopAddress = (id, address) => {
    const updatedStops = stops.map((stop) =>
      stop.id === id ? { ...stop, address } : stop
    );
    setStops(updatedStops);
  };

  const handlePlaceOrder = () => {
    const selectedVehicleData = vehicleList.find(
      (v) => v.id === selectedVehicle
    );
    const price = selectedVehicleData ? selectedVehicleData.price : 0;

    navigation.navigate(ROUTES.PROCESS_ORDER, {
      pickupLocation,
      deliveryLocation,
      routePoints,
      currentAddress,
      destinationAddress,
      stops,
      selectedVehicle,
      price,
      notes,
      vehicleData: selectedVehicleData,
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="dark-content"
      />

      <View style={styles.mapContainer} onTouchStart={handleMapTouchStart}>
        <MapComponent
          currentLocation={null}
          pickupLocation={pickupLocation}
          deliveryLocation={deliveryLocation}
          routePoints={routePoints}
          onRegionChange={() => {}}
          onUserLocationChange={() => {}}
        />
      </View>

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
          <View style={styles.addressContainer}>
            <View style={styles.addressInputContainer}>
              <View style={styles.addressIconContainer}>
                <View style={styles.originDot} />
              </View>
              <View style={styles.addressTextContainer}>
                <Text style={styles.addressLabel}>From</Text>
                <Text style={styles.addressText} numberOfLines={1}>
                  {currentAddress}
                </Text>
              </View>
            </View>

            <View style={styles.lineConnectorContainer}>
              <View style={styles.lineConnector} />
            </View>

            {stops.map((stop, index) => (
              <React.Fragment key={stop.id}>
                <View style={styles.addressInputContainer}>
                  <View style={styles.addressIconContainer}>
                    <View style={styles.stopDot} />
                  </View>
                  <View style={styles.addressTextContainer}>
                    <Text style={styles.addressLabel}>Stop {index + 1}</Text>
                    <TextInput
                      style={styles.stopInput}
                      placeholder="Enter stop address"
                      value={stop.address}
                      onChangeText={(text) =>
                        handleUpdateStopAddress(stop.id, text)
                      }
                    />
                  </View>
                  <TouchableOpacity
                    style={styles.editButton}
                    onPress={() => handleRemoveStop(stop.id)}
                  >
                    <MaterialIcons name="clear" size={20} color="#FF5722" />
                  </TouchableOpacity>
                </View>
                <View style={styles.lineConnectorContainer}>
                  <View style={styles.lineConnector} />
                </View>
              </React.Fragment>
            ))}

            <View style={styles.addressInputContainer}>
              <View style={styles.addressIconContainer}>
                <View style={styles.destinationDot} />
              </View>
              <View style={styles.addressTextContainer}>
                <Text style={styles.addressLabel}>To</Text>
                <Text style={styles.addressText} numberOfLines={1}>
                  {destinationAddress}
                </Text>
              </View>
            </View>

            <View style={styles.addStopButtonContainer}>
              <TouchableOpacity
                style={styles.addStopButton}
                onPress={handleAddStop}
              >
                <Ionicons name="add-circle-outline" size={18} color="#005DD2" />
                <Text style={styles.addStopText}>Add Stop</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.notesContainer}>
            <View style={styles.notesInputContainer}>
              <Ionicons
                name="document-text-outline"
                size={20}
                color="#666"
                style={styles.notesIcon}
              />
              <TextInput
                style={styles.notesInput}
                placeholder="Add delivery notes..."
                placeholderTextColor="#999"
                multiline
                value={notes}
                onChangeText={setNotes}
              />
            </View>
          </View>

          <View style={styles.vehiclesContainer}>
            <FlatList
              data={vehicleList}
              horizontal
              showsHorizontalScrollIndicator={false}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.vehicleCard,
                    selectedVehicle === item.id && styles.vehicleCardActive,
                  ]}
                  onPress={() => setSelectedVehicle(item.id)}
                >
                  <Image source={item.img} style={styles.vehicleImage} />
                  <Text
                    style={[
                      styles.vehicleName,
                      selectedVehicle === item.id && styles.vehicleTextActive,
                    ]}
                  >
                    {item.name}
                  </Text>
                  <Text
                    style={[
                      styles.vehiclePrice,
                      selectedVehicle === item.id && styles.vehicleTextActive,
                    ]}
                  >
                    ₦{item.price}
                  </Text>
                </TouchableOpacity>
              )}
              keyExtractor={(item) => item.id.toString()}
              contentContainerStyle={styles.vehicleList}
            />
          </View>

          <TouchableOpacity
            style={styles.orderButton}
            onPress={handlePlaceOrder}
          >
            <Text style={styles.orderButtonText}>Order</Text>
          </TouchableOpacity>
        </BottomSheetScrollView>
      </BottomSheet>
    </SafeAreaView>
  );
};

export default OrderMapTwo;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  mapContainer: {
    flex: 1,
    backgroundColor: "#EAF4FF",
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
  // Address styles
  addressContainer: {
    marginTop: 15,
    marginBottom: 15,
  },
  addressInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 0, // Reduced to work better with lineConnector
  },
  addressIconContainer: {
    width: 24,
    alignItems: "center",
    marginRight: 10,
  },
  originDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#ffff",
    borderWidth: 3,
    borderColor: "#005DD2",
  },
  stopDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#FFA500",
    borderWidth: 2,
    borderColor: "#FFE5B4",
  },
  destinationDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#005DD24D",
    borderWidth: 2,
    borderColor: "#005DD24D",
  },
  lineConnectorContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  lineConnector: {
    width: 2,
    height: 24,
    backgroundColor: "#DDD",
    marginLeft: 11, // Center aligned with dots
    marginVertical: 2,
  },
  addressTextContainer: {
    flex: 1,
    justifyContent: "center",
  },
  addressLabel: {
    fontSize: 12,
    color: "#666",
    marginBottom: 2,
  },
  addressText: {
    fontSize: 15,
    color: "#333",
  },
  stopInput: {
    fontSize: 15,
    color: "#333",
    padding: 0,
    margin: 0,
  },
  editButton: {
    padding: 10,
  },
  addStopButtonContainer: {
    flexDirection: "row",
    justifyContent: "flex-end", // Right align the button
    marginTop: 10,
  },
  addStopButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  addStopText: {
    color: "#005DD2",
    fontSize: 14,
    marginLeft: 5,
  },
  // Notes styles
  notesContainer: {
    marginBottom: 20,
  },
  notesInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F6F6F6",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  notesIcon: {
    marginRight: 10,
  },
  notesInput: {
    flex: 1,
    fontSize: 14,
    color: "#333",
    minHeight: 40,
  },
  // Vehicle selection styles
  vehiclesContainer: {
    marginBottom: 20,
  },
  vehicleList: {
    paddingBottom: 10,
  },
  vehicleCard: {
    width: 109,
    height: 110,
    backgroundColor: "#F6F6F6",
    borderRadius: 12,
    padding: 10,
    marginRight: 12,
    // alignItems: "center",
    // justifyContent: "center",
  },
  vehicleCardActive: {
    backgroundColor: "#005DD2",
  },
  vehicleImage: {
    width: 85,
    height: 50,
    resizeMode: "contain",
    marginBottom: 8,
  },
  vehicleName: {
    fontSize: 14,
    fontWeight: "500",
    color: "#333",
    marginBottom: 2,
    textAlign:"left"
  },
  vehiclePrice: {
    fontSize: 14,
    color: "#666",
  },
  vehicleTextActive: {
    color: "#FFFFFF",
  },
  
  orderButton: {
    backgroundColor: "#005DD2",
    borderRadius: 10,
    paddingVertical: 16,
    alignItems: "center",
    marginVertical: 10,
  },
  orderButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
});

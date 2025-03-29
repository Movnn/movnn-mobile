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
  ActivityIndicator,
  Alert,
  Platform,
} from "react-native";
import React, { useRef, useState, useEffect, useCallback } from "react";
import scooter from "../../assets/images/scooter.png";
import van from "../../assets/images/van.png";
import drone from "../../assets/images/drone.png";
import userimg from "../../assets/images/user-img.png";
import BottomSheet, {
  BottomSheetScrollView,
  BottomSheetBackdrop,
} from "@gorhom/bottom-sheet";
import {
  Ionicons,
  MaterialIcons,
  FontAwesome,
  Feather,
} from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import { ROUTES } from "../../navigation/routes";
import MapComponent from "../../components/map/MapComponent";

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get("window");

const driverInfo = {
  name: "John Doe",
  rating: 4.7,
  image: userimg,
  phone: "+2341234567890",
  timeToArrive: "10 mins",
  distance: "2 km",
};

const ProcessOrder = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const bottomSheetRef = useRef(null);

  const {
    pickupLocation,
    deliveryLocation,
    routePoints,
    currentAddress,
    destinationAddress,
    stops = [],
    selectedVehicle,
    price = 2300,
  } = route.params || {};

  const [orderStatus, setOrderStatus] = useState("locating");
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [expandedPriceBreakdown, setExpandedPriceBreakdown] = useState(false);

  // Snap points for the bottom sheet (in percentage of screen height)
  const snapPoints = ["40%", "70%"];
  const [currentSnapIndex, setCurrentSnapIndex] = useState(0);


  const handleSheetChanges = useCallback((index) => {
    setCurrentSnapIndex(index);
  }, []);

  // Backdrop component
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

  // Fix for bottom sheet hiding when interacting with map
  const handleMapTouchStart = () => {
    if (currentSnapIndex !== 0) {
      bottomSheetRef.current?.snapToIndex(0);
    }
  };

  // Simulate loading for demo
  useEffect(() => {
    if (orderStatus === "locating") {
      const interval = setInterval(() => {
        setLoadingProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            // Move to driver on the way after loading completes
            setTimeout(() => setOrderStatus("onWay"), 500);
            return 100;
          }
          return prev + 5;
        });
      }, 1000);

      return () => clearInterval(interval);
    }

    // For demo: automatically move to arrived status after 10 seconds
    if (orderStatus === "onWay") {
      const timeout = setTimeout(() => {
        setOrderStatus("arrived");
      }, 10000);

      return () => clearTimeout(timeout);
    }
  }, [orderStatus]);

  // Handle payment
  const handlePayment = () => {
    navigation.navigate(ROUTES.PROCESS_DELIVERY, {
      deliveryLocation,
      routePoints,
      price,
    });
  };

  
  const handleCancelOrder = () => {
    Alert.alert("Cancel Order", "Are you sure you want to cancel this order?", [
      {
        text: "No",
        style: "cancel",
      },
      {
        text: "Yes, Cancel",
        onPress: () => navigation.goBack(),
      },
    ]);
  };

  
  const getVehicleImage = () => {
    switch (selectedVehicle) {
      case 1:
        return scooter;
      case 2:
        return van;
      case 3:
        return drone;
      default:
        return scooter;
    }
  };



  const getVehicleInfo = () => {
  
    const vehicleImage = getVehicleImage();

    // Get vehicle details
    const vehicleName = "DJI Flycart 30";
    const vehicleId = "#MD-7571";

    // Determine which status badge to use based on order status
    let statusBadgeStyle, statusText;

    switch (orderStatus) {
      case "locating":
        statusBadgeStyle = styles.statusBadge;
        statusText = "Pending";
        break;
      case "onWay":
        statusBadgeStyle = styles.statusBadgeOngoing;
        statusText = "On-going";
        break;
      case "arrived":
        statusBadgeStyle = styles.statusBadgeArrived;
        statusText = "Arrived";
        break;
      default:
        statusBadgeStyle = styles.statusBadge;
        statusText = "Pending";
    }

    return (
      <View style={styles.vehicleInfoContainer}>
        <Image source={vehicleImage} style={styles.vehicleImage} />
        <View>
      
          {(statusText === "On-going" || statusText === "Arrived") && (
            <>
              <Text style={styles.vehicleName}>{vehicleName}</Text>
              <Text style={styles.vehicleId}>{vehicleId}</Text>
            </>
          )}
          <View style={statusBadgeStyle}>
            <Feather
              name="package"
              size={16}
              color="#FFF"
              style={styles.statusIcon}
            />
            <Text style={styles.statusText}>{statusText}</Text>
          </View>
        </View>
      </View>
    );
  };

  const renderBottomSheetContent = () => {
    switch (orderStatus) {
      case "locating":
        return (
          <View style={styles.locatingContainer}>
            <Text style={styles.locatingTitle}>
              We're locating the nearest mover for you...
            </Text>

            <View style={styles.loadingBarContainer}>
              <View
                style={[styles.loadingBar, { width: `${loadingProgress}%` }]}
              />
            </View>

            {getVehicleInfo()}

            <View style={styles.addressSection}>
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
                      <Text style={styles.addressText} numberOfLines={1}>
                        {stop.address}
                      </Text>
                    </View>
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
            </View>

            <TouchableOpacity
              style={styles.cancelButton}
              onPress={handleCancelOrder}
            >
              <Text style={styles.cancelButtonText}>Cancel Order</Text>
            </TouchableOpacity>
          </View>
        );

      case "onWay":
        return (
          <View style={styles.driverContainer}>
            <View style={styles.driverInfoSection}>
              <View style={styles.driverProfile}>
                <Image source={driverInfo.image} style={styles.driverImage} />
                <View style={styles.driverDetails}>
                  <Text style={styles.driverName}>
                    {driverInfo.name} is on the way
                  </Text>
                  <View style={styles.ratingContainer}>
                    <FontAwesome name="star" size={16} color="#FFD700" />
                    <Text style={styles.ratingText}>{driverInfo.rating}</Text>
                  </View>
                </View>
              </View>

              <View style={styles.contactButtons}>
                <TouchableOpacity style={styles.contactButton}>
                  <Ionicons name="chatbubble" size={20} color="#005DD2" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.contactButton}>
                  <Ionicons name="call" size={20} color="#005DD2" />
                </TouchableOpacity>
              </View>
            </View>

            {getVehicleInfo()}

    
            <View style={styles.addressSection}>
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
                      <Text style={styles.addressText} numberOfLines={1}>
                        {stop.address}
                      </Text>
                    </View>
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
            </View>

            <View style={styles.tripInfoContainer}>
              <View style={styles.tripInfo}>
                <View style={styles.infoIconContainer}>
                  <Ionicons name="time-outline" size={18} color="#005DD2" />
                </View>
                <Text style={styles.tripInfoText}>
                  {driverInfo.timeToArrive}
                </Text>
              </View>

              <View style={styles.tripInfo}>
                <View style={styles.infoIconContainer}>
                  <Ionicons name="location-outline" size={18} color="#005DD2" />
                </View>
                <Text style={styles.tripInfoText}>{driverInfo.distance}</Text>
              </View>
            </View>

            <TouchableOpacity
              style={styles.priceBreakdownButton}
              onPress={() => setExpandedPriceBreakdown(!expandedPriceBreakdown)}
            >
              <Text style={styles.priceBreakdownText}>Price Breakdown</Text>
              <Ionicons
                name={expandedPriceBreakdown ? "chevron-up" : "chevron-down"}
                size={18}
                color="#005DD2"
              />
            </TouchableOpacity>

            {expandedPriceBreakdown && (
              <View style={styles.priceBreakdownContainer}>
                <View style={styles.priceItem}>
                  <Text style={styles.priceItemLabel}>Base Fare</Text>
                  <Text style={styles.priceItemValue}>
                    ₦{(price * 0.7).toFixed(0)}
                  </Text>
                </View>
                <View style={styles.priceItem}>
                  <Text style={styles.priceItemLabel}>Distance Fee</Text>
                  <Text style={styles.priceItemValue}>
                    ₦{(price * 0.2).toFixed(0)}
                  </Text>
                </View>
                <View style={styles.priceItem}>
                  <Text style={styles.priceItemLabel}>Service Fee</Text>
                  <Text style={styles.priceItemValue}>
                    ₦{(price * 0.1).toFixed(0)}
                  </Text>
                </View>
                <View style={styles.priceDivider} />
                <View style={styles.priceTotal}>
                  <Text style={styles.priceTotalLabel}>Total</Text>
                  <Text style={styles.priceTotalValue}>₦{price}</Text>
                </View>
              </View>
            )}

            <TouchableOpacity
              style={[styles.payButton, styles.payButtonDisabled]}
              disabled={true}
            >
              <Text style={styles.payButtonText}>Pay ₦{price}</Text>
            </TouchableOpacity>
          </View>
        );

      case "arrived":
        return (
          <View style={styles.driverContainer}>
            <View style={styles.driverInfoSection}>
              <View style={styles.driverProfile}>
                <Image source={driverInfo.image} style={styles.driverImage} />
                <View style={styles.driverDetails}>
                  <Text style={styles.driverName}>
                    {driverInfo.name} has arrived
                  </Text>
                  <View style={styles.ratingContainer}>
                    <FontAwesome name="star" size={16} color="#FFD700" />
                    <Text style={styles.ratingText}>{driverInfo.rating}</Text>
                  </View>
                </View>
              </View>

              <View style={styles.contactButtons}>
                <TouchableOpacity style={styles.contactButton}>
                  <Ionicons name="chatbubble" size={20} color="#005DD2" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.contactButton}>
                  <Ionicons name="call" size={20} color="#005DD2" />
                </TouchableOpacity>
              </View>
            </View>

            {getVehicleInfo()}

            <View style={styles.addressSection}>
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
                      <Text style={styles.addressText} numberOfLines={1}>
                        {stop.address}
                      </Text>
                    </View>
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
            </View>

            <View style={styles.tripInfoContainer}>
              <View style={styles.tripInfo}>
                <View style={styles.infoIconContainer}>
                  <Ionicons name="time-outline" size={18} color="#005DD2" />
                </View>
                <Text style={styles.tripInfoText}>
                  {driverInfo.timeToArrive}
                </Text>
              </View>

              <View style={styles.tripInfo}>
                <View style={styles.infoIconContainer}>
                  <Ionicons name="location-outline" size={18} color="#005DD2" />
                </View>
                <Text style={styles.tripInfoText}>{driverInfo.distance}</Text>
              </View>
            </View>

            <TouchableOpacity
              style={styles.priceBreakdownButton}
              onPress={() => setExpandedPriceBreakdown(!expandedPriceBreakdown)}
            >
              <Text style={styles.priceBreakdownText}>Price Breakdown</Text>
              <Ionicons
                name={expandedPriceBreakdown ? "chevron-up" : "chevron-down"}
                size={18}
                color="#005DD2"
              />
            </TouchableOpacity>

            {expandedPriceBreakdown && (
              <View style={styles.priceBreakdownContainer}>
                <View style={styles.priceItem}>
                  <Text style={styles.priceItemLabel}>Base Fare</Text>
                  <Text style={styles.priceItemValue}>
                    ₦{(price * 0.7).toFixed(0)}
                  </Text>
                </View>
                <View style={styles.priceItem}>
                  <Text style={styles.priceItemLabel}>Distance Fee</Text>
                  <Text style={styles.priceItemValue}>
                    ₦{(price * 0.2).toFixed(0)}
                  </Text>
                </View>
                <View style={styles.priceItem}>
                  <Text style={styles.priceItemLabel}>Service Fee</Text>
                  <Text style={styles.priceItemValue}>
                    ₦{(price * 0.1).toFixed(0)}
                  </Text>
                </View>
                <View style={styles.priceDivider} />
                <View style={styles.priceTotal}>
                  <Text style={styles.priceTotalLabel}>Total</Text>
                  <Text style={styles.priceTotalValue}>₦{price}</Text>
                </View>
              </View>
            )}

            <TouchableOpacity style={styles.payButton} onPress={handlePayment}>
              <Text style={styles.payButtonText}>Pay ₦{price}</Text>
            </TouchableOpacity>
          </View>
        );

      default:
        return <View />;
    }
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
        index={0}
        snapPoints={snapPoints}
        onChange={handleSheetChanges}
        enablePanDownToClose={false}
        backdropComponent={renderBackdrop}
        handleIndicatorStyle={styles.handleIndicator}
        backgroundStyle={styles.bottomSheetBackground}
      >
        <BottomSheetScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {renderBottomSheetContent()}
        </BottomSheetScrollView>
      </BottomSheet>
    </SafeAreaView>
  );
};

export default ProcessOrder;

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

  locatingContainer: {
    padding: 16,
  },
  locatingTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    textAlign: "center",
    marginBottom: 20,
  },
  loadingBarContainer: {
    height: 8,
    backgroundColor: "#005DD21C",
    borderRadius: 4,
    overflow: "hidden",
    marginBottom: 24,
  },
  loadingBar: {
    height: "100%",
    backgroundColor: "#005DD2",
    borderRadius: 4,
  },

  vehicleInfoContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
    gap: 16,
  },
  vehicleImage: {
    resizeMode: "contain",
    width: 109,
    height: 100,
  },
  vehicleName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  vehicleId: {
    fontSize: 14,
    color: "#666",
    marginBottom: 4,
  },
  statusBadge: {
    backgroundColor: "#2C3A4B40",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    flexDirection: "row",
    alignItems: "center",
  },
  statusBadgeOngoing: {
    backgroundColor: "#ADD1FF",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    flexDirection: "row",
    alignItems: "center",
  },
  statusBadgeArrived: {
    backgroundColor: "#FFDD64",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    flexDirection: "row",
    alignItems: "center",
  },
  statusText: {
    color: "#FFF",
    fontWeight: "500",
  },
  statusIcon: {
    marginRight: 6,
  },

  addressSection: {
    marginBottom: 20,
  },
  addressInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 0,
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
    marginLeft: 11,
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

  cancelButton: {
    paddingVertical: 14,
    alignItems: "center",
    marginTop: 16,
  },
  cancelButtonText: {
    color: "#000",
    fontSize: 16,
    fontWeight: "bold",
    borderBottomWidth: 1,
  },

  driverContainer: {
    padding: 16,
  },
  driverInfoSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  driverProfile: {
    flexDirection: "row",
    alignItems: "center",
  },
  driverImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  driverDetails: {
    justifyContent: "center",
  },
  driverName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },
  ratingText: {
    marginLeft: 4,
    color: "#666",
  },
  contactButtons: {
    flexDirection: "row",
  },
  contactButton: {
    width: 40,
    height: 40,
    backgroundColor: "#E3F0FF",
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 8,
  },

  tripInfoContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 16,
    gap: 16,
  },
  tripInfo: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#E3F0FF",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
  },
  infoIconContainer: {
    marginRight: 6,
  },
  tripInfoText: {
    color: "#005DD2",
    fontWeight: "500",
  },

  priceBreakdownButton: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 12,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: "#EEE",
    marginBottom: 16,
  },
  priceBreakdownText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333",
  },
  priceBreakdownContainer: {
    backgroundColor: "#F9F9F9",
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
  priceItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  priceItemLabel: {
    color: "#666",
  },
  priceItemValue: {
    color: "#333",
    fontWeight: "500",
  },
  priceDivider: {
    height: 1,
    backgroundColor: "#EEE",
    marginVertical: 10,
  },
  priceTotal: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  priceTotalLabel: {
    fontWeight: "600",
    color: "#333",
  },
  priceTotalValue: {
    fontWeight: "700",
    color: "#005DD2",
    fontSize: 16,
  },

  payButton: {
    backgroundColor: "#005DD2",
    borderRadius: 10,
    paddingVertical: 16,
    alignItems: "center",
    marginTop: 10,
  },
  payButtonDisabled: {
    backgroundColor: "#005DD280",
  },
  payButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
});

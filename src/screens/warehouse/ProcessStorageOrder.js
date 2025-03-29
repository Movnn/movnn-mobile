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

import userimg from "../../assets/images/user-img.png";
import warehouse_img from "../../assets/images/warehouse.png";

const driverInfo = {
  name: "John Doe",
  rating: 4.7,
  image: userimg,
  phone: "+2341234567890",
  timeToArrive: "10 mins",
  distance: "2 km",
};

const ProcessStorageOrder = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const bottomSheetRef = useRef(null);

  // Extract data from route params (from SendStorageEstimate)
  const { estimateData } = route.params || {};

  // Using default values if no data is passed
  const weight = estimateData?.weight || "5";
  const quantity = estimateData?.quantity || "1";
  const keepDays = estimateData?.keepDays || "30";
  const itemValue = estimateData?.itemValue || "50000";
  const isInsured = estimateData?.isInsured || false;
  const location = estimateData?.location || "Lagos, Southwest";

  // Calculate price based on the received data (example calculation)
  const calculatePrice = () => {
    const basePrice = 500; // Example base price
    const weightFactor = parseFloat(weight) * 100 || 0;
    const daysFactor = parseFloat(keepDays) * 50 || 0;
    const quantityFactor = parseFloat(quantity) * 200 || 0;

    return basePrice + weightFactor + daysFactor + quantityFactor;
  };

  const price = estimateData?.price || calculatePrice();

  // a fake destination address 
  const currentAddress = estimateData?.address || "123 Main Street, Lagos";
  const destinationAddress = "Warehouse Storage Facility, Ikeja";

  const [orderStatus, setOrderStatus] = useState("locating");
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [expandedPriceBreakdown, setExpandedPriceBreakdown] = useState(false);

  // Snap points for the bottom sheet (in percentage of screen height)
  const snapPoints = ["40%", "70%"];
  const [currentSnapIndex, setCurrentSnapIndex] = useState(0);


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

  
  useEffect(() => {
    if (orderStatus === "locating") {
      const interval = setInterval(() => {
        setLoadingProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            
            setTimeout(() => setOrderStatus("onWay"), 500);
            return 100;
          }
          return prev + 5;
        });
      }, 1000);

      return () => clearInterval(interval);
    }

 
    if (orderStatus === "onWay") {
      const timeout = setTimeout(() => {
        setOrderStatus("arrived");
      }, 10000);

      return () => clearTimeout(timeout);
    }
  }, [orderStatus]);


 const handlePayment = () => {
   
   navigation.navigate(ROUTES.STORAGE_RATE_ORDER, {
     driverInfo,
     deliveryLocation: {
       latitude: 6.6018,
       longitude: 3.3515,
     },
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


  const getWarehouseInfo = () => {

    const warehouseImage = warehouse_img;


    const warehouseName = "Premium Storage";
    const warehouseId = "#WH-1234";


    let statusBadgeStyle, statusText;

    switch (orderStatus) {
      case "locating":
        statusBadgeStyle = styles.statusBadge;
        statusText = "pending";
        break;
      case "onWay":
        statusBadgeStyle = styles.statusBadgeOngoing;
        statusText = "on-going";
        break;
      case "arrived":
        statusBadgeStyle = styles.statusBadgeArrived;
        statusText = "has-arrived";
        break;
      default:
        statusBadgeStyle = styles.statusBadge;
        statusText = "pending";
    }

    return (
      <View style={styles.vehicleInfoContainer}>
        <Image source={warehouseImage} style={styles.vehicleImage} />
        <View>
   
          {(statusText === "on-going" || statusText === "has-arrived") && (
            <>
              <Text style={styles.vehicleName}>{warehouseName}</Text>
              <Text style={styles.vehicleId}>{warehouseId}</Text>
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
              We're processing your storage request...
            </Text>

            <View style={styles.loadingBarContainer}>
              <View
                style={[styles.loadingBar, { width: `${loadingProgress}%` }]}
              />
            </View>

            {getWarehouseInfo()}

            <View style={styles.storageDetailsSection}>
              <View style={styles.addressSection}>
                <View style={styles.addressInputContainer}>
                  <View style={styles.addressIconContainer}>
                    <View style={styles.originDot} />
                  </View>
                  <View style={styles.addressTextContainer}>
                    <Text style={styles.addressText} numberOfLines={1}>
                      {currentAddress}
                    </Text>
                  </View>
                </View>

                <View style={styles.lineConnectorContainer}>
                  <View style={styles.lineConnector} />
                </View>

                <View style={styles.addressInputContainer}>
                  <View style={styles.addressIconContainer}>
                    <View style={styles.destinationDot} />
                  </View>
                  <View style={styles.addressTextContainer}>
                    <Text style={styles.addressText} numberOfLines={1}>
                      {destinationAddress}
                    </Text>
                  </View>
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

            {getWarehouseInfo()}

            <View style={styles.storageDetailsSection}>
         
              <View style={styles.addressSection}>
                <View style={styles.addressInputContainer}>
                  <View style={styles.addressIconContainer}>
                    <View style={styles.originDot} />
                  </View>
                  <View style={styles.addressTextContainer}>
                    <Text style={styles.addressText} numberOfLines={1}>
                      {currentAddress}
                    </Text>
                  </View>
                </View>

                <View style={styles.lineConnectorContainer}>
                  <View style={styles.lineConnector} />
                </View>

                <View style={styles.addressInputContainer}>
                  <View style={styles.addressIconContainer}>
                    <View style={styles.destinationDot} />
                  </View>
                  <View style={styles.addressTextContainer}>
                    {/* <Text style={styles.addressLabel}>Storage Facility</Text> */}
                    <Text style={styles.addressText} numberOfLines={1}>
                      {destinationAddress}
                    </Text>
                  </View>
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
                  <Text style={styles.priceItemLabel}>Base Storage Fee</Text>
                  <Text style={styles.priceItemValue}>
                    ₦{(price * 0.6).toFixed(0)}
                  </Text>
                </View>
                <View style={styles.priceItem}>
                  <Text style={styles.priceItemLabel}>Pick-up Fee</Text>
                  <Text style={styles.priceItemValue}>
                    ₦{(price * 0.3).toFixed(0)}
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

            {getWarehouseInfo()}

            <View style={styles.storageDetailsSection}>
              <View style={styles.addressSection}>
                <View style={styles.addressInputContainer}>
                  <View style={styles.addressIconContainer}>
                    <View style={styles.originDot} />
                  </View>
                  <View style={styles.addressTextContainer}>
                    <Text style={styles.addressText} numberOfLines={1}>
                      {currentAddress}
                    </Text>
                  </View>
                </View>

                <View style={styles.lineConnectorContainer}>
                  <View style={styles.lineConnector} />
                </View>

                <View style={styles.addressInputContainer}>
                  <View style={styles.addressIconContainer}>
                    <View style={styles.destinationDot} />
                  </View>
                  <View style={styles.addressTextContainer}>
                    <Text style={styles.addressText} numberOfLines={1}>
                      {destinationAddress}
                    </Text>
                  </View>
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
                  <Text style={styles.priceItemLabel}>Base Storage Fee</Text>
                  <Text style={styles.priceItemValue}>
                    ₦{(price * 0.6).toFixed(0)}
                  </Text>
                </View>
                <View style={styles.priceItem}>
                  <Text style={styles.priceItemLabel}>Pick-up Fee</Text>
                  <Text style={styles.priceItemValue}>
                    ₦{(price * 0.3).toFixed(0)}
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
          pickupLocation={{ latitude: 6.455, longitude: 3.4044 }} // Example coordinates for Lagos
          deliveryLocation={{ latitude: 6.6018, longitude: 3.3515 }}
          routePoints={[
            { latitude: 6.455, longitude: 3.4044 },
            { latitude: 6.6018, longitude: 3.3515 },
          ]}
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

export default ProcessStorageOrder;

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

  // Locating Container Styles
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

  // Warehouse Info Styles
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

  // Storage Details Styles
  storageDetailsSection: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 12,
  },
  detailsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  detailItem: {
    alignItems: "center",
    flex: 1,
  },
  detailLabel: {
    fontSize: 12,
    color: "#666",
    marginBottom: 4,
  },
  detailValue: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },

  // Address Section Styles
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

  // Button Styles
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

  // Driver Container Styles
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

  priceBreakdownButton: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 12,
    borderTopWidth: 1,
    // borderBottomWidth: 1,
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
});

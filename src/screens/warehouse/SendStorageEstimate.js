import React, { useState, useEffect } from "react";
import {
  Dimensions,
  StyleSheet,
  Text,
  View,
  Switch,
  Image,
  FlatList,
  TextInput,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Platform,
  StatusBar,
} from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import { Feather, Ionicons } from "@expo/vector-icons";
import { ROUTES } from "../../navigation/routes";
import CustomBackButton from "../../components/common/CustomBackButton";

const SendStorageEstimate = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { width } = Dimensions.get("window");

 
  const { estimateData } = route.params || {};


  const [weight, setWeight] = useState(estimateData?.weight || "");
  const [quantity, setQuantity] = useState(estimateData?.quantity || "");
  const [keepDays, setKeepDays] = useState(estimateData?.keepDays || "");
  const [itemValue, setItemValue] = useState(estimateData?.itemValue || "");
  const [isInsured, setIsInsured] = useState(estimateData?.isInsured || false);
  const [useMyDetails, setUseMyDetails] = useState(
    estimateData?.useMyDetails || true
  );
  const [address, setAddress] = useState(estimateData?.address || "");
  const [phoneNumber, setPhoneNumber] = useState(
    estimateData?.phoneNumber || ""
  );
  const [uploadedImages, setUploadedImages] = useState(
    estimateData?.images || []
  );
  const [location, setLocation] = useState({
    name: estimateData?.location || "Unknown Location",
  });
  const [expandedPriceBreakdown, setExpandedPriceBreakdown] = useState(false);

  // Price calculation
  const calculatePrice = () => {
    const basePrice = 500;
    const weightFactor = parseFloat(weight) * 100 || 0;
    const daysFactor = parseFloat(keepDays) * 50 || 0;
    const quantityFactor = parseFloat(quantity) * 200 || 0;

    return basePrice + weightFactor + daysFactor + quantityFactor;
  };

  const [price, setPrice] = useState(calculatePrice());

 
  useEffect(() => {
    setPrice(calculatePrice());
  }, [weight, quantity, keepDays]);


  const handleChange = () => {
    navigation.goBack();
  };

  const handleSend = () => {
    const calculatedPrice = calculatePrice();

    const orderData = {
      estimateData: {
        weight,
        quantity,
        keepDays,
        itemValue,
        isInsured,
        address,
        phoneNumber,
        location: location.name,
        images: uploadedImages,
        useMyDetails,
        price: calculatedPrice,
      },
    };

    navigation.navigate(ROUTES.PROCESS_STORAGE_ORDER, orderData);
  };

  // Render image item for carousel
  const renderImageItem = ({ item }) => (
    <View style={[styles.imageContainer, { width: width - 32 }]}>
      <Image
        source={{ uri: item.uri }}
        style={styles.itemImage}
        resizeMode="cover"
      />
    </View>
  );

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeAreaContainer}>
        {/* Header */}
        <View style={styles.header}>
          <CustomBackButton
            containerStyle={styles.backButton}
            iconColor="#333333"
          />

          <View style={styles.locationContainer}>
            <View style={styles.locationBadge}>
              <Feather
                name="map-pin"
                size={16}
                color="#000"
                style={styles.locationIcon}
              />
              <Text style={styles.locationText} numberOfLines={1}>
                {location.name}
              </Text>
            </View>
          </View>

          <TouchableOpacity
            onPress={handleChange}
            style={styles.changeButton}
            disabled={true}
          >
            <Text style={styles.changeText}>Change</Text>
          </TouchableOpacity>
        </View>

   
        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollViewContent}
        >
     
          {uploadedImages.length > 0 && (
            <View style={styles.carouselContainer}>
              <FlatList
                data={uploadedImages}
                renderItem={renderImageItem}
                keyExtractor={(item) => item.id}
                horizontal
                showsHorizontalScrollIndicator={false}
                pagingEnabled
                snapToAlignment="center"
                decelerationRate="fast"
              />
              <Text style={styles.imageCountText}>
                {uploadedImages.length}{" "}
                {uploadedImages.length === 1 ? "image" : "images"} uploaded
              </Text>
            </View>
          )}


          <View style={styles.inputRow}>
            <View style={styles.inputContainer}>
              <TextInput
                style={[styles.input, styles.disabledInput]}
                placeholder="Weight (kg)"
                value={weight}
                editable={false}
              />
            </View>

            <View style={styles.inputContainer}>
              <TextInput
                style={[styles.input, styles.disabledInput]}
                placeholder="Quantity"
                value={quantity}
                editable={false}
              />
            </View>

            <View style={styles.inputContainer}>
              <TextInput
                style={[styles.input, styles.disabledInput]}
                placeholder="Keep Days"
                value={keepDays}
                editable={false}
              />
            </View>
          </View>


          <View style={styles.valueInsuranceContainer}>
            <View style={styles.valueContainer}>
              <TextInput
                style={[styles.valueInput, styles.disabledInput]}
                placeholder="Item Value"
                value={itemValue}
                editable={false}
              />
            </View>

            <View style={styles.insuranceContainer}>
              <Text style={styles.inputLabel}>Is Item Insured?</Text>
              <View style={styles.radioContainer}>
                <View style={styles.radioOption}>
                  <View
                    style={[
                      styles.radioCircle,
                      { borderColor: isInsured ? "#005DD2" : "#AAAAAA" },
                    ]}
                  >
                    {isInsured && <View style={styles.radioInnerCircle} />}
                  </View>
                  <Text style={styles.radioText}>Yes</Text>
                </View>

                <View style={styles.radioOption}>
                  <View
                    style={[
                      styles.radioCircle,
                      { borderColor: !isInsured ? "#005DD2" : "#AAAAAA" },
                    ]}
                  >
                    {!isInsured && <View style={styles.radioInnerCircle} />}
                  </View>
                  <Text style={styles.radioText}>No</Text>
                </View>
              </View>
            </View>
          </View>


          <Text style={styles.sectionTitle}>Pick Up</Text>

          <View style={styles.switchRow}>
            <Text style={styles.switchLabel}>Use my details</Text>
            <Switch
              trackColor={{ false: "#E0E0E0", true: "#81b0ff" }}
              thumbColor={useMyDetails ? "#005DD2" : "#f4f3f4"}
              ios_backgroundColor="#E0E0E0"
              value={useMyDetails}
              disabled={true}
              style={styles.switch}
            />
          </View>

          <View style={styles.fullInputContainer}>
            <TextInput
              style={[styles.fullInput, styles.disabledInput]}
              placeholder="Address"
              value={address}
              editable={false}
            />
          </View>

          <View style={styles.fullInputContainer}>
            <TextInput
              style={[styles.fullInput, styles.disabledInput]}
              placeholder="Phone number"
              value={phoneNumber}
              editable={false}
            />
          </View>
        </ScrollView>


        <View style={styles.footerContainer}>
  
          <View style={styles.tripInfoContainer}>
            <View style={styles.tripInfo}>
              <View style={styles.infoIconContainer}>
                <Ionicons name="cash-outline" size={18} color="#005DD2" />
              </View>
              <Text style={styles.tripInfoText}>₦{price}</Text>
            </View>
            <View style={styles.tripInfo}>
              <View style={styles.infoIconContainer}>
                <Ionicons name="time-outline" size={18} color="#005DD2" />
              </View>
              <Text style={styles.tripInfoText}>8 mins</Text>
            </View>
          </View>

         
          <TouchableOpacity
            style={styles.priceBreakdownButton}
            onPress={() => setExpandedPriceBreakdown(!expandedPriceBreakdown)}
          >
            <Text style={styles.priceBreakdownText}>
              {expandedPriceBreakdown ? "Hide" : "Show"} price breakdown
            </Text>
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

       
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.sendButton}
              onPress={handleSend}
              activeOpacity={0.8}
            >
              <Text style={styles.sendButtonText}>Send</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    // paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  safeAreaContainer: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    // borderBottomWidth: 1,
    // borderBottomColor: "#F5F5F5",
    marginTop:35
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5F5F5",
    borderRadius: 20,

    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
   
    elevation: 2,
    marginRight: 12,
  },
  locationContainer: {
    flex: 1,
    alignItems: "center",
  },
  locationBadge: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 12,
    paddingVertical: 6,
    maxWidth: "80%",
  },
  locationIcon: {
    marginRight: 3,
  },
  locationText: {
    fontSize: 16,
    color: "#000",
    fontWeight: "600",
    textAlign: "center",
  },
  changeButton: {
    paddingVertical: 8,
    alignItems: "flex-end",
    width: 60,
  },
  changeText: {
    fontSize: 14,
    color: "#005DD2",
    fontWeight: "500",
    borderBottomWidth: 1,
    borderBottomColor: "#005DD2",
  },
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    padding: 16,
    paddingBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#333333",
    marginVertical: 12,
  },
  carouselContainer: {
    width: "100%",
    height: 240,
    marginBottom: 20,
  },
  imageContainer: {
    height: 200,
    borderRadius: 12,
    overflow: "hidden",
    marginRight: 8,
  },
  itemImage: {
    width: "100%",
    height: "100%",
  },
  imageCountText: {
    fontSize: 14,
    color: "#666666",
    textAlign: "center",
    marginTop: 8,
  },
  inputRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  inputContainer: {
    width: "30%",
  },
  inputLabel: {
    fontSize: 14,
    color: "#666666",
    marginBottom: 4,
  },
  input: {
    height: 48,
    backgroundColor: "#F7F8FA",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#DDDDDD",
    paddingHorizontal: 12,
    fontSize: 14,
    color: "#333333",
  },
  valueInsuranceContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  valueContainer: {
    width: "62%",
  },
  valueInput: {
    height: 48,
    backgroundColor: "#F5F5F5",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#DDDDDD",
    paddingHorizontal: 12,
    fontSize: 14,
    color: "#333333",
  },
  insuranceContainer: {
    width: "35%",
  },
  radioContainer: {
    flexDirection: "row",
    justifyContent: "flex-start",
    height: 28,
    alignItems: "center",
    marginTop: 4,
  },
  radioOption: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 16,
  },
  radioCircle: {
    height: 18,
    width: 18,
    borderRadius: 9,
    borderWidth: 2,
    borderColor: "#005DD2",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 6,
  },
  radioInnerCircle: {
    height: 8,
    width: 8,
    borderRadius: 4,
    backgroundColor: "#005DD2",
  },
  radioText: {
    fontSize: 14,
    color: "#333333",
  },
  switchRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 5,
    marginBottom: 12,
  },
  switchLabel: {
    fontSize: 15,
    fontWeight: "500",
    color: "#333333",
  },
  switch: {
    transform: [{ scaleX: 0.9 }, { scaleY: 0.9 }],
  },
  fullInputContainer: {
    marginBottom: 16,
  },
  fullInput: {
    height: 48,
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#DDDDDD",
    paddingHorizontal: 12,
    fontSize: 14,
    color: "#333333",
  },
  disabledInput: {
    backgroundColor: "#F5F5F5",
    color: "#777777",
  },
  footerContainer: {
    borderTopWidth: 1,
    borderTopColor: "#EEEEEE",
    paddingTop: 8,
    backgroundColor: "#FFFFFF",
  },
  buttonContainer: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    marginTop: 8,
  },
  sendButton: {
    height: 52,
    backgroundColor: "#005DD2",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sendButtonText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  tripInfoContainer: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 16,
    paddingVertical: 8,
  },
  tripInfo: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#E3F0FF",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
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
    paddingVertical: 8,
    gap: 5,
  },
  priceBreakdownText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#005DD2",
  },
  priceBreakdownContainer: {
    backgroundColor: "#F9F9F9",
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 16,
    marginTop: 4,
  },
  priceItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  priceItemLabel: {
    color: "#666666",
    fontSize: 14,
  },
  priceItemValue: {
    color: "#333333",
    fontWeight: "500",
    fontSize: 14,
  },
  priceDivider: {
    height: 1,
    backgroundColor: "#EEEEEE",
    marginVertical: 10,
  },
  priceTotal: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  priceTotalLabel: {
    fontWeight: "600",
    color: "#333333",
    fontSize: 16,
  },
  priceTotalValue: {
    fontWeight: "700",
    color: "#005DD2",
    fontSize: 18,
  },
});

export default SendStorageEstimate;

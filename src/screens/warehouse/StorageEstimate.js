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
  Alert,
} from "react-native";
import React, { useState, useEffect } from "react";
import { useRoute, useNavigation } from "@react-navigation/native";
import { Feather } from "@expo/vector-icons";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import * as ImagePicker from "expo-image-picker";
import CustomBackButton from "../../components/common/CustomBackButton";

const StorageEstimate = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { location } = route.params || {
    location: { name: "Unknown Location" },
  };

  const [weight, setWeight] = useState("");
  const [quantity, setQuantity] = useState("");
  const [keepDays, setKeepDays] = useState("");
  const [itemValue, setItemValue] = useState("");
  const [isInsured, setIsInsured] = useState(false);
  const [useMyDetails, setUseMyDetails] = useState(true);
  const [address, setAddress] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [uploadedImages, setUploadedImages] = useState([]);

  useEffect(() => {
    (async () => {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permission Denied",
          "Sorry, we need camera roll permissions to upload images!"
        );
      }
    })();
  }, []);

  const handleBackPress = () => {
    navigation.goBack();
  };

  const handleImageUpload = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled) {
        const newImage = {
          id: Date.now().toString(),
          uri: result.assets[0].uri,
        };

        setUploadedImages([...uploadedImages, newImage]);
      }
    } catch (error) {
      Alert.alert("Error", "Failed to pick image: " + error.message);
    }
  };

  const handleSeeEstimate = () => {
    const estimateData = {
      weight,
      quantity,
      keepDays,
      itemValue,
      isInsured,
      address: useMyDetails ? "User default address" : address,
      phoneNumber: useMyDetails ? "User default phone" : phoneNumber,
      location: location.name,
      images: uploadedImages,
      useMyDetails,
    };

    navigation.navigate("SendStorageEstimate", { estimateData });
  };

  const renderImageItem = ({ item }) => (
    <View style={styles.imageContainer}>
      <Image
        source={{ uri: item.uri }}
        style={styles.itemImage}
        resizeMode="cover"
      />
    </View>
  );

  const handleChange = () => {
    console.log("Change location pressed");
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={handleBackPress}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            activeOpacity={0.7}
          >
            <Feather name="arrow-left" size={22} color="#333333" />
          </TouchableOpacity>

          <View style={styles.locationContainer}>
            <View style={styles.locationBadge}>
              <Feather
                name="map-pin"
                size={16}
                color="#000"
                style={styles.locationIcon}
              />
              <Text style={styles.locationText}>{location.name}</Text>
            </View>
          </View>

          <TouchableOpacity onPress={handleChange} style={styles.changeButton}>
            <Text style={styles.changeText}>Change</Text>
          </TouchableOpacity>
        </View>

        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
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

          <View style={styles.uploadSection}>
            <TouchableOpacity
              style={styles.uploadButton}
              onPress={handleImageUpload}
              activeOpacity={0.7}
            >
              <MaterialCommunityIcons
                name="file-image-plus"
                size={16}
                color="#005DD2"
                style={styles.locationIcon}
              />
              <Text style={styles.uploadText}>Upload Image of item(s)</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.inputRow}>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Weight (kg)"
                keyboardType="numeric"
                value={weight}
                onChangeText={setWeight}
              />
            </View>

            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Quantity"
                keyboardType="numeric"
                value={quantity}
                onChangeText={setQuantity}
              />
            </View>

            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Keep Days"
                keyboardType="numeric"
                value={keepDays}
                onChangeText={setKeepDays}
              />
            </View>
          </View>

          <View style={styles.valueInsuranceContainer}>
            <View style={styles.valueContainer}>
              <TextInput
                style={styles.valueInput}
                placeholder="Item Value"
                keyboardType="numeric"
                value={itemValue}
                onChangeText={setItemValue}
              />
            </View>

            <View style={styles.insuranceContainer}>
              <Text style={styles.inputLabel}>Is Item Insured?</Text>
              <View style={styles.radioContainer}>
                <TouchableOpacity
                  style={styles.radioOption}
                  onPress={() => setIsInsured(true)}
                >
                  <View style={styles.radioCircle}>
                    {isInsured && <View style={styles.radioInnerCircle} />}
                  </View>
                  <Text style={styles.radioText}>Yes</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.radioOption}
                  onPress={() => setIsInsured(false)}
                >
                  <View style={styles.radioCircle}>
                    {!isInsured && <View style={styles.radioInnerCircle} />}
                  </View>
                  <Text style={styles.radioText}>No</Text>
                </TouchableOpacity>
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
              onValueChange={() => setUseMyDetails(!useMyDetails)}
              value={useMyDetails}
              style={styles.switch}
            />
          </View>

          <View style={styles.fullInputContainer}>
            <TextInput
              style={[styles.fullInput, useMyDetails && styles.disabledInput]}
              placeholder="Address"
              value={address}
              onChangeText={setAddress}
              editable={!useMyDetails}
            />
          </View>

          <View style={styles.fullInputContainer}>
            <TextInput
              style={[styles.fullInput, useMyDetails && styles.disabledInput]}
              placeholder="Phone number"
              keyboardType="phone-pad"
              value={phoneNumber}
              onChangeText={setPhoneNumber}
              editable={!useMyDetails}
            />
          </View>
        </ScrollView>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.estimateButton}
            onPress={handleSeeEstimate}
            activeOpacity={0.8}
          >
            <Text style={styles.estimateButtonText}>See Estimate</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default StorageEstimate;

const { width } = Dimensions.get("window");

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    // paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    // paddingVertical: 12,
    // borderBottomWidth: 1,
    borderBottomColor: "#EEEEEE",
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
    borderRadius: 50,
  },
  locationIcon: {
    marginRight: 3,
  },
  locationText: {
    fontSize: 18,
    color: "#000",
    fontWeight: "600",
    alignSelf: "center",
    textAlign: "center",
  },
  changeButton: {
    paddingVertical: 8,
    paddingHorizontal: 4,
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
    padding: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#333333",
    marginTop: 6,
  },
  uploadSection: {
    marginBottom: 10,
  },
  uploadButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    width: "100%",
    marginBottom: 10,
  },
  uploadText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#005DD2",
    marginLeft: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#005DD2",
  },
  carouselContainer: {
    width: "100%",
    height: 260,
    marginBottom: 20,
  },
  imageContainer: {
    width: width - 32,
    height: 234,
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
  },
  input: {
    height: 48,
    backgroundColor: "#F7F8FA",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#DDDDDD",
    paddingHorizontal: 12,
    fontSize: 16,
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
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#DDDDDD",
    paddingHorizontal: 12,
    fontSize: 16,
    color: "#333333",
  },
  insuranceContainer: {
    width: "35%",
  },
  radioContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    height: 28,
    alignItems: "center",
  },
  radioOption: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 16,
  },
  radioCircle: {
    height: 20,
    width: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#005DD2",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 8,
  },
  radioInnerCircle: {
    height: 10,
    width: 10,
    borderRadius: 5,
    backgroundColor: "#005DD2",
  },
  radioText: {
    fontSize: 14,
    color: "#333333",
  },
  switchRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 5,
    marginBottom: 5,
  },
  switchLabel: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333333",
  },
  switch: {
    transform: [{ scaleX: 1.2 }, { scaleY: 1.2 }],
    marginLeft: 8,
  },
  fullInputContainer: {
    marginBottom: 16,
  },
  fullInput: {
    height: 48,
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#DDDDDD",
    paddingHorizontal: 12,
    fontSize: 16,
    color: "#333333",
  },
  disabledInput: {
    backgroundColor: "#F5F5F5",
    color: "#AAAAAA",
  },
  buttonContainer: {
    padding: 16,
    // borderTopWidth: 1,
    // borderTopColor: "#F0F0F0",
  },
  estimateButton: {
    height: 56,
    backgroundColor: "#005DD2",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  estimateButtonText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#FFFFFF",
  },
});

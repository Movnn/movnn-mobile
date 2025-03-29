import React, { useRef, useState, useCallback, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  StatusBar,
  Image,
  TouchableOpacity,
  Dimensions,
  FlatList,
  Alert,
  ActivityIndicator,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import BottomSheet, {
  BottomSheetScrollView,
  BottomSheetBackdrop,
} from "@gorhom/bottom-sheet";
import { Ionicons, MaterialIcons, FontAwesome } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import { ROUTES } from "../../navigation/routes";
import userimg from "../../assets/images/user-img.png";
import MapComponent from "../../components/map/MapComponent";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

const driverInfo = {
  name: "John Doe",
  rating: 4.7,
  image: userimg,
};

const ProcessDelivery = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const navigation = useNavigation();
  const route = useRoute();
  const bottomSheetRef = useRef(null);
  const flatListRef = useRef(null);

  const { deliveryLocation, routePoints, price = 2300 } = route.params || {};

  const [paymentMethod, setPaymentMethod] = useState("wallet");
  const [uploadedImages, setUploadedImages] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [canScroll, setCanScroll] = useState(true);

  const snapPoints = ["40%", "85%"];
  const [currentSnapIndex, setCurrentSnapIndex] = useState(0);

  const galleryData = React.useMemo(() => {
    const data = [...uploadedImages];
    data.push({ isUploadButton: true, id: "upload-button" });
    return data;
  }, [uploadedImages]);

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
    if (uploadedImages.length > 0 && flatListRef.current) {
      try {
        setTimeout(() => {
          flatListRef.current.scrollToIndex({
            index: uploadedImages.length - 1,
            animated: true,
            viewPosition: 0.5,
          });
          setCurrentImageIndex(uploadedImages.length - 1);
        }, 100);
      } catch (error) {
        console.log("Scroll error:", error);
      }
    }
  }, [uploadedImages.length]);

  const handleScrollToIndexFailed = (info) => {
    const wait = new Promise((resolve) => setTimeout(resolve, 500));
    wait.then(() => {
      if (flatListRef.current) {
        flatListRef.current.scrollToIndex({
          index: info.index,
          animated: true,
          viewPosition: 0.5,
        });
      }
    });
  };

  const onViewableItemsChanged = useRef(({ viewableItems }) => {
    if (viewableItems.length > 0) {
      const index = viewableItems[0].index;
      if (index !== undefined && index < uploadedImages.length) {
        setCurrentImageIndex(index);
      }
    }
  }).current;

  const viewabilityConfig = {
    itemVisiblePercentThreshold: 50,
  };

  const handleUploadImage = async () => {
    Alert.alert(
      "Select Image Source",
      "Choose where you want to get the image from",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Camera",
          onPress: async () => {
            const { status } =
              await ImagePicker.requestCameraPermissionsAsync();

            if (status !== "granted") {
              Alert.alert(
                "Camera Permission",
                "We need camera access to take photos"
              );
              return;
            }

            const result = await ImagePicker.launchCameraAsync({
              allowsEditing: true,
              aspect: [4, 3],
              quality: 0.8,
            });

            if (!result.canceled && result.assets && result.assets.length > 0) {
              setUploadedImages([
                ...uploadedImages,
                {
                  uri: result.assets[0].uri,
                  id: Date.now().toString(),
                  loading: true,
                },
              ]);
            }
          },
        },
        {
          text: "Photo Library",
          onPress: async () => {
            const { status } =
              await ImagePicker.requestMediaLibraryPermissionsAsync();

            if (status !== "granted") {
              Alert.alert(
                "Gallery Permission",
                "We need gallery access to select photos"
              );
              return;
            }

            const result = await ImagePicker.launchImageLibraryAsync({
              mediaTypes: ImagePicker.MediaTypeOptions.Images,
              allowsEditing: true,
              aspect: [4, 3],
              quality: 0.8,
              allowsMultipleSelection: true,
            });

            if (!result.canceled && result.assets && result.assets.length > 0) {
              const newImages = result.assets.map((asset) => ({
                uri: asset.uri,
                id:
                  Date.now().toString() +
                  Math.random().toString(36).substring(2, 9),
                loading: true,
              }));

              setUploadedImages([...uploadedImages, ...newImages]);
            }
          },
        },
      ]
    );
  };

  const handleConfirmPayment = () => {
    if (uploadedImages.length === 0) {
      Alert.alert(
        "Evidence Required",
        "Please upload at least one photo as delivery evidence.",
        [{ text: "OK" }]
      );
      return;
    }

    setIsProcessing(true);

    setTimeout(() => {
      setIsProcessing(false);

      Alert.alert(
        "Payment Successful",
        "Your payment of ₦" + price + " has been processed successfully.",
        [
          {
            text: "Rate Order",
            onPress: () => {
              navigation.navigate(ROUTES.RATE_ORDER, {
                driverInfo: driverInfo,
                deliveryLocation: deliveryLocation,
                price: price,
              });
            },
          },
        ]
      );
    }, 1000);
  };

  const handleRemoveImage = (index) => {
    const newImages = [...uploadedImages];
    newImages.splice(index, 1);
    setUploadedImages(newImages);

    if (newImages.length === 0) {
      setCurrentImageIndex(0);
    } else if (currentImageIndex >= newImages.length) {
      setCurrentImageIndex(newImages.length - 1);
    }
  };

  const scrollToImage = (index) => {
    if (
      flatListRef.current &&
      uploadedImages.length > 0 &&
      index >= 0 &&
      index < uploadedImages.length
    ) {
      try {
        flatListRef.current.scrollToIndex({
          index,
          animated: true,
          viewPosition: 0.5,
        });
        setCurrentImageIndex(index);
      } catch (error) {
        console.log("Scroll error:", error);
      }
    }
  };

  const goToPreviousImage = () => {
    if (currentImageIndex > 0) {
      scrollToImage(currentImageIndex - 1);
    }
  };

  const goToNextImage = () => {
    if (currentImageIndex < uploadedImages.length - 1) {
      scrollToImage(currentImageIndex + 1);
    } else {
      flatListRef.current?.scrollToIndex({
        index: uploadedImages.length,
        animated: true,
        viewPosition: 0.5,
      });
    }
  };

  const renderItem = ({ item, index }) => {
    if (item.isUploadButton) {
      return (
        <TouchableOpacity
          style={styles.uploadButton}
          onPress={handleUploadImage}
        >
          <View style={styles.placeholderContainer}>
            <MaterialIcons
              name="add-photo-alternate"
              size={40}
              color="#005DD2"
            />
            <Text style={styles.placeholderText}>Add Photo</Text>
          </View>
        </TouchableOpacity>
      );
    }

    return (
      <View style={styles.imagePreviewContainer}>
        <TouchableOpacity
          style={[
            styles.imagePreview,
            index === currentImageIndex && styles.activeImagePreview,
          ]}
          activeOpacity={0.8}
        >
          {item.uri === "placeholder" ? (
            <View style={styles.placeholderContainer}>
              <MaterialIcons name="image" size={40} color="#AAD5FF" />
              <Text style={styles.placeholderText}>Image</Text>
            </View>
          ) : (
            <Image
              source={{ uri: item.uri }}
              style={styles.uploadedImage}
              resizeMode="cover"
              onLoadStart={() => {
                const newImages = [...uploadedImages];
                newImages[index] = {
                  ...newImages[index],
                  loading: true,
                };
                setUploadedImages(newImages);
              }}
              onLoadEnd={() => {
                const newImages = [...uploadedImages];
                newImages[index] = {
                  ...newImages[index],
                  loading: false,
                };
                setUploadedImages(newImages);
              }}
            />
          )}
          {item.loading && (
            <View style={styles.imageLoadingIndicator}>
              <ActivityIndicator size="small" color="#005DD2" />
            </View>
          )}
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.removeImageButton}
          onPress={() => handleRemoveImage(index)}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons name="close-circle" size={24} color="#FF5722" />
        </TouchableOpacity>
      </View>
    );
  };

  const renderNavButtons = () => {
    if (uploadedImages.length <= 1) return null;

    return (
      <View style={styles.navButtonsContainer}>
        <TouchableOpacity
          style={[
            styles.navButton,
            currentImageIndex === 0 && styles.navButtonDisabled,
          ]}
          onPress={goToPreviousImage}
          disabled={currentImageIndex === 0}
        >
          <Ionicons
            name="chevron-back"
            size={24}
            color={currentImageIndex === 0 ? "#CCCCCC" : "#005DD2"}
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.navButton,
            currentImageIndex === uploadedImages.length - 1 &&
              styles.navButtonDisabled,
          ]}
          onPress={goToNextImage}
          disabled={currentImageIndex === uploadedImages.length - 1}
        >
          <Ionicons
            name="chevron-forward"
            size={24}
            color={
              currentImageIndex === uploadedImages.length - 1
                ? "#CCCCCC"
                : "#005DD2"
            }
          />
        </TouchableOpacity>
      </View>
    );
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
          pickupLocation={null}
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
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.driverInfoHeader}>
            <View style={styles.driverProfile}>
              <Image source={driverInfo.image} style={styles.driverImage} />
              <View style={styles.driverDetails}>
                <Text style={styles.driverName}>
                  {driverInfo.name} has delivered the item
                </Text>
                <View style={styles.ratingContainer}>
                  <FontAwesome name="star" size={16} color="#FFD700" />
                  <Text style={styles.ratingText}>{driverInfo.rating}</Text>
                </View>
              </View>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionSubtitle}>Delivery Evidence:</Text>

            <View style={styles.uploadContainer}>
              {renderNavButtons()}

              <FlatList
                ref={flatListRef}
                data={galleryData}
                renderItem={renderItem}
                keyExtractor={(item) => item.id}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.uploadScrollContainer}
                onViewableItemsChanged={onViewableItemsChanged}
                viewabilityConfig={viewabilityConfig}
                getItemLayout={(data, index) => ({
                  length: 135,
                  offset: 135 * index,
                  index,
                })}
                snapToInterval={135}
                snapToAlignment="center"
                decelerationRate="fast"
                pagingEnabled={false}
                bounces={true}
                style={styles.flatList}
                scrollEnabled={canScroll}
                onScrollBeginDrag={() => setCanScroll(true)}
                onScrollEndDrag={() => setCanScroll(true)}
                onMomentumScrollEnd={() => setCanScroll(true)}
                onScrollToIndexFailed={handleScrollToIndexFailed}
              />
            </View>

            {uploadedImages.length > 0 && (
              <View style={styles.dotsContainer}>
                {uploadedImages.map((_, index) => (
                  <TouchableOpacity
                    key={index}
                    style={[
                      styles.dot,
                      currentImageIndex === index && styles.activeDot,
                    ]}
                    onPress={() => scrollToImage(index)}
                  />
                ))}
              </View>
            )}

            <View style={styles.uploadIndicator}>
              <Text style={styles.uploadCounter}>
                {uploadedImages.length}{" "}
                {uploadedImages.length === 1 ? "image" : "images"} uploaded
              </Text>
            </View>

            <Text style={styles.disclaimer}>
              *please confirm the item was delivered safely
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionSubtitle}>To Pay:</Text>
            <Text style={styles.priceText}>₦{price}</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionSubtitle}>Mode of Payment:</Text>
            <View style={styles.paymentOptions}>
              <TouchableOpacity
                style={[
                  styles.paymentOption,
                  paymentMethod === "wallet" && styles.paymentOptionSelected,
                ]}
                onPress={() => setPaymentMethod("wallet")}
              >
                <View style={styles.radioButton}>
                  {paymentMethod === "wallet" && (
                    <View style={styles.radioButtonInner} />
                  )}
                </View>
                <View>
                  <Text style={styles.paymentOptionText}>Wallet</Text>
                  <Text style={styles.paymentOptionSubtext}>
                    Balance: ₦120,929
                  </Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.paymentOption,
                  paymentMethod === "cash" && styles.paymentOptionSelected,
                ]}
                onPress={() => setPaymentMethod("cash")}
              >
                <View style={styles.radioButton}>
                  {paymentMethod === "cash" && (
                    <View style={styles.radioButtonInner} />
                  )}
                </View>
                <Text style={styles.paymentOptionText}>Cash</Text>
              </TouchableOpacity>
            </View>
          </View>

          <TouchableOpacity
            style={[
              styles.confirmButton,
              isProcessing && styles.disabledButton,
            ]}
            onPress={handleConfirmPayment}
            disabled={isProcessing}
          >
            {isProcessing ? (
              <View style={styles.processingContainer}>
                <ActivityIndicator size="small" color="#FFFFFF" />
                <Text style={[styles.confirmButtonText, { marginLeft: 10 }]}>
                  Processing...
                </Text>
              </View>
            ) : (
              <Text style={styles.confirmButtonText}>Pay ₦{price}</Text>
            )}
          </TouchableOpacity>
        </BottomSheetScrollView>
      </BottomSheet>
    </SafeAreaView>
  );
};

export default ProcessDelivery;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  driverInfoHeader: {
    paddingHorizontal: 16,
    paddingBottom: 15,
    backgroundColor: "#FFFFFF",
    zIndex: 10,
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
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginTop: 10,
    marginBottom: 10,
    textAlign: "center",
  },
  section: {
    marginBottom: 24,
  },
  sectionSubtitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 10,
  },
  uploadContainer: {
    width: "100%",
    marginBottom: 5,
    borderWidth: 1,
    borderColor: "#EEEEEE",
    borderRadius: 12,
    paddingVertical: 10,
    backgroundColor: "#FCFCFC",
    position: "relative",
  },
  flatList: {
    width: "100%",
    height: 130,
  },
  uploadScrollContainer: {
    alignItems: "center",
    paddingHorizontal: 10,
  },
  imagePreviewContainer: {
    position: "relative",
    marginRight: 15,
    width: 120,
    height: 120,
  },
  imagePreview: {
    width: 120,
    height: 120,
    backgroundColor: "#F9F9F9",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#EEE",
    overflow: "hidden",
  },
  activeImagePreview: {
    borderWidth: 2,
    borderColor: "#005DD2",
    transform: [{ scale: 1.05 }],
  },
  uploadButton: {
    width: 120,
    height: 120,
    backgroundColor: "#E3F0FF",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 5,
  },
  uploadedImage: {
    width: "100%",
    height: "100%",
    borderRadius: 10,
  },
  imageLoadingIndicator: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.5)",
  },
  removeImageButton: {
    position: "absolute",
    top: -8,
    right: -8,
    backgroundColor: "white",
    borderRadius: 15,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    zIndex: 10,
    padding: 2,
  },
  placeholderContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  placeholderText: {
    marginTop: 8,
    fontSize: 14,
    color: "#666",
  },
  uploadIndicator: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 5,
    marginTop: 5,
  },
  uploadCounter: {
    fontSize: 14,
    color: "#666",
  },
  scrollHint: {
    fontSize: 14,
    color: "#005DD2",
    fontStyle: "italic",
    marginLeft: 5,
  },
  disclaimer: {
    fontSize: 14,
    color: "#666",
    fontStyle: "italic",
    marginTop: 8,
  },
  priceText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#2C3A4B",
  },
  paymentOptions: {
    marginTop: 10,
  },
  paymentOption: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 10,
    marginBottom: 10,
    // backgroundColor: "#F9F9F9",
  },
  paymentOptionSelected: {
    backgroundColor: "#E3F0FF",
  },
  radioButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#005DD233",
    backgroundColor: "#005DD233",
    overflow: "hidden",
    marginRight: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  radioButtonInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#005DD2",
  },
  paymentOptionText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333",
  },
  paymentOptionSubtext: {
    fontSize: 14,
    color: "#666",
    marginTop: 2,
  },
  confirmButton: {
    backgroundColor: "#005DD2",
    borderRadius: 50,
    paddingVertical: 16,
    alignItems: "center",
    marginTop: 20,
  },
  confirmButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  dotsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
    marginBottom: 5,
    height: 20,
    flexWrap: "wrap",
  },
  dot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: "#CCCCCC",
    marginHorizontal: 4,
    marginVertical: 2,
    borderWidth: 1,
    borderColor: "#BBBBBB",
  },
  activeDot: {
    backgroundColor: "#005DD2",
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 1,
    borderColor: "#0048A6",
  },
  navButtonsContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 5,
    zIndex: 10,
    pointerEvents: "box-none",
  },
  navButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
  },
  navButtonDisabled: {
    backgroundColor: "rgba(240, 240, 240, 0.8)",
  },
  processingContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  disabledButton: {
    backgroundColor: "#7BAAE0",
  },
});

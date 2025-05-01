import React, { useState, useRef, useCallback } from "react";
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  StatusBar,
  Image,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useDispatch } from "react-redux";
import BottomSheet, {
  BottomSheetScrollView,
  BottomSheetBackdrop,
} from "@gorhom/bottom-sheet";
import { FontAwesome } from "@expo/vector-icons";
import { ROUTES } from "../../navigation/routes";
import MapComponent from "../../components/map/MapComponent";
import orderApi from "../../api/orderApi";
import { clearOrderProcess } from "../../store/slices/orderSlice";

const RateOrder = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const dispatch = useDispatch();
  const bottomSheetRef = useRef(null);

  const { driverInfo, deliveryLocation, price, orderId } = route.params || {};

  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const snapPoints = ["60%", "85%"];
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

  const handleSubmitRating = async () => {
    if (rating === 0) {
      Alert.alert(
        "Rating Required",
        "Please select a rating before submitting."
      );
      return;
    }

    setIsSubmitting(true);

    try {

      if (orderId) {
        await orderApi.rateDriver(orderId, rating);

   
        dispatch(clearOrderProcess());

        Alert.alert(
          "Thank You!",
          "Your rating has been submitted successfully.",
          [
            {
              text: "OK",
              onPress: () => navigation.navigate(ROUTES.HOME),
            },
          ]
        );
      } else {
        // For demo purposes
        setTimeout(() => {
          dispatch(clearOrderProcess());

          navigation.navigate(ROUTES.HOME);
        }, 1000);
      }
    } catch (error) {
      Alert.alert(
        "Rating Error",
        "There was a problem submitting your rating. Please try again."
      );
      console.error("Rating submission error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getRatingDescription = () => {
    switch (rating) {
      case 1:
        return "Poor";
      case 2:
        return "Fair";
      case 3:
        return "Good";
      case 4:
        return "Very Good";
      case 5:
        return "Excellent";
      default:
        return "Select your rating";
    }
  };

  const renderRatingStars = () => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <TouchableOpacity
          key={i}
          onPress={() => setRating(i)}
          style={styles.starContainer}
        >
          <FontAwesome
            name={i <= rating ? "star" : "star-o"}
            size={36}
            color={i <= rating ? "#FFD700" : "#CCCCCC"}
          />
        </TouchableOpacity>
      );
    }
    return stars;
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
          routePoints={null}
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
          <View style={styles.sheetContentContainer}>
            <Text style={styles.rateTitle}>Rate Our Mover</Text>

            <View style={styles.driverInfoHeader}>
              <View style={styles.driverProfile}>
                <Image source={driverInfo?.image} style={styles.driverImage} />
                <View style={styles.driverDetails}>
                  <Text style={styles.driverName}>
                    {driverInfo?.name} has delivered the item
                  </Text>
                  <View style={styles.ratingContainer}>
                    <FontAwesome name="star" size={16} color="#FFD700" />
                    <Text style={styles.ratingText}>{driverInfo?.rating}</Text>
                  </View>
                </View>
              </View>
            </View>

            <View style={styles.ratingStarsContainer}>
              <View style={styles.starsContainer}>{renderRatingStars()}</View>
              <Text style={styles.ratingDescription}>
                {getRatingDescription()}
              </Text>
            </View>

            <View style={styles.commentContainer}>
              <TextInput
                style={styles.commentInput}
                placeholder="Any comment or feedback?"
                placeholderTextColor="#AAA"
                multiline={true}
                numberOfLines={4}
                value={comment}
                onChangeText={setComment}
              />
            </View>

            <TouchableOpacity
              style={[
                styles.doneButton,
                (rating === 0 || isSubmitting) && styles.disabledButton,
              ]}
              onPress={handleSubmitRating}
              disabled={rating === 0 || isSubmitting}
            >
              {isSubmitting ? (
                <View style={styles.processingContainer}>
                  <ActivityIndicator size="small" color="#FFFFFF" />
                  <Text style={[styles.doneButtonText, { marginLeft: 10 }]}>
                    Submitting...
                  </Text>
                </View>
              ) : (
                <Text style={styles.doneButtonText}>Done</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.skipButton}
              onPress={() => {
                dispatch(clearOrderProcess());
                navigation.navigate(ROUTES.HOME);
              }}
              disabled={isSubmitting}
            >
              <Text style={styles.skipButtonText}>Skip</Text>
            </TouchableOpacity>
          </View>
        </BottomSheetScrollView>
      </BottomSheet>
    </SafeAreaView>
  );
};

export default RateOrder;

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
  sheetContentContainer: {
    paddingTop: 20,
  },
  rateTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 15,
    textAlign: "center",
  },
  driverInfoHeader: {
    paddingHorizontal: 16,
    paddingVertical: 15,
    // backgroundColor: "#FFFFFF",
    borderRadius: 12,
    marginBottom: 20,
    borderBottomWidth: 1,
    borderColor: "#F0F0F0",
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
    flex: 1,
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
  ratingStarsContainer: {
    alignItems: "center",
    marginBottom: 25,
  },
  ratingLabel: {
    fontSize: 16,
    color: "#333",
    marginBottom: 15,
    textAlign: "center",
  },
  starsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 10,
  },
  starContainer: {
    padding: 5,
    marginHorizontal: 5,
  },
  ratingDescription: {
    fontSize: 14,
    color: "#666",
    marginTop: 5,
  },
  commentContainer: {
    marginBottom: 25,
  },
  commentLabel: {
    fontSize: 16,
    color: "#333",
    marginBottom: 10,
  },
  commentInput: {
    borderWidth: 1,
    borderColor: "#DDD",
    borderRadius: 10,
    padding: 15,
    height: 120,
    textAlignVertical: "top",
    fontSize: 16,
    backgroundColor: "#F9F9F9",
  },
  doneButton: {
    backgroundColor: "#005DD2",
    borderRadius: 50,
    paddingVertical: 16,
    alignItems: "center",
    marginBottom: 15,
  },
  disabledButton: {
    backgroundColor: "#A0C4E9",
  },
  doneButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  skipButton: {
    paddingVertical: 10,
    alignItems: "center",
  },
  skipButtonText: {
    color: "#666",
    fontSize: 16,
  },
  processingContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
});

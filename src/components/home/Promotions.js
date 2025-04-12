import {
  Image,
  StyleSheet,
  Text,
  View,
  ScrollView,
  Dimensions,
  Platform,
} from "react-native";
import React from "react";
import Button from "../common/Button";
import package_png from "../../assets/images/package.png";

const { width } = Dimensions.get("window");

const Promotions = () => {
  const promotionsData = [
    { id: "1", discount: "20%", image: package_png },
    { id: "2", discount: "15%", image: package_png },
    { id: "3", discount: "30%", image: package_png },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Promotions</Text>

      <View style={styles.scrollViewContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.scrollViewContent}
          snapToInterval={width - 48}
          decelerationRate="fast"
        >
          {promotionsData.map((promo) => (
            <View key={promo.id} style={styles.card}>
              <View style={styles.cardContent}>
                <Text style={styles.discountText}>
                  {promo.discount} {""}
                  <Text style={styles.discountDescription}>OFF!</Text>
                </Text>

                <Button
                  title={"Apply Discount"}
                  style={styles.button}
                  textStyle={styles.buttonText}
                />
              </View>

              <Image source={promo.image} style={styles.packageImage} />
            </View>
          ))}
        </ScrollView>
      </View>
    </View>
  );
};

export default Promotions;

const styles = StyleSheet.create({
  container: {
    marginVertical: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
    marginHorizontal: 12,
    textAlign: "left",
  },
  scrollViewContainer: {
    width: "100%",
    overflow: "visible",
  },
  scrollViewContent: {
    paddingHorizontal: 6,
    paddingStart: Platform.OS === "android" ? 6 : 6,
    paddingEnd: Platform.OS === "android" ? 6 : 6,
  },
  card: {
    width: width - 64,
    height: 130,
    backgroundColor: "#005DD2",
    borderRadius: 10,
    padding: 12,
    position: "relative",
    overflow: "hidden",
    marginHorizontal: 6,
    ...Platform.select({
      android: {
        elevation: 4,
      },
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
      },
    }),
  },
  cardContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "flex-start",
  },
  discountText: {
    fontSize: 28,
    fontWeight: "bold",
    color: "white",
    marginBottom: 2,
    textAlign: "left",
  },
  discountDescription: {
    fontSize: 14,
    color: "white",
    opacity: 0.8,
    marginBottom: 12,
    textAlign: "left",
    fontWeight: "bold",
  },
  button: {
    backgroundColor: "#D8E9FF",
    paddingVertical: 3,
    paddingHorizontal: 14,
    borderRadius: 25,
    width: "100%",
    alignItems: "flex-start",
    marginTop: 6,
  },
  buttonText: {
    color: "#005DD2",
    fontWeight: "600",
    fontSize: 13,
  },
  packageImage: {
    width: 180,
    height: 170,
    resizeMode: "contain",
    position: "absolute",
    right: -5,
    bottom: -30,
    ...Platform.select({
      android: {
        elevation: 5,
      },
      ios: {
        zIndex: 1,
      },
    }),
    opacity: 0.9,
  },
});

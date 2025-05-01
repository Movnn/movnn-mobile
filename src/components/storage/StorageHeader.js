import React from "react";
import { StyleSheet, Text, View, Image, TouchableOpacity } from "react-native";
import storage_bg from "../../assets/images/storage-bg.png";
import CustomBackButton from "../common/CustomBackButton";

const StorageHeader = () => {
  return (
    <View style={styles.container}>
      <View style={styles.backButtonContainer}>
        <CustomBackButton
          iconColor="#333"
          iconSize={22}
          containerStyle={styles.backButton}
        />
        <Text style={styles.greeting}>Hi John Doe,</Text>
      </View>

      <Text style={styles.question}>
        What are we <Text style={{ color: "#005DD2" }}>movnn</Text> to storage?
      </Text>

      <View style={styles.infoContainer}>
        <Image source={storage_bg} style={styles.backgroundImage} />
        <View style={styles.infoContent}>
          <Text style={styles.infoTitle}>What is movnn storage?</Text>
          <Text style={styles.infoText}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do ut
            labore et dolore{" "}
          </Text>
          <TouchableOpacity>
            <Text style={styles.learnMore}>learn more.</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default StorageHeader;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    width: "100%",
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  backButtonContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
    marginBottom: 4,
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
  greeting: {
    fontSize: 14,
    color: "#333",
    marginLeft: 0,
    marginTop: 2,
    textAlign: "left",
  },
  question: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 14,
    marginTop: 14,
    alignSelf: "flex-start",
  },
  infoContainer: {
    width: "100%",
    height: 150,
    borderRadius: 6,
    overflow: "hidden",
    marginBottom: 4,
    position: "relative",
  },
  backgroundImage: {
    width: "100%",
    height: "100%",
    position: "absolute",
  },
  infoContent: {
    padding: 12,
    flex: 1,
    justifyContent: "center",
  },
  infoTitle: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 6,
  },
  infoText: {
    fontSize: 12,
    color: "#fff",
    marginBottom: 6,
    opacity: 0.9,
    width: "64%",
  },
  learnMore: {
    fontSize: 12,
    color: "#fff",
    fontWeight: "bold",
    textDecorationLine: "underline",
  },
});

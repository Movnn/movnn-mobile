import React from "react";
import { StyleSheet, Text, View, Image, TouchableOpacity } from "react-native";
import storage_bg from "../../assets/images/storage-bg.png";

const StorageHeader = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.greeting}>Hi John Doe,</Text>
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
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  greeting: {
    fontSize: 16,
    color: "#333",
    marginBottom: 4,
    marginTop: 4,
    marginLeft: 35,
    textAlign: "left",
    alignSelf: "flex-start",
  },
  question: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 20,
    marginTop: 20,
    alignSelf: "flex-start",
  },
  infoContainer: {
    width: "100%",
    height: 150,
    borderRadius: 8,
    overflow: "hidden",
    marginBottom: 6,
    position: "relative",
  },
  backgroundImage: {
    width: "100%",
    height: "100%",
    position: "absolute",
  },
  infoContent: {
    padding: 16,
    flex: 1,
    justifyContent: "center",
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    color: "#fff",
    marginBottom: 8,
    opacity: 0.9,
    width: "64%",
  },
  learnMore: {
    fontSize: 14,
    color: "#fff",
    fontWeight: "bold",
    textDecorationLine: "underline",
  },
});

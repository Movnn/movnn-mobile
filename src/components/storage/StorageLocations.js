import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
} from "react-native";
import React from "react";
import { useNavigation } from "@react-navigation/native";

const locations = [
  {
    id: 1,
    name: "Calabar",
  },
  {
    id: 2,
    name: "Abuja",
  },
  {
    id: 3,
    name: "Kano",
  },
  {
    id: 4,
    name: "Lagos",
  },
  {
    id: 5,
    name: "Owerri",
  },
  {
    id: 6,
    name: "Ibadan",
  },
  {
    id: 7,
    name: "Port Harcourt",
  },
  {
    id: 8,
    name: "Jos",
  },
  {
    id: 9,
    name: "Enugu",
  },
  {
    id: 10,
    name: "Kaduna",
  },
];

const StorageLocations = () => {
  const navigation = useNavigation();


  const handleLocationPress = (location) => {

    navigation.navigate("StorageEstimate", { location });
  };

  const renderLocationItem = ({ item }) => (
    <TouchableOpacity
      style={styles.locationCard}
      onPress={() => handleLocationPress(item)}
    >
      <Text style={styles.locationText}>{item.name}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Select location</Text>

      <FlatList
        data={locations}
        renderItem={renderLocationItem}
        keyExtractor={(item) => item.id.toString()}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.listContainer}
        initialNumToRender={4}
        maxToRenderPerBatch={4}
        windowSize={4}
      />
    </View>
  );
};

export default StorageLocations;

const styles = StyleSheet.create({
  container: {
    marginVertical: 1,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 12,
  },
  listContainer: {
    paddingRight: 16,
    paddingVertical: 8,
    gap: 10,
  },
  locationCard: {
    backgroundColor: "#D0E5FF",
    width: 90.25,
    height: 76,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#D0E5FF",
    padding: 18,
    marginRight: 10,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  locationText: {
    color: "#005DD2",
    fontWeight: "500",
    fontSize: 14,
    textAlign: "center",
  },
});

import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import React from "react";
import { Feather } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

const dummyData = [
  {
    id: 1,
    warehouse_id: "02345",
    location: "Abuja",
    cost: "N1,300",
    days_remaining: "10 Day(s)",
    date: "3 Jan",
  },
  {
    id: 2,
    warehouse_id: "02346",
    location: "Abuja",
    cost: "N1,300",
    days_remaining: "10 Day(s)",
    date: "3 Jan",
  },
  {
    id: 3,
    warehouse_id: "02347",
    location: "Abuja",
    cost: "N1,300",
    days_remaining: "10 Day(s)",
    date: "3 Jan",
  },
  {
    id: 4,
    warehouse_id: "02348",
    location: "Abuja",
    cost: "N1,300",
    days_remaining: "10 Day(s)",
    date: "3 Jan",
  },
];

const MyStorage = () => {
  const navigation = useNavigation();

  const handleOrderPress = (item) => {
    navigation.navigate("ViewStorageDetails", {
      warehouse_id: item.warehouse_id,
      location: item.location,
    });
  };

  const renderItem = (item) => (
    <TouchableOpacity
      key={item.id}
      style={styles.itemContainer}
      onPress={() => handleOrderPress(item)}
      activeOpacity={0.7}
    >
      <View style={styles.leftSection}>
        <View style={styles.iconContainer}>
          <Feather name="package" size={20} color="#015cd2" />
        </View>
        <View style={styles.contentContainer}>
          <Text style={styles.title}>#{item.warehouse_id}</Text>

          <View style={styles.detailRow}>
            <View style={styles.labelContainer}>
              <Text style={styles.description}>Location</Text>
            </View>
            <View style={styles.valueContainer}>
              <Text style={styles.time}>{item.location}</Text>
            </View>
          </View>

          <View style={styles.detailRow}>
            <View style={styles.labelContainer}>
              <Text style={styles.description}>Cost</Text>
            </View>
            <View style={styles.valueContainer}>
              <Text style={styles.date}>{item.cost}</Text>
            </View>
          </View>

          <View style={styles.detailRow}>
            <View style={styles.labelContainer}>
              <Text style={styles.description}>Days remaining</Text>
            </View>
            <View style={styles.valueContainer}>
              <Text style={styles.date}>{item.days_remaining}</Text>
            </View>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {dummyData.map((item) => renderItem(item))}
      </ScrollView>
    </View>
  );
};

export default MyStorage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: 12,
  },
  scrollContent: {
    paddingBottom: 16,
  },
  itemContainer: {
    flexDirection: "row",
    borderRadius: 10,
    backgroundColor: "#FFFFFF",
    paddingVertical: 4,
    marginBottom: 10,
  },
  leftSection: {
    flexDirection: "row",
    flex: 1,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#E0EEFF",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  contentContainer: {
    flex: 1,
  },
  title: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 6,
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 3,
  },
  labelContainer: {
    flex: 1,
  },
  valueContainer: {
    flex: 1,
    alignItems: "flex-end",
  },
  description: {
    fontSize: 12,
    color: "#666",
    fontWeight: "300",
  },
  time: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#333",
  },
  date: {
    fontSize: 11,
    color: "#666",
    fontWeight: "300",
  },
});

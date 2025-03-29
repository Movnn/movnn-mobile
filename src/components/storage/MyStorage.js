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
          <Feather name="package" size={24} color="#015cd2" />
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
  
    paddingVertical: 16,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  itemContainer: {
    flexDirection: "row",
    borderRadius: 12,
    backgroundColor: "#FFFFFF",
    paddingVertical: 6,
    marginBottom: 12,
   
  },
  leftSection: {
    flexDirection: "row",
    flex: 1,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#E0EEFF",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  contentContainer: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 8,
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  labelContainer: {
    flex: 1,
  },
  valueContainer: {
    flex: 1,
    alignItems: "flex-end",
  },
  description: {
    fontSize: 14,
    color: "#666",
    fontWeight: "300",
  },
  time: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#333",
  },
  date: {
    fontSize: 12,
    color: "#666",
    fontWeight: "300",
  },
});

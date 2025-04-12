import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Image,
  Platform,
} from "react-native";
import React from "react";
import order_box from "../../assets/images/new-order-box.png";
import archive from "../../assets/images/archive.png";
import Feather from "@expo/vector-icons/Feather";

const dummyData = [
  {
    id: 1,
    title: "Storage",
    desc: "South-West",
    time: "12:23pm",
    date: "3 Jan",
    icon: order_box,
  },
  {
    id: 2,
    title: "Airport",
    desc: "Nnamdi Azikiwe Intl Airport, Abuja",
    time: "12:23pm",
    date: "3 Jan",
    icon: archive,
  },
  {
    id: 3,
    title: "Storage",
    desc: "North-East",
    time: "10:15am",
    date: "2 Jan",
    icon: order_box,
  },
  {
    id: 4,
    title: "Airport",
    desc: "Murtala Muhammed Intl Airport, Lagos",
    time: "02:45pm",
    date: "1 Jan",
    icon: Feather,
  },
  {
    id: 5,
    title: "Storage",
    desc: "Central District",
    time: "09:30am",
    date: "31 Dec",
    icon: order_box,
  },
  {
    id: 6,
    title: "Airport",
    desc: "Port Harcourt Intl Airport",
    time: "11:05am",
    date: "30 Dec",
    icon: archive,
  },
  {
    id: 7,
    title: "Storage",
    desc: "North-West Zone",
    time: "03:45pm",
    date: "29 Dec",
    icon: order_box,
  },
  {
    id: 8,
    title: "Airport",
    desc: "Akanu Ibiam Intl Airport, Enugu",
    time: "08:20am",
    date: "28 Dec",
    icon: archive,
  },
];

const ListFooterComponent = () => <View style={{ height: 16 }} />;

const Recent = () => {
  const renderItem = ({ item }) => (
    <View style={styles.itemContainer}>
      <View style={styles.leftSection}>
        <View style={styles.iconContainer}>
          <Feather name="package" size={20} style={styles.icon} />
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.description}>{item.desc}</Text>
        </View>
      </View>
      <View style={styles.rightSection}>
        <Text style={styles.time}>{item.time}</Text>
        <Text style={styles.date}>{item.date}</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Recent</Text>
      <FlatList
        data={dummyData}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        style={styles.flatList}
        scrollEnabled={true}
        nestedScrollEnabled={true}
        ListFooterComponent={ListFooterComponent}
        contentInsetAdjustmentBehavior="automatic"
        {...(Platform.OS === "ios" && { contentInset: { bottom: 60 } })}
      />
    </View>
  );
};

export default Recent;

const styles = StyleSheet.create({
  container: {
    marginVertical: 4,
    paddingHorizontal: 12,
    height: Platform.OS === "ios" ? 380 : 360,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
    textAlign: "left",
  },
  listContent: {
    paddingBottom: Platform.OS === "ios" ? 16 : 6,
  },
  flatList: {
    flex: 1,
    height: Platform.OS === "ios" ? 320 : 300,
  },
  itemContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderRadius: 10,
    padding: 12,
    marginBottom: 8,
  },
  leftSection: {
    flexDirection: "row",
    alignItems: "center",
    flex: 3,
  },
  iconContainer: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: "#E0EEFF",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  icon: {
    width: 20,
    height: 20,
    resizeMode: "contain",
    color: "#015cd2",
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 3,
  },
  description: {
    fontSize: 12,
    color: "#666",
    fontWeight: "300",
  },
  rightSection: {
    alignItems: "flex-end",
    flex: 1,
  },
  time: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 3,
  },
  date: {
    fontSize: 11,
    color: "#666",
    fontWeight: "300",
  },
});

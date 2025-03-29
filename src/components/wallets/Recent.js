import { FlatList, StyleSheet, Text, View } from "react-native";
import React from "react";
import { Feather } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";

const dummyData = [
  {
    id: 1,
    title: "Storage",
    desc: "South-West",
    credit: "+ N2000",
  },
  {
    id: 2,
    title: "Airport",
    desc: "Nnamdi Azikiwe Intl Airport, Abuja",
    debit: "- N500",
  },
  {
    id: 3,
    title: "Airport",
    desc: "Nnamdi Azikiwe Intl Airport, Abuja",
    cash: "- N300",
    type: "cash",
  },
  {
    id: 4,
    title: "Storage",
    desc: "North Zone",
    credit: "+ N1500",
  },
  {
    id: 5,
    title: "Airport",
    desc: "Murtala Muhammed Intl Airport, Lagos",
    debit: "- N750",
  },
];

const Recent = () => {
  const getTransactionType = (item) => {
    if (item.credit) return "credit";
    if (item.debit) return "debit";
    if (item.cash) return "cash";
    return "unknown";
  };

  const renderIcon = (item) => {
    const transactionType = getTransactionType(item);

    switch (transactionType) {
      case "credit":
        return <Feather name="arrow-down-left" size={24} color="#2E8B57" />;
      case "debit":
        return <Feather name="arrow-up-right" size={24} color="#FF4500" />;
      case "cash":
        return <Ionicons name="cash-outline" size={24} color="#005DD2" />;
      default:
        return <Feather name="credit-card" size={24} color="#005DD2" />;
    }
  };

  const getAmountColor = (item) => {
    if (item.credit) return "#2E8B57"; 
    return "#FF4500"; 
  };

  const renderItem = ({ item }) => (
    <View style={styles.itemContainer}>
      <View style={styles.leftSection}>
        <View style={styles.iconContainer}>{renderIcon(item)}</View>
        <View style={styles.textContainer}>
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.description}>{item.desc}</Text>
        </View>
      </View>
      <View style={styles.rightSection}>
        <Text style={[styles.amount, { color: getAmountColor(item) }]}>
          {item.credit || item.debit || item.cash}
        </Text>
        {item.type && <Text style={styles.paymentType}>{item.type}</Text>}
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={dummyData}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        showsVerticalScrollIndicator={false}
        nestedScrollEnabled={true}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />
    </View>
  );
};

export default Recent;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#F9F9F9",
    borderRadius: 10,
    // padding: 10,
    flex: 1,
    marginBottom: 10,
  },
  itemContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 10,
  },
  separator: {
    height: 1,
    backgroundColor: "#EEEEEE",
    marginVertical: 5,
  },
  leftSection: {
    flexDirection: "row",
    alignItems: "center",
    flex: 3,
  },
  iconContainer: {
    backgroundColor: "#E6EFFF",
    width: 45,
    height: 45,
    borderRadius: 22.5,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 4,
  },
  description: {
    fontSize: 13,
    color: "#666",
  },
  rightSection: {
    alignItems: "flex-end",
    flex: 1,
  },
  amount: {
    fontSize: 15,
    fontWeight: "600",
    marginBottom: 4,
  },
  paymentType: {
    fontSize: 12,
    color: "#777",
    textTransform: "capitalize",
  },
});

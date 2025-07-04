import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import React from "react";
import { Feather } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

const data = [
  {
    id: 1,
    order_id: "02932",
    status: "in-progress",
    weight: 28,
    qty: 5,
    keep_days: 4,
    time: "11:02am",
    pickupLocationName: "Work",
    pickupLocationAddress: "304 Epmatak Close, Wuse, Abuja",
    backgroundColorInProgess: "#FFC70014",
    deliveryLocationName: "Home",
    deliveryLocationAddress: "309 Epmatak Close, Wuse, Abuja",
  },

  {
    id: 2,
    order_id: "02933",
    status: "completed",
    weight: 28,
    qty: 5,
    keep_days: 4,
    time: "11:02am",
    pickupLocationName: "Work",
    pickupLocationAddress: "304 Epmatak Close, Wuse, Abuja",
    backgroundColorInProgess: "#005DD20A",
    deliveryLocationName: "Home",
    deliveryLocationAddress: "309 Epmatak Close, Wuse, Abuja",
  },
];

const OrderCard = ({ item }) => {
  const navigation = useNavigation();

  const handleOrderPress = () => {
    navigation.navigate("ViewOrderDetails", {
      orderId: item.order_id,
      status: item.status,
    });
  };

  const getStatusStyle = (status) => {
    if (status === "in-progress") {
      return {
        backgroundColor: "#FFC700",
        textColor: "#2C3A4B",
      };
    } else if (status === "completed") {
      return {
        backgroundColor: "#005DD2",
        textColor: "#FFFFFF",
      };
    }

    return {
      backgroundColor: "#EEEEEE",
      textColor: "#666666",
    };
  };

  const statusStyle = getStatusStyle(item.status);

  const statusBadgeStyle = {
    ...styles.statusBadge,
    backgroundColor: statusStyle.backgroundColor,
  };

  return (
    <TouchableOpacity
      style={[styles.card, { backgroundColor: item.backgroundColorInProgess }]}
      onPress={handleOrderPress}
      activeOpacity={0.7}
    >
      <View style={styles.firstRow}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <View style={statusBadgeStyle}>
            <Feather
              name="package"
              size={14}
              color="#FFF"
              style={styles.statusIcon}
            />
            <Text style={styles.statusText}>{item.status}</Text>
          </View>
          <Text style={styles.orderId}>Order #{item.order_id}</Text>
        </View>

        <View style={styles.orderInfoContainer}>
          <Text style={styles.time}>{item.time}</Text>
        </View>
      </View>

      <View style={styles.secondRow}>
        <View style={styles.infoItem}>
          <Text style={styles.infoValue}>{item.weight}</Text>
          <Text style={styles.infoLabel}>Weight</Text>
        </View>

        <View style={styles.infoSeparator} />

        <View style={styles.infoItem}>
          <Text style={styles.infoValue}>{item.qty}</Text>
          <Text style={styles.infoLabel}>Quantity</Text>
        </View>

        <View style={styles.infoSeparator} />

        <View style={styles.infoItem}>
          <Text style={styles.infoValue}>{item.keep_days}</Text>
          <Text style={styles.infoLabel}>Keep days</Text>
        </View>
      </View>

      <View style={styles.thirdRow}>
        <View style={styles.lineConnectorContainer}>
          <View style={styles.lineConnector} />
        </View>

        <View style={styles.locationContainer}>
          <View style={styles.addressIconContainer}>
            <View style={styles.originDot} />
          </View>

          <View style={styles.addressDetails}>
            <Text style={styles.locationName} numberOfLines={1}>
              {item.pickupLocationName}
            </Text>
            <Text style={styles.addressText} numberOfLines={1}>
              {item.pickupLocationAddress}
            </Text>
          </View>
        </View>

        <View style={styles.locationContainer}>
          <View style={styles.addressIconContainer}>
            <View style={styles.destinationDot} />
          </View>

          <View style={styles.addressDetails}>
            <Text style={styles.locationName} numberOfLines={1}>
              {item.deliveryLocationName}
            </Text>
            <Text style={styles.addressText} numberOfLines={1}>
              {item.deliveryLocationAddress}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const RecentOrder = () => {
  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {data.map((item) => (
          <OrderCard key={item.id} item={item} />
        ))}
      </ScrollView>
    </View>
  );
};

export default RecentOrder;

const { width } = Dimensions.get("window");

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingVertical: 6,
  },
  card: {
    borderRadius: 24,
    padding: 12,
    marginBottom: 12,
    backgroundColor: "#D0E5FF",
    shadowColor: "#000",
  },
  firstRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 40,
  },
  statusIcon: {
    marginRight: 4,
  },
  statusText: {
    color: "#FFFFFF",
    fontWeight: "600",
    fontSize: 11,
  },
  orderInfoContainer: {
    alignItems: "flex-end",
  },
  orderId: {
    fontSize: 13,
    fontWeight: "600",
    color: "#333333",
    marginLeft: 6,
  },
  time: {
    fontSize: 11,
    color: "#666666",
    marginTop: 3,
  },
  secondRow: {
    flexDirection: "row",
    marginBottom: 12,
    paddingHorizontal: 6,
  },
  infoItem: {
    alignItems: "center",
    paddingRight: 4,
  },
  infoValue: {
    fontSize: 13,
    fontWeight: "600",
    color: "#333333",
  },
  infoLabel: {
    fontSize: 11,
    color: "#666666",
    marginTop: 3,
    textAlign: "center",
  },
  infoSeparator: {
    width: 1,
    height: 20,
    backgroundColor: "#DDDDDD",
    marginHorizontal: 6,
  },
  thirdRow: {
    paddingTop: 6,
    position: "relative",
  },
  locationContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  addressIconContainer: {
    width: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 6,
  },
  originDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#ffff",
    borderWidth: 3,
    borderColor: "#005DD2",
  },
  destinationDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#005DD24D",
    borderWidth: 2,
    borderColor: "#005DD24D",
  },
  addressDetails: {
    flex: 1,
  },
  locationName: {
    fontSize: 13,
    fontWeight: "600",
    color: "#333333",
  },
  addressText: {
    fontSize: 11,
    color: "#666666",
    marginTop: 2,
  },
  lineConnectorContainer: {
    position: "absolute",
    left: 10,
    top: 20,
    height: 32,
    alignItems: "center",
  },
  lineConnector: {
    width: 1,
    height: "100%",
    backgroundColor: "#005DD2",
    borderStyle: "dashed",
  },
});

import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Image,
  ScrollView,
  Dimensions,
  SafeAreaView,
  Switch,
} from "react-native";
import React, { useState } from "react";
import { useRoute } from "@react-navigation/native";
import sample_watch from "../../assets/samples/sample-watch.png";
import { Feather } from "@expo/vector-icons";
import CustomBackButton from "../../components/common/CustomBackButton";

const sample_images = [
  {
    id: 1,
    image: sample_watch,
  },
  {
    id: 2,
    image: sample_watch,
  },
  {
    id: 3,
    image: sample_watch,
  },
  {
    id: 4,
    image: sample_watch,
  },
  {
    id: 5,
    image: sample_watch,
  },
];

const order_item_card_one = {
  time_created: "1:40pm 30 Jan",
  storage_location: "Lagos, South-West",
  item_description: "Leather wrist-watch",
  category: "Accessories",
  weight: "3kg",
  quantity: "14pcs",
  keep_duration: "4 days",
  insured: "Yes",
  note: "Item is fragile",
};

const order_item_card_two = {
  pickupFrom: "123 Test Avenue",
  phoneNumber: "+123 456 7890",
};

const order_item_card_three = {
  storageCost: "N 940",
  extendDays: false,
};

const ViewOrderDetails = () => {
  const route = useRoute();
  const { orderId, status } = route.params || {
    orderId: "00000",
    status: "unknown",
  };

  const [extendDays, setExtendDays] = useState(
    order_item_card_three.extendDays
  );

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

  const statusStyle = getStatusStyle(status);

  const renderImageItem = ({ item }) => (
    <View style={styles.imageContainer}>
      <Image source={item.image} style={styles.itemImage} resizeMode="cover" />
    </View>
  );

  const DetailRow = ({
    label,
    value,
    isToggle = false,
    toggleValue,
    onToggleChange,
  }) => {
    if (isToggle) {
      return (
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>{label}</Text>
          <View style={styles.switchContainer}>
            <Switch
              trackColor={{ false: "#E0E0E0", true: "#81b0ff" }}
              thumbColor={toggleValue ? "#005DD2" : "#f4f3f4"}
              ios_backgroundColor="#E0E0E0"
              onValueChange={onToggleChange}
              value={toggleValue}
              style={styles.switch}
            />
          </View>
        </View>
      );
    }

    return (
      <View style={styles.detailRow}>
        <Text style={styles.detailLabel}>{label}</Text>
        <Text style={styles.detailValue}>{value}</Text>
      </View>
    );
  };

  const handleExtendDaysToggle = (newValue) => {
    setExtendDays(newValue);
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <View style={styles.orderIdContainer}>
          <CustomBackButton
            iconColor="#333"
            iconSize={22}
            containerStyle={styles.backButton}
          />
          <Text style={styles.orderId}>#{orderId}</Text>
        </View>

        <View
          style={[
            styles.statusBadge,
            { backgroundColor: statusStyle.backgroundColor },
          ]}
        >
          <Feather
            name="package"
            size={14}
            color="#FFF"
            style={styles.statusIcon}
          />
          <Text style={styles.statusText}>{status}</Text>
        </View>
      </View>

      <SafeAreaView style={styles.safeAreaContainer}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.carouselContainer}>
            <FlatList
              data={sample_images}
              renderItem={renderImageItem}
              keyExtractor={(item) => item.id.toString()}
              horizontal
              showsHorizontalScrollIndicator={false}
              pagingEnabled
              snapToAlignment="center"
              decelerationRate="fast"
            />
          </View>

          <View style={styles.cardContainer}>
            <Text style={styles.cardTitle}>Order Details</Text>
            <DetailRow
              label="Time Created"
              value={order_item_card_one.time_created}
            />
            <DetailRow
              label="Storage Location"
              value={order_item_card_one.storage_location}
            />
            <DetailRow
              label="Item Description"
              value={order_item_card_one.item_description}
            />
            <DetailRow label="Category" value={order_item_card_one.category} />
            <DetailRow label="Weight" value={order_item_card_one.weight} />
            <DetailRow label="Quantity" value={order_item_card_one.quantity} />
            <DetailRow
              label="Keep Duration"
              value={order_item_card_one.keep_duration}
            />
            <DetailRow label="Insured" value={order_item_card_one.insured} />
            <DetailRow label="Note" value={order_item_card_one.note} />
          </View>

          <View style={styles.cardContainer}>
            <Text style={styles.cardTitle}>Pickup Details</Text>
            <DetailRow
              label="Pickup From"
              value={order_item_card_two.pickupFrom}
            />
            <DetailRow
              label="Phone Number"
              value={order_item_card_two.phoneNumber}
            />
          </View>

          <View style={styles.cardContainer}>
            <Text style={styles.cardTitle}>Payment Details</Text>
            <DetailRow
              label="Storage Cost"
              value={order_item_card_three.storageCost}
            />
            <DetailRow
              label="Extended Days"
              isToggle={true}
              toggleValue={extendDays}
              onToggleChange={handleExtendDaysToggle}
            />
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

export default ViewOrderDetails;

const { width } = Dimensions.get("window");

const styles = StyleSheet.create({
  switchContainer: {
    padding: 1,
  },
  switch: {
    transform: [{ scaleX: 1 }, { scaleY: 1 }],
  },
  container: {
    flex: 1,
    backgroundColor: "#2C3A4B12",
  },
  safeAreaContainer: {
    flex: 1,
  },
  headerContainer: {
    flexDirection: "column",
    padding: 12,
  },
  orderIdContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 35,
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
  orderIdLabel: {
    fontSize: 16,
    color: "#666666",
    marginBottom: 3,
    marginRight: 14,
  },
  orderId: {
    fontSize: 16,
    fontWeight: "700",
    color: "#333333",
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 40,
    alignSelf: "flex-start",
    marginTop: 4,
  },
  statusIcon: {
    marginRight: 4,
  },
  statusText: {
    color: "#FFFFFF",
    fontWeight: "600",
    fontSize: 11,
    textTransform: "capitalize",
  },
  carouselContainer: {
    width: "100%",
    height: 200,
    marginVertical: 12,
  },
  imageContainer: {
    width: width - 20,
    marginHorizontal: 10,
    height: 200,
    borderRadius: 10,
    overflow: "hidden",
  },
  itemImage: {
    width: "100%",
    height: "100%",
  },
  cardContainer: {
    margin: 12,
    padding: 12,
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#333333",
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 6,
    alignItems: "center",
  },
  detailLabel: {
    fontSize: 13,
    color: "#666666",
  },
  detailValue: {
    fontSize: 13,
    fontWeight: "500",
    color: "#333333",
  },
});

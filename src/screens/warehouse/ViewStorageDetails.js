import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import React from "react";
import { useRoute, useNavigation } from "@react-navigation/native";
import Button from "../../components/common/Button";
import { Feather } from "@expo/vector-icons";

const warehouse_order_item_one = {
  order_id: "WH-12345",
  order_title: "Perfumes and shoes",
  qauntity: 4,
  date_added: "10-01-2025",
  pickup_address: "123 Test Avenue",
  storage_cost: "N900",
  to_be_dispatched: "(24days) 03-02-2025",
};

const warehouse_order_item_two = {
  order_id: "WH-12346",
  order_title: "Electronics and gadgets",
  qauntity: 2,
  date_added: "12-01-2025",
  pickup_address: "456 Demo Street",
  storage_cost: "N750",
  to_be_dispatched: "(18days) 30-01-2025",
};

const warehouse_order_item_three = {
  order_id: "WH-12347",
  order_title: "Books and stationery",
  qauntity: 8,
  date_added: "15-01-2025",
  pickup_address: "789 Sample Road",
  storage_cost: "N600",
  to_be_dispatched: "(30days) 14-02-2025",
};


const DetailRow = ({ label, value }) => (
  <View style={styles.detailRow}>
    <Text style={styles.detailLabel}>{label}</Text>
    <Text style={styles.detailValue}>{value}</Text>
  </View>
);

const ViewStorageDetails = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { warehouse_id, location } = route.params || {
    warehouse_id: "Unknown",
    location: "Unknown",
  };

  const handleBackPress = () => {
    navigation.goBack();
  };

  const handleDispatchPress = () => {

    console.log("Dispatch requested");
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.headerContainer}>
        {/* <TouchableOpacity style={styles.backButton} onPress={handleBackPress}>
          <Feather name="arrow-left" size={24} color="#333333" />
        </TouchableOpacity> */}

        <View style={styles.headerTitleContainer}>
          {/* <Text style={styles.headerTitle}>Storage Details</Text> */}
                  <Text style={styles.warehouseId}>#{warehouse_id}</Text>
          <View style={styles.locationBadge}>
            <Feather
              name="map-pin"
              size={16}
              color="#005DD2"
              style={styles.locationIcon}
            />
            <Text style={styles.locationText}>{location}</Text>
          </View>
        </View>
      </View>


      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
      
        <View style={styles.cardContainer}>
         
          <DetailRow
            label="Order ID"
            value={warehouse_order_item_one.order_id}
          />
          <DetailRow
            label="Order Title"
            value={warehouse_order_item_one.order_title}
          />
          <DetailRow
            label="Quantity"
            value={warehouse_order_item_one.qauntity.toString()}
          />
          <DetailRow
            label="Date Added"
            value={warehouse_order_item_one.date_added}
          />
          <DetailRow
            label="Pickup Address"
            value={warehouse_order_item_one.pickup_address}
          />
          <DetailRow
            label="Storage Cost"
            value={warehouse_order_item_one.storage_cost}
          />
          <DetailRow
            label="To be dispatched"
            value={warehouse_order_item_one.to_be_dispatched}
          />
        </View>


        <View style={styles.cardContainer}>
         
          <DetailRow
            label="Order ID"
            value={warehouse_order_item_two.order_id}
          />
          <DetailRow
            label="Order Title"
            value={warehouse_order_item_two.order_title}
          />
          <DetailRow
            label="Quantity"
            value={warehouse_order_item_two.qauntity.toString()}
          />
          <DetailRow
            label="Date Added"
            value={warehouse_order_item_two.date_added}
          />
          <DetailRow
            label="Pickup Address"
            value={warehouse_order_item_two.pickup_address}
          />
          <DetailRow
            label="Storage Cost"
            value={warehouse_order_item_two.storage_cost}
          />
          <DetailRow
            label="To be dispatched"
            value={warehouse_order_item_two.to_be_dispatched}
          />
        </View>

    
        <View style={styles.cardContainer}>
        
          <DetailRow
            label="Order ID"
            value={warehouse_order_item_three.order_id}
          />
          <DetailRow
            label="Order Title"
            value={warehouse_order_item_three.order_title}
          />
          <DetailRow
            label="Quantity"
            value={warehouse_order_item_three.qauntity.toString()}
          />
          <DetailRow
            label="Date Added"
            value={warehouse_order_item_three.date_added}
          />
          <DetailRow
            label="Pickup Address"
            value={warehouse_order_item_three.pickup_address}
          />
          <DetailRow
            label="Storage Cost"
            value={warehouse_order_item_three.storage_cost}
          />
          <DetailRow
            label="To be dispatched"
            value={warehouse_order_item_three.to_be_dispatched}
          />
        </View>
      </ScrollView>

      {/* Bottom Button */}
      <View style={styles.buttonContainer}>
        <Button title="Add to Storage" onPress={handleDispatchPress} />
      </View>
    </View>
  );
};

export default ViewStorageDetails;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#2C3A4B12",
  },
  headerContainer: {
    paddingTop: 60,
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "flex-start",
  },
  headerTitleContainer: {
    marginTop: 22,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#333333",
    marginBottom: 4,
  },
  warehouseId: {
    fontSize: 16,
    fontWeight: "600",
    color: "#666666",
    marginBottom: 8,
  },
  locationBadge: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    backgroundColor: "#E0EEFF",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 50,
    marginTop: 4,
  },
  locationIcon: {
    marginRight: 6,
  },
  locationText: {
    fontSize: 14,
    color: "#005DD2",
    fontWeight: "500",
  },
  scrollView: {
    flex: 1,
    padding: 16,
  },
  cardContainer: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    // shadowColor: "#000",
    // shadowOffset: { width: 0, height: 2 },
    // shadowOpacity: 0.05,
    // shadowRadius: 3,
    // elevation: 2,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#333333",
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 8,
    // borderBottomWidth: 1,
    // borderBottomColor: "#F0F0F0",
  },
  detailLabel: {
    fontSize: 14,
    color: "#666666",
  },
  detailValue: {
    fontSize: 14,
    fontWeight: "500",
    color: "#333333",
    textAlign: "right",
    flex: 1,
    marginLeft: 8,
  },
  buttonContainer: {
    paddingVertical: 26,
    paddingHorizontal: 16,
  },
  dispatchButton: {
    backgroundColor: "#005DD2",
  },
});

import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import React from "react";
import { Feather } from "@expo/vector-icons";
import visa_png from "../../assets/images/visa-png.png";
import mastercard_png from "../../assets/images/mastercard-png.png";

const Cards = () => {
  const cards = [
    {
      id: 1,
      type: "visa",
      image: visa_png,
      number: "**** **** **** 9876",
      expiry: "01/23/45",
    },
    {
      id: 2,
      type: "mastercard",
      image: mastercard_png,
      number: "**** **** **** 4321",
      expiry: "12/25/30",
    },
    {
      id: 3,
      type: "visa",
      image: visa_png,
      number: "**** **** **** 9876",
      expiry: "01/23/45",
    },
    {
      id: 4,
      type: "mastercard",
      image: mastercard_png,
      number: "**** **** **** 4321",
      expiry: "12/25/30",
    },
  ];

  return (
    <View style={styles.mainContainer}>
      <View style={styles.scrollContainer}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          nestedScrollEnabled={true}
        >
          {cards.map((card) => (
            <View key={card.id} style={styles.cardItem}>
              <View style={styles.cardDetails}>
                <Image source={card.image} style={styles.cardImage} />
                <View>
                  <Text style={styles.cardNumber}>{card.number}</Text>
                  <Text style={styles.cardExpiry}>Exp: {card.expiry}</Text>
                </View>
              </View>
              <TouchableOpacity style={styles.cardActions}>
                <Text style={styles.editText}>edit</Text>
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>
      </View>

      <TouchableOpacity style={styles.addCardButton}>
        <Feather name="plus-circle" size={20} color="#005DD2" />
        <Text style={styles.addCardText}>Add new card</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Cards;

const styles = StyleSheet.create({
  mainContainer: {
    backgroundColor: "#F9F9F9",
    borderRadius: 10,
    padding: 15,
  },
  scrollContainer: {
    maxHeight: 120,
  },
  cardItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    marginBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#EEEEEE",
  },
  cardDetails: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  cardImage: {
    width: 40,
    height: 25,
    marginRight: 12,
    resizeMode: "contain",
  },
  cardNumber: {
    fontSize: 15,
    color: "#333",
    marginBottom: 4,
  },
  cardExpiry: {
    fontSize: 13,
    color: "#666",
  },
  cardActions: {
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  editText: {
    fontSize: 14,
    color: "#005DD2",
  },
  addCardButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 15,
    paddingVertical: 12,
    backgroundColor: "#F9F9F9",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderStyle: "dashed",
  },
  addCardText: {
    marginLeft: 8,
    fontSize: 15,
    color: "#005DD2",
    fontWeight: "500",
  },
});

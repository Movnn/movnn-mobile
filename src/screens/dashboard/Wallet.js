import React from "react";
import {
  View,
  StyleSheet,
  Text,
  ImageBackground,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import wallet_bg from "../../assets/images/wallet-balance-bg.png";
import Cards from "../../components/wallets/Cards";
import Recent from "../../components/wallets/Recent";

const Wallet = () => {
  return (
    <SafeAreaView style={styles.container}>
      <ImageBackground
        source={wallet_bg}
        style={styles.walletBgContainer}
        resizeMode="cover"
      >
        <View style={styles.walletInfoContainer}>
          <View style={styles.walletTextContainer}>
            <Text style={styles.walletTitle}>Movnn wallet</Text>
            <Text style={styles.walletBalance}>₦ 283,980</Text>
          </View>
          <TouchableOpacity style={styles.topupContainer}>
            <Text style={styles.topupButton}>topup wallet</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.divider} />
      </ImageBackground>

      <View style={styles.contentContainer}>
        <View style={styles.cardsContainer}>
          <Text style={styles.sectionTitle}>Payment Methods</Text>
          <Cards />
        </View>

        <View style={styles.recentContainer}>
          <Text style={styles.sectionTitle}>Recent Transactions</Text>
          <Recent />
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  walletBgContainer: {
    paddingHorizontal: 20,
    paddingVertical: 30,
  },
  walletInfoContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 20,
    // height: 50,
  },
  walletTextContainer: {
    flexDirection: "column",
  },
  walletTitle: {
    fontSize: 16,
    color: "#fff",
    marginBottom: 10,
    fontWeight: "500",
  },
  walletBalance: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 15,
  },
  topupContainer: {
    alignSelf: "flex-start",
  },
  topupButton: {
    color: "#fff",
    textDecorationLine: "underline",
    fontSize: 16,
    fontWeight: "500",
  },
  divider: {
    height: 1,
    backgroundColor: "#E5E5E5",
    // marginHorizontal: 20,
    marginVertical: 5,
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  cardsContainer: {
    marginBottom: 25,
  },
  recentContainer: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
    color: "#333",
  },
});

export default Wallet;

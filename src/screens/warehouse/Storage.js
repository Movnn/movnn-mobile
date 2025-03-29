import React from "react";
import { View, Text, StyleSheet, Platform } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import StorageHeader from "../../components/storage/StorageHeader";
import StorageLocations from "../../components/storage/StorageLocations";
import StorageAndRecentOrder from "../../components/storage/StorageAndRecentOrder";

import { SafeAreaView } from "react-native";

const Storage = () => {
  const insets = useSafeAreaInsets();

  if (Platform.OS === "ios") {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          <StorageHeader />
          <StorageLocations />
          <StorageAndRecentOrder />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <View
      style={[
        styles.container,
        {
          paddingTop: insets.top,
          paddingBottom: insets.bottom,
          paddingLeft: insets.left,
          paddingRight: insets.right,
        },
      ]}
    >
      <StorageHeader />
      <StorageLocations />
      <StorageAndRecentOrder />
    </View>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
});

export default Storage;

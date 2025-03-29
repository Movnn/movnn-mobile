import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import RecentOrder from "./RecentOrder";
import MyStorage from "./MyStorage";

const StorageAndRecentOrder = () => {
  const [activeTab, setActiveTab] = useState("recent");

  const handleTabPress = (tab) => {
    setActiveTab(tab);
  };

  return (
    <View style={styles.container}>
      {/* Switch Button Tabs Recent and My Storage */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[
            styles.tabButton,
            activeTab === "recent" && styles.activeTabButton,
          ]}
          onPress={() => handleTabPress("recent")}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "recent"
                ? styles.activeTabText
                : styles.inactiveTabText,
            ]}
          >
            Recent Orders
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.tabButton,
            activeTab === "storage" && styles.activeTabButton,
          ]}
          onPress={() => handleTabPress("storage")}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "storage"
                ? styles.activeTabText
                : styles.inactiveTabText,
            ]}
          >
            My Storage
          </Text>
        </TouchableOpacity>
      </View>

      {/* Content based on active tab */}
      <View style={styles.contentContainer}>
        {activeTab === "recent" ? <RecentOrder /> : <MyStorage />}
      </View>
    </View>
  );
};

export default StorageAndRecentOrder;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  tabContainer: {
    flexDirection: "row",
    marginBottom: 16,
    borderRadius: 8,
    backgroundColor: "#D0E5FF",

    borderRadius: 50,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 50,
  },
  activeTabButton: {
    backgroundColor: "#005DD2",
  },
  tabText: {
    fontSize: 14,
    fontWeight: "500",
  },
  activeTabText: {
    color: "#FFFFFF",
  },
  inactiveTabText: {
    color: "#005DD299",
  },
  contentContainer: {
    flex: 1,
  },
});

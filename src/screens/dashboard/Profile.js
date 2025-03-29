import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  SafeAreaView,
  SectionList,
  Platform,
  ActivityIndicator,
} from "react-native";

import {
  UserCircleIcon,
  MapPinIcon,
  PencilIcon,
  ChatBubbleLeftRightIcon,
  KeyIcon,
  QuestionMarkCircleIcon,
  ShieldCheckIcon,
  ArrowRightOnRectangleIcon,
  ChevronRightIcon,
} from "react-native-heroicons/outline";
import { useAuth } from "../../context/AuthProvider";
import { ROUTES } from "../../navigation/routes";

const savedLocations = [
  {
    id: 1,
    name: "Home",
    location: "123 Test Avenue, Lagos",
  },
  {
    id: 2,
    name: "Work",
    location: "456 Business Plaza, Ikeja",
  },
  {
    id: 3,
    name: "School",
    location: "789 Education Street, Victoria Island",
  },
];

const settingsItems = [
  {
    id: "communication",
    title: "Communication",
    icon: ChatBubbleLeftRightIcon,
    route: "Communication",
  },
  {
    id: "security",
    title: "Login and security",
    icon: KeyIcon,
    route: "LoginSecurity",
  },
  {
    id: "support",
    title: "Help and support",
    icon: QuestionMarkCircleIcon,
    route: "HelpSupport",
  },
  {
    id: "privacy",
    title: "Privacy settings",
    icon: ShieldCheckIcon,
    route: "Privacy",
  },
];

const Profile = ({ navigation }) => {
  const { user, logout } = useAuth();

  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // console.log("user", user);

  const userData = user || {
    f_name: "John",
    l_name: "Doe",
    email: "johndoe@example.com",
    phone: "+234 800 123 4567",
  };

  const handleLogout = async () => {
    try {

      setIsLoggingOut(true);

      await logout();

      navigation.reset({
        index: 0,
        routes: [{ name: ROUTES.AUTH_SCREEN }],
      });
    } catch (error) {
      console.error("Logout failed:", error);

      setIsLoggingOut(false);
    }
  };

  const handleSettingPress = (setting) => {
    console.log(`Navigating to ${setting} settings`);
  };

  const sections = [
    {
      type: "header",
      data: [{ title: "Profile" }],
    },
    {
      type: "userInfo",
      data: [userData],
    },
    {
      type: "locationsHeader",
      data: [{ title: "Manage Saved Locations" }],
    },
    {
      type: "locations",
      data: savedLocations,
    },
    {
      type: "settingsHeader",
      data: [{ title: "Settings" }],
    },
    {
      type: "settings",
      data: settingsItems,
    },
    {
      type: "logout",
      data: [{}],
    },
  ];

  const renderItem = ({ item, section }) => {
    switch (section.type) {
      case "userInfo":
        return (
          <View style={styles.userSection}>
            <View style={styles.userIconContainer}>
              <UserCircleIcon size={60} color="#015cd2" />
            </View>
            <View style={styles.userInfo}>
              <Text style={styles.userName}>
                {userData.f_name.charAt(0).toUpperCase() +
                  userData.f_name.slice(1)}{" "}
                {userData.l_name.charAt(0).toUpperCase() +
                  userData.l_name.slice(1)}
              </Text>
              <Text style={styles.userDetails}>{userData.phone}</Text>
              <Text style={styles.userDetails}>{userData.email}</Text>
            </View>
          </View>
        );

      case "locationsHeader":
      case "settingsHeader":
        return (
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>{item.title}</Text>
          </View>
        );

      case "locations":
        return (
          <View style={styles.locationItem}>
            <View style={styles.locationIconContainer}>
              <MapPinIcon size={20} color="#015cd2" />
            </View>
            <View style={styles.locationInfo}>
              <Text style={styles.locationName}>{item.name}</Text>
              <Text style={styles.locationAddress}>{item.location}</Text>
            </View>
            <TouchableOpacity style={styles.editButton}>
              <PencilIcon size={16} color="#666" />
            </TouchableOpacity>
          </View>
        );

      case "settings":
        const IconComponent = item.icon;
        return (
          <TouchableOpacity
            style={styles.settingItem}
            onPress={() => handleSettingPress(item.route)}
          >
            <View style={styles.settingContent}>
              <View style={styles.settingIconContainer}>
                <IconComponent size={20} color="#015cd2" />
              </View>
              <Text style={styles.settingText}>{item.title}</Text>
            </View>
            <ChevronRightIcon size={18} color="#666" />
          </TouchableOpacity>
        );

      case "logout":
        return (
          <TouchableOpacity
            style={styles.logoutButton}
            onPress={handleLogout}
            disabled={isLoggingOut}
          >
            <View style={styles.logoutContent}>
              {isLoggingOut ? (
                <ActivityIndicator
                  size="small"
                  color="#FF3B30"
                  style={styles.logoutIcon}
                />
              ) : (
                <ArrowRightOnRectangleIcon size={20} color="#FF3B30" />
              )}
              <Text style={styles.logoutText}>
                {isLoggingOut ? "Logging out..." : "Log out"}
              </Text>
            </View>
          </TouchableOpacity>
        );

      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor="#ffffff"
        translucent={false}
      />
      <SectionList
        sections={sections}
        renderItem={renderItem}
        keyExtractor={(item, index) => item.id || `${sections.type}-${index}`}
        showsVerticalScrollIndicator={false}
        stickySectionHeadersEnabled={false}
        contentContainerStyle={styles.sectionListContent}
        renderSectionHeader={null}
        SectionSeparatorComponent={({ leadingItem, leadingSection }) => {
          if (
            leadingSection?.type === "header" ||
            leadingSection?.type === "locationsHeader" ||
            leadingSection?.type === "settingsHeader"
          ) {
            return null;
          }
          return <View style={styles.sectionSeparator} />;
        }}
        ItemSeparatorComponent={({ leadingItem, leadingSection }) => {
          if (
            leadingSection?.type === "locations" ||
            leadingSection?.type === "settings"
          ) {
            return <View style={styles.separator} />;
          }
          return null;
        }}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  headerContainer: {
    paddingHorizontal: 16,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#333",
  },
  sectionListContent: {
    // backgroundColor: "#f5f5f5",
  },
  sectionSeparator: {
    height: 12,
    // backgroundColor: "#f5f5f5",
  },
  userSection: {
    flexDirection: "row",
    marginHorizontal: 16,
    marginBottom: 12,
  },
  userIconContainer: {
    marginRight: 16,
  },
  userInfo: {
    flex: 1,
    justifyContent: "center",
  },
  userName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 4,
  },
  userDetails: {
    fontSize: 14,
    color: "#666",
    marginBottom: 2,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    marginHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  viewAllText: {
    fontSize: 14,
    color: "#015cd2",
    fontWeight: "500",
  },
  locationItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginHorizontal: 16,
  },
  separator: {
    height: 1,
    backgroundColor: "#F2F2F2",
    marginHorizontal: 16,
  },
  locationIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  locationInfo: {
    flex: 1,
  },
  locationName: {
    fontSize: 15,
    fontWeight: "500",
    color: "#546273",
    marginBottom: 2,
  },
  locationAddress: {
    fontSize: 13,
    color: "#546273",
  },
  editButton: {
    padding: 8,
  },
  settingItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginHorizontal: 16,
  },
  settingContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  settingIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#f0f8ff",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  settingText: {
    fontSize: 15,
    color: "#546273",
  },
  logoutButton: {
    paddingVertical: 8,
    paddingHorizontal: 8,
    marginHorizontal: 16,
    marginBottom: 20,
  },
  logoutContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  logoutText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#FF3B30",
    marginLeft: 12,
  },
  logoutIcon: {
    width: 20,
    height: 20,
  },
});

export default Profile;

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

  const handleSettingPress = (route) => {
    navigation.navigate(route);
  };

  const sections = [
    {
      type: "userInfo",
      data: [userData],
    },
    {
      type: "locationsHeader",
      data: [{ title: "Saved Locations" }],
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
            <UserCircleIcon size={50} color="#015cd2" style={styles.userIcon} />
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
            <TouchableOpacity
              style={styles.editProfileButton}
              onPress={() => navigation.navigate("EditProfile")}
            >
              <PencilIcon size={16} color="#fff" />
            </TouchableOpacity>
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
          <TouchableOpacity style={styles.locationItem}>
            <View style={styles.locationIconContainer}>
              <MapPinIcon size={16} color="#015cd2" />
            </View>
            <View style={styles.locationInfo}>
              <Text style={styles.locationName}>{item.name}</Text>
              <Text style={styles.locationAddress}>{item.location}</Text>
            </View>
            <TouchableOpacity style={styles.editButton}>
              <PencilIcon size={14} color="#777" />
            </TouchableOpacity>
          </TouchableOpacity>
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
                <IconComponent size={16} color="#015cd2" />
              </View>
              <Text style={styles.settingText}>{item.title}</Text>
            </View>
            <ChevronRightIcon size={16} color="#aaa" />
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
                <ActivityIndicator size="small" color="#FF3B30" />
              ) : (
                <ArrowRightOnRectangleIcon size={18} color="#FF3B30" />
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
      <StatusBar barStyle="dark-content" backgroundColor="#015cd2" />
      <SectionList
        sections={sections}
        renderItem={renderItem}
        keyExtractor={(item, index) => item.id || `${sections.type}-${index}`}
        showsVerticalScrollIndicator={false}
        stickySectionHeadersEnabled={false}
        contentContainerStyle={styles.sectionListContent}
        renderSectionHeader={null}
        SectionSeparatorComponent={({ leadingSection }) => {
          if (
            leadingSection?.type === "locationsHeader" ||
            leadingSection?.type === "settingsHeader"
          ) {
            return null;
          }
          return <View style={styles.sectionSeparator} />;
        }}
        ItemSeparatorComponent={({ leadingSection }) => {
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
    backgroundColor: "#f8f9fa",
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
    backgroundColor: "#fff",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
  },
  sectionListContent: {
    paddingBottom: 20,
  },
  sectionSeparator: {
    height: 8,
  },
  userSection: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    // backgroundColor: "#fff",
    // borderRadius: 8,
    // marginHorizontal: 12,
    // marginTop: 12,
    // shadowColor: "#000",
    // shadowOffset: { width: 0, height: 1 },
    // shadowOpacity: 0.05,
    // shadowRadius: 2,
    // elevation: 2,
  },
  userIcon: {
    marginRight: 12,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 2,
  },
  userDetails: {
    fontSize: 13,
    color: "#666",
    marginBottom: 1,
  },
  editProfileButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#015cd2",
    justifyContent: "center",
    alignItems: "center",
  },
  sectionHeader: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
    // backgroundColor: "#f8f9fa",
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#555",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  locationItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 16,
    // backgroundColor: "#fff",
  },
  separator: {
    height: 1,
    backgroundColor: "#f0f0f0",
    marginLeft: 16,
  },
  locationIconContainer: {
    width: 28,
    height: 28,
    borderRadius: 14,
    // backgroundColor: "#f0f8ff",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  locationInfo: {
    flex: 1,
  },
  locationName: {
    fontSize: 14,
    fontWeight: "500",
    color: "#444",
    marginBottom: 2,
  },
  locationAddress: {
    fontSize: 12,
    color: "#777",
  },
  editButton: {
    padding: 6,
  },
  settingItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
    paddingHorizontal: 16,
    // backgroundColor: "#fff",
  },
  settingContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  settingIconContainer: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#f0f8ff",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  settingText: {
    fontSize: 14,
    color: "#444",
  },
  logoutButton: {
    marginTop: 8,
    marginHorizontal: 12,
    padding: 12,
    borderRadius: 8,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  logoutContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  logoutText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#FF3B30",
    marginLeft: 8,
  },
});

export default Profile;

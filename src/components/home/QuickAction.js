import {StyleSheet, Text, View, Image, TouchableOpacity} from 'react-native';
import React from 'react';
import {useNavigation} from '@react-navigation/native';

import { ROUTES } from '../../navigation/routes';

import Octicons from "@expo/vector-icons/Octicons";

const QuickAction = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Quick Action</Text>

      <View style={styles.actionsRow}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => navigation.navigate(ROUTES.STORAGE)}
        >

          <Octicons name="home" size={48} style={styles.actionIcon}  />
          <Text style={styles.actionText}>Storage</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => navigation.navigate(ROUTES.MAP)}
        >
          <Octicons
            name="package-dependents"
            size={48}
            style={styles.actionIcon}
          />
          <Text style={styles.actionText}>New Order</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default QuickAction;

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 12,
    textAlign: "left",
  },
  actionsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  actionButton: {
    width: "48%",
    height: 120,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#AAD5FF",

    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  actionIcon: {

    color: "#015cd2",
    marginBottom: 12,
    resizeMode: "contain",
  },
  actionText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333",
  },
});

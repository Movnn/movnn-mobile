import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {StyleSheet, View, Text, TouchableOpacity} from 'react-native';

import {
  HomeIcon as HomeOutline,
  WalletIcon as WalletOutline,
  UserIcon as UserOutline,
} from 'react-native-heroicons/outline';


import {
  HomeIcon as HomeSolid,
  WalletIcon as WalletSolid,
  UserIcon as UserSolid,
} from 'react-native-heroicons/solid';


import Home from '../screens/dashboard/Home';
import Wallet from '../screens/dashboard/Wallet';
import Profile from '../screens/dashboard/Profile';
import {ROUTES} from './routes';

const Tab = createBottomTabNavigator();


const CustomTabButton = ({label, isFocused, icon, onPress}) => {
  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={onPress}
      style={[
        styles.customTabButton,
        isFocused ? styles.activeTabButton : styles.inactiveTabButton,
      ]}>
      {icon}
      <Text
        style={[
          styles.tabBarLabel,
          isFocused ? styles.activeLabel : styles.inactiveLabel,
        ]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
};

const TabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#005DD2',
        tabBarInactiveTintColor: 'gray',
        tabBarStyle: styles.tabBar,
        tabBarItemStyle: styles.tabBarItem,
      }}>
      <Tab.Screen
        name={ROUTES.HOME}
        component={Home}
        options={{
          tabBarLabel: '',
          tabBarIcon: () => null,
          tabBarButton: props => {
            const {accessibilityState, onPress} = props;
            const isFocused = accessibilityState.selected;
            return (
              <CustomTabButton
                label="Home"
                isFocused={isFocused}
                onPress={onPress}
                icon={
                  isFocused ? (
                    <HomeSolid color="#005DD2" size={24} />
                  ) : (
                    <HomeOutline color="gray" size={24} />
                  )
                }
              />
            );
          },
        }}
      />
      <Tab.Screen
        name={ROUTES.WALLET}
        component={Wallet}
        options={{
          tabBarLabel: '',
          tabBarIcon: () => null,
          tabBarButton: props => {
            const {accessibilityState, onPress} = props;
            const isFocused = accessibilityState.selected;
            return (
              <CustomTabButton
                label="Wallet"
                isFocused={isFocused}
                onPress={onPress}
                icon={
                  isFocused ? (
                    <WalletSolid color="#005DD2" size={24} />
                  ) : (
                    <WalletOutline color="gray" size={24} />
                  )
                }
              />
            );
          },
        }}
      />
      <Tab.Screen
        name={ROUTES.PROFILE}
        component={Profile}
        options={{
          tabBarLabel: '',
          tabBarIcon: () => null,
          tabBarButton: props => {
            const {accessibilityState, onPress} = props;
            const isFocused = accessibilityState.selected;
            return (
              <CustomTabButton
                label="Profile"
                isFocused={isFocused}
                onPress={onPress}
                icon={
                  isFocused ? (
                    <UserSolid color="#005DD2" size={24} />
                  ) : (
                    <UserOutline color="gray" size={24} />
                  )
                }
              />
            );
          },
        }}
      />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: '#ffffff',
    elevation: 8,
    borderTopWidth: 0,
    height: 60,
    paddingHorizontal: 10,
  },
  tabBarItem: {
    height: 40,
    padding: 0,
  },
  customTabButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    height: 40,
    margin: 5,
    flex: 1,
  },
  activeTabButton: {
    backgroundColor: '#EAF4FF',
  },
  inactiveTabButton: {
    backgroundColor: 'transparent',
  },
  tabBarLabel: {
    fontSize: 12,
    marginLeft: 4,
  },
  activeLabel: {
    color: '#005DD2',
    fontWeight: '600',
  },
  inactiveLabel: {
    color: 'gray',
  },
});

export default TabNavigator;

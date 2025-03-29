
import React from 'react';
import {View, StyleSheet, Platform, SafeAreaView} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import Header from '../../components/home/Header';
import Promotions from '../../components/home/Promotions';
import QuickAction from '../../components/home/QuickAction';
import Recent from '../../components/home/Recent';


const Home = () => {
  const insets = useSafeAreaInsets();

  if (Platform.OS === 'ios') {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          <Header />
          <Promotions />
          <QuickAction />
          <Recent/>
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
      ]}>
      <Header />
      <Promotions />
      <QuickAction />
      <Recent />
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

export default Home;

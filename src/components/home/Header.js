
import {StyleSheet, Text, View, Image, TouchableOpacity} from 'react-native';
import React from 'react';
import movnn_logo_filled from '../../assets/images/filled-logo.png';
import {ChatBubbleOvalLeftIcon, BellIcon} from 'react-native-heroicons/outline';

const Header = () => {
  return (
    <View style={styles.container}>

      <View style={styles.logoContainer}>
        <Image
          source={movnn_logo_filled}
          style={styles.logo}
          resizeMode="contain"
        />
      </View>

     
      <View style={styles.iconsContainer}>
        <TouchableOpacity style={styles.iconButton}>
          <ChatBubbleOvalLeftIcon size={24} color="#005DD2" />
          <View style={styles.questionMark}>
            <Text style={styles.questionMarkText}>?</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.iconButton}>
          <BellIcon size={24} color="#005DD2" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  logoContainer: {
    flex: 1,
  },
  logo: {
    width: 120,
    height: 40,
  },
  iconsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E0EEFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 12,
    position: 'relative',
  },
  questionMark: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    backgroundColor: '#005DD2',
    width: 14,
    height: 14,
    borderRadius: 7,
    justifyContent: 'center',
    alignItems: 'center',
  },
  questionMarkText: {
    color: '#ffffff',
    fontSize: 10,
    fontWeight: 'bold',
  },
});

export default Header;

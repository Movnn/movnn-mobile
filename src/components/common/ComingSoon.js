
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  PixelRatio,
} from 'react-native';
import {
  CalendarIcon,
  BellAlertIcon,
  ClockIcon,
  BuildingLibraryIcon,
} from 'react-native-heroicons/solid';
import Button from './Button';

const {width} = Dimensions.get('window');


const scale = width / 375; 
const normalize = size => {
  const newSize = size * scale;
  return Math.round(PixelRatio.roundToNearestPixel(newSize));
};

const ComingSoon = ({
  title = 'Coming Soon!',
  subtitle = 'This feature is currently under development.',
  featureName = '',
  primaryColor = '#015cd2',
  secondaryColor = '#1F7DF3',
  onNotifyMe = () => {},
  showNotifyButton = true,
  customIcon = null,
}) => {

  const renderIcon = () => {
    if (customIcon) return customIcon;

    const iconSize = normalize(80);
    const iconColor = primaryColor;

    if (featureName.toLowerCase().includes('wallet')) {
      return <BuildingLibraryIcon size={iconSize} color={iconColor} />;
    } else if (featureName.toLowerCase().includes('calendar')) {
      return <CalendarIcon size={iconSize} color={iconColor} />;
    } else {
      return <ClockIcon size={iconSize} color={iconColor} />;
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>{renderIcon()}</View>

      <Text style={[styles.title, {color: primaryColor}]}>{title}</Text>
      <Text style={styles.subtitle}>{subtitle}</Text>

      {featureName ? (
        <View style={[styles.featureTag, {backgroundColor: secondaryColor}]}>
          <Text style={styles.featureText}>{featureName}</Text>
        </View>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: normalize(24),
  },
  iconContainer: {
    marginBottom: normalize(24),
  },
  title: {
    fontSize: normalize(28),
    fontWeight: 'bold',
    marginBottom: normalize(12),
    textAlign: 'center',
  },
  subtitle: {
    fontSize: normalize(16),
    color: '#666',
    textAlign: 'center',
    marginBottom: normalize(24),
    lineHeight: normalize(22),
  },
  featureTag: {
    paddingHorizontal: normalize(16),
    paddingVertical: normalize(8),
    borderRadius: normalize(20),
    marginBottom: normalize(32),
  },
  featureText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: normalize(14),
  },
  buttonContainer: {
    width: '100%',
    alignItems: 'center',
    marginBottom: normalize(40),
  },
  notifyButton: {
    marginBottom: normalize(12),
  },
  notifyText: {
    fontSize: normalize(12),
    color: '#999',
    textAlign: 'center',
    maxWidth: '80%',
  },
  dotsContainer: {
    flexDirection: 'row',
    marginTop: normalize(20),
  },
  dot: {
    width: normalize(8),
    height: normalize(8),
    borderRadius: normalize(4),
    marginHorizontal: normalize(4),
  },
});

export default ComingSoon;

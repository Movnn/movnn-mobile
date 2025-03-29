import {
  Image,
  StyleSheet,
  Text,
  View,
  ScrollView,
  Dimensions,
  Platform,
} from 'react-native';
import React from 'react';
import Button from '../common/Button';
import package_png from '../../assets/images/package.png';

const {width} = Dimensions.get('window');

const Promotions = () => {

  const promotionsData = [
    {id: '1', discount: '20%', image: package_png},
    {id: '2', discount: '15%', image: package_png},
    {id: '3', discount: '30%', image: package_png},
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Promotions</Text>

      <View style={styles.scrollViewContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.scrollViewContent}
          snapToInterval={width - 64} 
          decelerationRate="fast">
          {promotionsData.map(promo => (
            <View key={promo.id} style={styles.card}>
              <View style={styles.cardContent}>
                <Text style={styles.discountText}>
                  {promo.discount} {''}
                  <Text style={styles.discountDescription}>OFF!</Text>
                </Text>

                <Button
                  title={'Apply Discount'}
                  style={styles.button}
                  textStyle={styles.buttonText}
                />
              </View>
           
              <Image source={promo.image} style={styles.packageImage} />
            </View>
          ))}
        </ScrollView>
      </View>
    </View>
  );
};

export default Promotions;

const styles = StyleSheet.create({
  container: {
    marginVertical: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    marginHorizontal: 16,
    textAlign: 'left',
  },
  scrollViewContainer: {
    width: '100%',
    overflow: 'visible',
  },
  scrollViewContent: {
    paddingHorizontal: 8,
    paddingStart: Platform.OS === 'android' ? 8 : 8,
    paddingEnd: Platform.OS === 'android' ? 8 : 8,
  },
  card: {
    width: width - 80,
    height: 160,
    backgroundColor: '#005DD2',
    borderRadius: 12,
    padding: 16,
    position: 'relative',
    overflow: 'hidden',
    marginHorizontal: 8,
    ...Platform.select({
      android: {
        elevation: 5,
      },
      ios: {
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
    }),
  },
  cardContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  discountText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 4,
    textAlign: 'left',
  },
  discountDescription: {
    fontSize: 16,
    color: 'white',
    opacity: 0.8,
    marginBottom: 16,
    textAlign: 'left',
    fontWeight: 'bold',
  },
  button: {
    backgroundColor: '#D8E9FF',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 30,
    width: '100%',
    alignItems: 'flex-start',
    marginTop: 10,
  },
  buttonText: {
    color: '#005DD2',
    fontWeight: '600',
  },
  packageImage: {
    width: 225,
    height: 215,
    resizeMode: 'contain',
    position: 'absolute',
    right: 0,
    bottom: -39,
    ...Platform.select({
      android: {
        elevation: 6,
      },
      ios: {
        zIndex: 1,
      },
    }),
    opacity: 0.9,
  },
});

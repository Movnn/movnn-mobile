import React, { useRef, useEffect, useState } from "react";
import { StyleSheet, View, TouchableOpacity, Text, Alert } from "react-native";
import MapView, {
  Marker,
  Polyline,
  Circle,
  PROVIDER_DEFAULT,
} from "react-native-maps";
import { Ionicons } from "@expo/vector-icons";

const MapComponent = ({
  currentLocation,
  pickupLocation,
  deliveryLocation,
  routePoints,
  onRegionChange,
  onUserLocationChange,
  onMapError,
}) => {
  const mapRef = useRef(null);
  const [mapLoadError, setMapLoadError] = useState(false);
  const [isMapReady, setIsMapReady] = useState(false);

  const ABUJA_COORDINATES = {
    latitude: 9.0765,
    longitude: 7.3986,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  };

  useEffect(() => {
    if (currentLocation && mapRef.current && isMapReady) {
      try {
        mapRef.current.animateToRegion({
          latitude: currentLocation.latitude,
          longitude: currentLocation.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        });
      } catch (error) {
        console.error("Error animating to region:", error);
      
      }
    }
  }, [currentLocation, isMapReady]);

  useEffect(() => {
    if (
      mapRef.current &&
      isMapReady &&
      pickupLocation &&
      deliveryLocation &&
      routePoints &&
      routePoints.length > 0
    ) {
      try {
        mapRef.current.fitToCoordinates([pickupLocation, deliveryLocation], {
          edgePadding: { top: 50, right: 50, bottom: 50, left: 50 },
          animated: true,
        });
      } catch (error) {
        console.error("Error fitting to coordinates:", error);
   
      }
    }
  }, [pickupLocation, deliveryLocation, routePoints, isMapReady]);

  const centerOnUserLocation = () => {
    if (currentLocation && mapRef.current) {
      try {
        mapRef.current.animateToRegion({
          latitude: currentLocation.latitude,
          longitude: currentLocation.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        });
      } catch (error) {
        console.error("Error centering on user location:", error);
        Alert.alert(
          "Location Error",
          "Unable to center on your location. Please try again."
        );
      }
    } else {
      Alert.alert(
        "Location Unavailable",
        "Your current location is not available. Please check your location settings."
      );
    }
  };

  const handleMapError = (error) => {
    console.error("Map error occurred:", error);
    setMapLoadError(true);
    if (onMapError && typeof onMapError === "function") {
      onMapError(error);
    }
  };

  const handleMapReady = () => {
    console.log("Map is ready");
    setIsMapReady(true);
  };

  if (mapLoadError) {
    return (
      <View style={[styles.container, styles.errorContainer]}>
        <Ionicons name="map-outline" size={64} color="#005DD2" />
        <Text style={styles.errorTitle}>Map Unavailable</Text>
        <Text style={styles.errorMessage}>
          We're having trouble loading the map. This might be due to location
          permissions or connectivity issues.
        </Text>
        <TouchableOpacity
          style={styles.retryButton}
          onPress={() => {
            setMapLoadError(false);
          }}
        >
          <Text style={styles.retryButtonText}>Try Again</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <MapView
        provider={PROVIDER_DEFAULT}
        customMapStyle={[
          {
            elementType: "geometry",
            stylers: [
              {
                visibility: "simplified",
              },
            ],
          },
        ]}
        ref={mapRef}
        style={styles.map}
        initialRegion={
          currentLocation
            ? {
                latitude: currentLocation.latitude,
                longitude: currentLocation.longitude,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01,
              }
            : ABUJA_COORDINATES
        }
        showsUserLocation
        showsMyLocationButton={false}
        onRegionChange={onRegionChange}
        onUserLocationChange={onUserLocationChange}
        onMapReady={handleMapReady}
        onError={handleMapError}
      >
        {/* Pickup marker with geofence circle */}
        {pickupLocation && (
          <>
            <Marker
              coordinate={pickupLocation}
              title="Pickup"
              description="Pickup location"
              pinColor="#FF5722"
            />
            <Circle
              center={pickupLocation}
              radius={100}
              fillColor="rgba(255, 87, 34, 0.2)"
              strokeColor="rgba(255, 87, 34, 0.5)"
              strokeWidth={1}
            />
          </>
        )}

        {/* Delivery marker with geofence circle */}
        {deliveryLocation && (
          <>
            <Marker
              coordinate={deliveryLocation}
              title="Delivery"
              description="Delivery location"
              pinColor="#2196F3"
            />
            <Circle
              center={deliveryLocation}
              radius={100}
              fillColor="rgba(33, 150, 243, 0.2)"
              strokeColor="rgba(33, 150, 243, 0.5)"
              strokeWidth={1}
            />
          </>
        )}

        {/* Route line */}
        {routePoints && routePoints.length > 0 && (
          <Polyline
            coordinates={routePoints}
            strokeColor="#FF5722"
            strokeWidth={4}
          />
        )}
      </MapView>

      <TouchableOpacity
        style={styles.myLocationButton}
        onPress={centerOnUserLocation}
      >
        <Ionicons name="locate" size={24} color="#333" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    overflow: "hidden",
  },
  map: {
    width: "100%",
    height: "100%",
  },
  myLocationButton: {
    position: "absolute",
    bottom: 16,
    right: 16,
    backgroundColor: "white",
    borderRadius: 30,
    width: 50,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  errorContainer: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#EAF4FF",
    padding: 20,
  },
  errorTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#333",
    marginTop: 20,
    marginBottom: 10,
  },
  errorMessage: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginBottom: 30,
  },
  retryButton: {
    backgroundColor: "#005DD2",
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 25,
  },
  retryButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
});

export default MapComponent;

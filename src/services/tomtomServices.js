import axios from "axios";

const TOMTOM_API_KEY = "8xZfgkToBfJ48qW93cM9SHnMpCw4ZD6C";

const BASE_URL = "https://api.tomtom.com";

// Rate limiting setup
const requestQueue = [];
let isProcessingQueue = false;
const MIN_REQUEST_INTERVAL = 300; 
let lastRequestTime = 0;


const processQueue = async () => {
  if (isProcessingQueue || requestQueue.length === 0) return;

  isProcessingQueue = true;

  while (requestQueue.length > 0) {
    const currentTime = Date.now();
    const timeSinceLastRequest = currentTime - lastRequestTime;

    if (timeSinceLastRequest < MIN_REQUEST_INTERVAL) {
      // Wait before making the next request
      await new Promise((resolve) =>
        setTimeout(resolve, MIN_REQUEST_INTERVAL - timeSinceLastRequest)
      );
    }

    const request = requestQueue.shift();

    try {
      const response = await request.execute();
      lastRequestTime = Date.now();
      request.resolve(response);
    } catch (error) {
      request.reject(error);
    }
  }

  isProcessingQueue = false;
};


const queueRequest = (executeFunc) => {
  return new Promise((resolve, reject) => {
    requestQueue.push({
      execute: executeFunc,
      resolve,
      reject,
    });

    processQueue();
  });
};


export const geocodeAddress = async (address, countrySet = "NG") => {
  try {
    const response = await queueRequest(() =>
      axios.get(
        `${BASE_URL}/search/2/geocode/${encodeURIComponent(address)}.json`,
        {
          params: {
            key: TOMTOM_API_KEY,
            limit: 5,
            countrySet: countrySet, 
          },
        }
      )
    );

    if (response.data.results && response.data.results.length > 0) {
      return {
        success: true,
        results: response.data.results.map((result) => ({
          position: {
            latitude: result.position.lat,
            longitude: result.position.lon,
          },
          address: result.address.freeformAddress,
        })),

        position: {
          latitude: response.data.results[0].position.lat,
          longitude: response.data.results[0].position.lon,
        },
        address: response.data.results[0].address.freeformAddress,
      };
    }

    return {
      success: false,
      error: "No results found",
    };
  } catch (error) {
    console.error("Geocoding error:", error);
    return {
      success: false,
      error: error.message,
    };
  }
};

// Reverse Geocoding - Convert coordinates to address
export const reverseGeocode = async (latitude, longitude) => {
  try {
    const response = await queueRequest(() =>
      axios.get(
        `${BASE_URL}/search/2/reverseGeocode/${latitude},${longitude}.json`,
        {
          params: {
            key: TOMTOM_API_KEY,
          },
        }
      )
    );

    if (response.data.addresses && response.data.addresses.length > 0) {
      const address = response.data.addresses[0].address;
      return {
        success: true,
        address: address.freeformAddress,
        streetName: address.streetName,
        municipality: address.municipality,
        postalCode: address.postalCode,
      };
    }

    return {
      success: false,
      error: "No address found for these coordinates",
    };
  } catch (error) {
    console.error("Reverse geocoding error:", error);
    return {
      success: false,
      error: error.message,
    };
  }
};

// Calculate route between two points
export const calculateRoute = async (startPoint, endPoint) => {
  try {
    const response = await queueRequest(() =>
      axios.get(
        `${BASE_URL}/routing/1/calculateRoute/${startPoint.latitude},${startPoint.longitude}:${endPoint.latitude},${endPoint.longitude}/json`,
        {
          params: {
            key: TOMTOM_API_KEY,
          },
        }
      )
    );

    if (response.data.routes && response.data.routes.length > 0) {
      const route = response.data.routes[0];
      const legs = route.legs[0];
      const points = legs.points.map((point) => ({
        latitude: point.latitude,
        longitude: point.longitude,
      }));

      return {
        success: true,
        distance: route.summary.lengthInMeters,
        duration: route.summary.travelTimeInSeconds,
        points: points,
      };
    }

    return {
      success: false,
      error: "No route found",
    };
  } catch (error) {
    console.error("Route calculation error:", error);
    return {
      success: false,
      error: error.message,
    };
  }
};

// Create a geofence (circular)
export const createGeofence = async (name, center, radius) => {
  try {
    //send this to  backend
    const geofence = {
      id: Date.now().toString(),
      name,
      center,
      radius,
    };

    return {
      success: true,
      geofence,
    };
  } catch (error) {
    console.error("Create geofence error:", error);
    return {
      success: false,
      error: error.message,
    };
  }
};

// Check if a point is within a geofence
export const isPointInGeofence = (point, geofence) => {
  // Calculate distance between point and geofence center
  const distance = getDistanceBetweenPoints(
    point.latitude,
    point.longitude,
    geofence.center.latitude,
    geofence.center.longitude
  );

  // Return true if the distance is less than the radius
  return distance <= geofence.radius;
};

// Calculate distance between two points using Haversine formula
const getDistanceBetweenPoints = (lat1, lon1, lat2, lon2) => {
  const R = 6371e3; // Earth's radius in meters
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c; // Distance in meters
};

export default {
  geocodeAddress,
  reverseGeocode,
  calculateRoute,
  createGeofence,
  isPointInGeofence,
};

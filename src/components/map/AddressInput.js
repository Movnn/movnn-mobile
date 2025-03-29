import React, { useState, useEffect } from "react";
import {
  View,
  TextInput,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  FlatList,
  Keyboard,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { geocodeAddress, reverseGeocode } from "../../services/tomtomServices";
import { getCurrentLocation } from "../../utils/locationUtils";
import { MapPinIcon } from "react-native-heroicons/outline";
import { MapPinIcon as MapPinSolid } from "react-native-heroicons/solid";


const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

const AddressInput = ({
  label,
  placeholder,
  value,
  onAddressChange,
  onCoordinatesChange,
  error,
  isPrimary = false,
  editable = true,
  showLocationButton = true,
  onSuggestionShow,
  onSuggestionHide,
  zIndex = 1,
}) => {
  const [address, setAddress] = useState(value || "");
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [inputError, setInputError] = useState(error);
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    setAddress(value || "");
  }, [value]);

  useEffect(() => {
    setInputError(error);
  }, [error]);

  useEffect(() => {

    if (suggestions.length > 0) {
      onSuggestionShow && onSuggestionShow();
    } else {
      onSuggestionHide && onSuggestionHide();
    }
  }, [suggestions.length]);

 
  const debouncedSearch = debounce(async (text) => {
    if (text.length < 3) {
      setSuggestions([]);
      return;
    }

    setLoading(true);
    try {
     
      const result = await geocodeAddress(text, "NG");
      if (result.success && result.results && result.results.length > 0) {
     
        const formattedSuggestions = result.results.map((item) => ({
          address: item.address,
          coordinates: item.position,
        }));

        setSuggestions(formattedSuggestions);
      } else {
        setSuggestions([]);
      }
    } catch (error) {
      console.error("Error searching for address:", error);
      setSuggestions([]);
    } finally {
      setLoading(false);
    }
  }, 500); 


  const handleAddressChange = (text) => {
    setAddress(text);
    onAddressChange && onAddressChange(text);

    if (!editable) {
      setSuggestions([]);
      return;
    }

    debouncedSearch(text);
  };


  const handleSelectAddress = (item) => {
    setAddress(item.address);
    onAddressChange && onAddressChange(item.address);
    onCoordinatesChange && onCoordinatesChange(item.coordinates);
    setSuggestions([]);
    Keyboard.dismiss();
  };

 
  const handleUseCurrentLocation = async () => {
    setLoading(true);
    try {

      const result = await getCurrentLocation();
      if (result.success) {
     
        const addressResult = await reverseGeocode(
          result.location.latitude,
          result.location.longitude
        );

        if (addressResult.success) {
          setAddress(addressResult.address);
          onAddressChange && onAddressChange(addressResult.address);
          onCoordinatesChange && onCoordinatesChange(result.location);
        } else {
          setInputError("Could not get address for this location");
        }
      } else {
        setInputError("Could not get current location");
      }
    } catch (error) {
      console.error("Error getting current location:", error);
      setInputError("Error accessing location services");
    } finally {
      setLoading(false);
    }
  };

  const handleFocus = () => {
    setIsFocused(true);

    if (address && address.length >= 3) {
      debouncedSearch(address);
    }
  };

  const handleBlur = () => {
    setIsFocused(false);
 
  };

  return (
    <View style={[styles.container, { zIndex: zIndex }]}>
      {label && <Text style={styles.label}>{label}</Text>}

      <View style={styles.inputRow}>
        <View
          style={[
            styles.inputContainer,
            inputError && styles.inputError,
            isFocused && styles.inputFocused,
            isPrimary ? styles.primaryInput : styles.secondaryInput,
          ]}
        >
          {isPrimary ? (
            <MapPinSolid size={20} color="#005DD2" />
          ) : (
            <MapPinIcon size={20} color="#666" />
          )}

          <TextInput
            style={styles.input}
            placeholder={placeholder || "Enter address"}
            placeholderTextColor="#666"
            value={address}
            onChangeText={handleAddressChange}
            editable={editable}
            onFocus={handleFocus}
            onBlur={handleBlur}
          />

          {loading && <ActivityIndicator size="small" color="#FF5722" />}
        </View>


        {showLocationButton && (
          <TouchableOpacity
            style={styles.locationButton}
            onPress={handleUseCurrentLocation}
            disabled={loading}
          >
            <Ionicons
              name="locate"
              size={22}
              color={loading ? "#999" : "#005DD2"}
            />
          </TouchableOpacity>
        )}
      </View>

      {inputError && <Text style={styles.errorText}>{inputError}</Text>}

      {suggestions.length > 0 && (
        <View style={styles.suggestionsContainer}>

          {suggestions.map((item, index) => (
            <TouchableOpacity
              key={`suggestion-${index}`}
              style={styles.suggestionItem}
              onPress={() => handleSelectAddress(item)}
            >
              <Ionicons name="location-outline" size={18} color="#777" />
              <Text
                style={styles.suggestionText}
                numberOfLines={1}
                ellipsizeMode="tail"
              >
                {item.address}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
    position: "relative",
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 12,
    flex: 1,
    borderWidth: 1,
    borderColor: "transparent",
  },
  primaryInput: {
    backgroundColor: "#F5F5F5",
  },
  secondaryInput: {
    backgroundColor: "#F5F5F5",
  },
  inputError: {
    borderColor: "#f44336",
  },
  inputFocused: {
    borderColor: "#005DD2",
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: "#333",
    marginLeft: 10,
  },
  locationButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#F5F5F5",
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  errorText: {
    color: "#f44336",
    fontSize: 14,
    marginTop: 4,
  },
  suggestionsContainer: {
    position: "absolute",
    top: 55,
    left: 0,
    right: 0,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    maxHeight: 200,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 5,
    zIndex: 999,
    overflow: "hidden",
  },
  suggestionItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  suggestionText: {
    fontSize: 14,
    marginLeft: 8,
    flex: 1,
  },
});

export default AddressInput;

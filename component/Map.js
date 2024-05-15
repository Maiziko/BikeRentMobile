import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, Button, Linking } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import { findNearest } from 'geolib';

const BIKE_STATIONS = [
  { latitude: -6.934800, longitude: 107.769123 },
  { latitude: -6.935331, longitude: 107.770211 },
  { latitude: -6.934186, longitude: 107.770839 },
];

const Map = () => {
  const [initialRegion, setInitialRegion] = useState(null);
  const [userLocation, setUserLocation] = useState(null);

  useEffect(() => {
    const getLocation = async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.log('Permission to access location was denied');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = location.coords;
      console.log('User location:', { latitude, longitude }); // Log user's location
      setInitialRegion({
        latitude,
        longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      });
      setUserLocation({ latitude, longitude });
    };

    getLocation();

    const intervalId = setInterval(getLocation, 3000);

    return () => clearInterval(intervalId);
  }, []);

  const findNearestBikeStation = () => {
    if (!userLocation) return;
  
    const nearestStation = findNearest(userLocation, BIKE_STATIONS);
    console.log('Nearest bike station:', nearestStation);
  
    const { latitude, longitude } = nearestStation;
    const origin = `${userLocation.latitude},${userLocation.longitude}`;
    const destination = `${latitude},${longitude}`;
  
    const googleMapsURL = `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${destination}`;
    console.log('Google Maps URL:', googleMapsURL);
  
    // Open the Google Maps URL in a web browser
    Linking.openURL(googleMapsURL);
  };

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={initialRegion}
      >
        {initialRegion && (
          <Marker
            coordinate={initialRegion}
            title="Your Location"
            description="You are here!"
          />
        )}
        {userLocation && (
          <Marker
            coordinate={userLocation}
            title="User Location"
            description="User is here!"
            pinColor="blue"
          />
        )}
      </MapView>
      <View style={styles.buttonContainer}>
        <Button title="Find Nearest Bike Station" onPress={findNearestBikeStation} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 20,
    left: '50%',
    transform: [{ translateX: -75 }],
    width: 220, // Adjust the width according to your button text length
    borderRadius: 10,
    backgroundColor: 'white',
    padding: 10,
  },
});

export default Map;

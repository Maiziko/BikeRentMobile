import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, Button, Linking, Modal, TouchableOpacity } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import { findNearest } from 'geolib';
import { Image } from 'expo-image';
import { collection, query, where, getDocs, deleteDoc } from 'firebase/firestore';
import { firestore } from '../config/firebase';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';



const Map = ({userId}) => {
  const [initialRegion, setInitialRegion] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [posSepeda, setPos] = useState([]);
  const [selectedPos, setSelectedPos] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchPos = async () => {
      try {
        const pos = collection(firestore, "Pos");
        const querySnapshot = await getDocs(pos);
        const posData = querySnapshot.docs.map(doc => ({
          latitude: doc.data().location.latitude,
          longitude: doc.data().location.longitude,
          nBike: doc.data().nBike,
          name: doc.data().name,
        }));
        setPos(posData);
      } catch (error) {
        console.error("Error fetching pos data:", error);
      }
    };

    fetchPos();
  }, []);

  useEffect(() => {
    const getLocation = async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.log('Permission to access location was denied');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = location.coords;
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

  const handleMarkerPress = (pos) => {
    setSelectedPos(pos);
    setShowModal(true);
  };


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
      <MapView style={styles.map} initialRegion={initialRegion}>
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
        {posSepeda.map((pos, index) => (
          <Marker
            key={index}
            coordinate={{ latitude: pos.latitude, longitude: pos.longitude }}
            title={pos.name}
            description={`Bikes Available: ${pos.nBike}`}
            onPress={() => handleMarkerPress(pos)}
          >
            <Image source={require('../../assets/nav/pos.svg')} style={{ width: 40, height: 55, contentFit: "fill" }} />
          </Marker>
        ))}
      </MapView>
      <Modal
        visible={showModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            {selectedPos && (
              <>
                <TouchableOpacity style={{alignSelf: 'flex-end'}} onPress={() => { setShowModal(false)}}>
                    <Text style={{fontWeight: 'bold', fontSize: 18}}> X </Text>
                </TouchableOpacity>
                <Text style={styles.modalText}>Pos sepeda: {selectedPos.name}</Text>
                <Text style={styles.modalText}>Jumlah Sepeda: {selectedPos.nBike}</Text>
                
                <View style={[styles.buttonContainer]}>
                <LinearGradient colors={['#EB7802', '#DA421C']} style={styles.button}>
                    <TouchableOpacity onPress={() => navigation.navigate('BarcodeScanner', {userId}, setShowModal(false))}>
                      <Text style={styles.buttonText}>Scan QR Sepeda</Text>
                    </TouchableOpacity>
                </LinearGradient>      
                          
              </View>
              </>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: '100%',
    height: '100%',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    alignItems: 'left',
  },
  modalText: {
    fontSize: 18,
    marginBottom: 5,
    left: 20,
    color: '#0B1A3F',
    fontWeight: 'bold'
  },
  modalButton: {
    marginTop: 20,
    backgroundColor: 'orange',
    paddingVertical: 10,
    paddingHorizontal: 40,
    borderRadius: 5,
  },
  modalButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    width: "45%",
    borderWidth: 0.5,
    marginHorizontal: 20,
  },
  buttonText: {
    fontSize: 18,
    textAlign: "center",
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
    width: "100%",
  },
});

export default Map;

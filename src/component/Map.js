import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, Button, Linking, Modal, TouchableOpacity, TouchableOpacityComponent } from 'react-native';
import MapView, { Marker, MarkerAnimated } from 'react-native-maps';
import * as Location from 'expo-location';
import { findNearest, isPointWithinRadius } from 'geolib';
import { Image } from 'expo-image';
import { collection, query, where, getDocs, deleteDoc, updateDoc } from 'firebase/firestore';
import { firestore } from '../config/firebase';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';



const Map = ({userId}) => {
  const [initialRegion, setInitialRegion] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [posSepeda, setPos] = useState([]);
  const [selectedPos, setSelectedPos] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [bikeLocation, setBikeLocation] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchPos = async () => {
      try {
        const pos = collection(firestore, "Pos");
        const querySnapshot = await getDocs(pos);
        const posData = querySnapshot.docs.map(doc => ({
          idpos: doc.data().idpos,
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

    const intervalId = setInterval(fetchPos, 3000);

    return () => clearInterval(intervalId);
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

  useEffect(() => {
    getBikeLocation()
    const intervalId = setInterval(getBikeLocation, 3000);
    return () => clearInterval(intervalId);
  }, [])

  useEffect(() => {
    updateNumberOfBikeInPos()
    const intervalId = setInterval(updateNumberOfBikeInPos, 3000);
    return () => clearInterval(intervalId)
  })

  const handleMarkerPress = (pos) => {
    setSelectedPos(pos);
    setShowModal(true);
  };


  const findNearestBikeStation = () => {
    if (!userLocation) return;
  
    const bikeStations = []
    posSepeda.forEach((pos) => {
      bikeStations.push({
        latitude: pos.latitude,
        longitude: pos.longitude
      })
    })
    const nearestStation = findNearest(userLocation, bikeStations);
    console.log('Nearest bike station:', nearestStation);
  
    const { latitude, longitude } = nearestStation;
    const origin = `${userLocation.latitude},${userLocation.longitude}`;
    const destination = `${latitude},${longitude}`;
  
    const googleMapsURL = `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${destination}`;
    console.log('Google Maps URL:', googleMapsURL);
  
    // Open the Google Maps URL in a web browser
    Linking.openURL(googleMapsURL);
  };

  const getBikeLocation = async () => {
    const bikeRef = collection(firestore, "bike")
    const bikeQuery = query(bikeRef)
    const bikeSnapshot = await getDocs(bikeQuery)

    const newBikeLocation = []
    bikeSnapshot.forEach(doc => {
      const latitude = doc.data().location.latitude
      const longitude = doc.data().location.longitude
      const bikeID = doc.data().bikeID
      newBikeLocation.push({
        bikeID: bikeID,
        latitude: latitude,
        longitude: longitude
      })
    })

    setBikeLocation(newBikeLocation);
  }

  const updateNumberOfBikeInPos = async () => {
    posSepeda.forEach(async (pos) => {
      const posLocation = {latitude: pos.latitude, longitude: pos.longitude}
      const radius = 2; // we define a bike must be in 2 meter radius from posLocation to belong to that pos
      let nBike = 0;
      bikeLocation.forEach(async(bike) => {
        const bikePosition = {latitude: bike.latitude, longitude: bike.longitude}
        if (isPointWithinRadius(bikePosition, posLocation, radius)) {
          const bikeRef = collection(firestore, "bike")
          const bikeQuery = query(bikeRef, where("bikeID", "==", bike.bikeID))
          const bikeSnapshot = await getDocs(bikeQuery);
          if (bikeSnapshot.docs[0].data().rented == false) {
            nBike = nBike + 1
          }
        }
      })
      const posRef = collection(firestore, "Pos")
      const posQuery = query(posRef, where("idpos", "==", pos.idpos))
      const posSnapshot = await getDocs(posQuery)
      await updateDoc(posSnapshot.docs[0].ref, { nBike: nBike })
    })
  }

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
        {bikeLocation && (
          bikeLocation.map((bikeLocation, index) => (
            <Marker
              key={index}
              coordinate={{latitude: bikeLocation.latitude, longitude: bikeLocation.longitude}}
              title={"BikeID: "+bikeLocation.bikeID}
              pinColor="red"
            />
          ))
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
      
      <View style={styles.findNearestButtonContainer}>
        <LinearGradient colors={['#D93F1E', '#EC7A01']} style={{padding: 10, borderRadius: 20, width: '80%'}}>
          <TouchableOpacity   onPress={findNearestBikeStation}>
            <Text style={styles.findNearestButtonText}>Tampilkan Pos Terdekat</Text>
          </TouchableOpacity>
        </LinearGradient>
      </View>  
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
  findNearestButtonContainer: {
    // Adjusted to fit the text
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    width: '100%',
    bottom: 50,
    zIndex: 99999
  },
  findNearestButtonText: {
    fontSize: 14, // Adjusted font size
    color: 'white',
    textAlign: 'center'
  },
  container: {
    flex: 1,
    position: 'relative'
  },
  map: {
    width: '100%',
    height: '100%',
    position: 'relative'
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

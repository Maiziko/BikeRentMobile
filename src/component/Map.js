import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, Button, Linking, Modal, TouchableOpacity, TouchableOpacityComponent } from 'react-native';
import MapView, { Marker, MarkerAnimated } from 'react-native-maps';
import * as Location from 'expo-location';
import { findNearest, isPointWithinRadius } from 'geolib';
import { Image } from 'expo-image';
import { collection, query, where, getDocs, deleteDoc, updateDoc } from 'firebase/firestore';
import { firestore, realtime } from '../config/firebase';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { getDatabase, ref, onValue, update, get, child, equalTo, orderByChild  } from "firebase/database";
  // import { getDatabase, ref, query, get, update, child, equalTo, orderByChild } from "firebase/database";


const Map = ({userId}) => {
  const [initialRegion, setInitialRegion] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [posSepeda, setPos] = useState([]);
  const [selectedPos, setSelectedPos] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [bikeLocation, setBikeLocation] = useState([]);
  const navigation = useNavigation();

  // useEffect(() => {
  //   const fetchPos = async () => {
  //     try {
  //       const pos = collection(firestore, "Pos");
  //       const querySnapshot = await getDocs(pos);
  //       const posData = querySnapshot.docs.map(doc => ({
  //         idpos: doc.data().idpos,
  //         latitude: doc.data().location.latitude,
  //         longitude: doc.data().location.longitude,
  //         nBike: doc.data().nBike,
  //         name: doc.data().name,
  //       }));
  //       setPos(posData);
  //     } catch (error) {
  //       console.error("Error fetching pos data:", error);
  //     }
  //   };

  //   fetchPos();

  //   const intervalId = setInterval(fetchPos, 3000);

  //   return () => clearInterval(intervalId);
  // }, []);

const posRef = ref(realtime, 'Pos');

useEffect(() => {
    const fetchPos = () => {
      onValue(posRef, (snapshot) => {
        const data = snapshot.val();
        const posData = Object.keys(data).map(key => ({
          idpos: key,
          latitude: data[key].latitude,
          longitude: data[key].longitude,
          nBike: data[key].nBike,
          name: data[key].name,
        }));
        setPos(posData);
        console.log('Pos data:', posData);
      }, (error) => {
        console.error("Error fetching pos data:", error);
      });
    };
    fetchPos();
    // Cleanup listener on unmount
    return () => {
      posRef.off();
    };
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

  // useEffect(() => {
  //   getBikeLocation()
  //   const intervalId = setInterval(getBikeLocation, 3000);
  //   return () => clearInterval(intervalId);
  // }, [])

  // useEffect(() => {
  //   updateNumberOfBikeInPos()
  //   const intervalId = setInterval(updateNumberOfBikeInPos, 3000);
  //   return () => clearInterval(intervalId)
  // })

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

  // const getBikeLocation = async () => {
  //   const bikeRef = collection(firestore, "bike")
  //   const bikeQuery = query(bikeRef)
  //   const bikeSnapshot = await getDocs(bikeQuery)

  //   const newBikeLocation = []
  //   bikeSnapshot.forEach(doc => {
  //     const latitude = doc.data().location.latitude
  //     const longitude = doc.data().location.longitude
  //     const bikeID = doc.data().bikeID
  //     newBikeLocation.push({
  //       bikeID: bikeID,
  //       latitude: latitude,
  //       longitude: longitude
  //     })
  //   })

  //   setBikeLocation(newBikeLocation);
  // }
const bikeRef = ref(realtime, 'Bike');

const getBikeLocation = () => {
    onValue(bikeRef, (snapshot) => {
        const data = snapshot.val();
        const newBikeLocation = [];

        Object.keys(data).forEach(key => {
            const bike = data[key];
            newBikeLocation.push({
                bikeID: key,
                latitude: bike.latitude,
                longitude: bike.longitude,
                rented: bike.rented
            });
        });

        setBikeLocation(newBikeLocation);
        console.log('nwebike',newBikeLocation);
    }, (error) => {
        console.error("Error fetching bike data:", error);
    });
};

useEffect(() => {
    getBikeLocation();

    // Cleanup listener on unmount
    return () => {
        bikeRef.off();
    };
}, []);


  // const updateNumberOfBikeInPos = async () => {
  //   posSepeda.forEach(async (pos) => {
  //     const posLocation = {latitude: pos.latitude, longitude: pos.longitude}
  //     const radius = 2; // we define a bike must be in 2 meter radius from posLocation to belong to that pos
  //     let nBike = 0;
  //     bikeLocation.forEach(async(bike) => {
  //       const bikePosition = {latitude: bike.latitude, longitude: bike.longitude}
  //       if (isPointWithinRadius(bikePosition, posLocation, radius)) {
  //         const bikeRef = collection(firestore, "bike")
  //         const bikeQuery = query(bikeRef, where("bikeID", "==", bike.bikeID))
  //         const bikeSnapshot = await getDocs(bikeQuery);
  //         if (bikeSnapshot.docs[0].data().rented == false) {
  //           nBike = nBike + 1
  //         }
  //       }
  //     })
  //     const posRef = collection(firestore, "Pos")
  //     const posQuery = query(posRef, where("idpos", "==", pos.idpos))
  //     const posSnapshot = await getDocs(posQuery)
  //     await updateDoc(posSnapshot.docs[0].ref, { nBike: nBike })
  //   })
  // }

  // import { getDatabase, ref, query, get, update, child, equalTo, orderByChild } from "firebase/database";

const updateNumberOfBikeInPos = async () => {
  // const db = getDatabase();

  // Fetch all positions
  // const posRef = ref(db, 'Pos');
  const posSnapshot = await get(posRef);
  const posData = posSnapshot.val();

  if (!posData) {
    return;
  }

  // Convert positions to an array
  const posArray = Object.keys(posData).map(key => ({
    idpos: key,
    ...posData[key]
  }));

  // Fetch all bike locations
  // const bikeRef = ref(db, 'Bike');
  const bikeSnapshot = await get(bikeRef);
  const bikeData = bikeSnapshot.val();

  if (!bikeData) {
    return;
  }

  // Convert bike locations to an array
  const bikeArray = Object.keys(bikeData).map(key => ({
    bikeID: key,
    ...bikeData[key]
  }));

  for (const pos of posArray) {
    const posLocation = { latitude: pos.latitude, longitude: pos.longitude };
    const radius = 2; // 2 meter radius
    let nBike = 0;

    for (const bike of bikeArray) {
      const bikePosition = { latitude: bike.latitude, longitude: bike.longitude };
      if (isPointWithinRadius(bikePosition, posLocation, radius)) {
        nBike++;
      }
    }

    const posRef = ref(realtime, `Pos/${pos.idpos}`);
    await update(posRef, { nBike });
  }
};


  // const updateNumberOfBikeInPos = async () => {
  //     const posLocation = posSepeda.map(pos => ({
  //         idpos: pos.idpos,
  //         location: {latitude: pos.latitude, longitude: pos.longitude},
  //         nBike: 0 // initialize with 0
  //     }));
  
  //     onValue(bikeRef, (snapshot) => {
  //         const bikes = snapshot.val();
  
  //         // Reset nBike count for all positions
  //         posLocation.forEach(pos => pos.nBike = 0);
  
  //         // Count bikes within the radius
  //         Object.keys(bikes).forEach(key => {
  //             const bike = bikes[key];
  //             const bikePosition = {latitude: bike.latitude, longitude: bike.longitude};
  
  //             posLocation.forEach(pos => {
  //                 if (isPointWithinRadius(bikePosition, pos.location, 2) && bike.rented === false) {
  //                     pos.nBike += 1;
  //                 }
  //             });
  //         });
  
  //         // Update the nBike count in Realtime Database
  //         posLocation.forEach(pos => {
  //             const posUpdateRef = ref(realtime, `Pos/${pos.idpos}`);
  //             update(posUpdateRef, { nBike: pos.nBike });
  //         });
  //     });
  // };
  
  useEffect(() => {
      updateNumberOfBikeInPos();
  }, [bikeLocation]);
  
  
  return (
    <View style={styles.container}>
      <MapView style={styles.map} initialRegion={initialRegion}>
        {initialRegion && (
          <Marker
            coordinate={{latitude: initialRegion.latitude, longitude: initialRegion.longitude}}
            title="Your Location"
            description="You are here!"
          />
        )}
        {userLocation && (
          <Marker
            coordinate={{latitude: userLocation.latitude, longitude: userLocation.longitude}}
            title="User Location"
            description="User is here!"
            pinColor="blue"
          />
        )}
        {bikeLocation && (
          bikeLocation.map((bike, index) => (
            <Marker
              key={index}
              coordinate={{latitude: bike.latitude, longitude: bike.longitude}}
              title={"BikeID: "+bike.bikeID}
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

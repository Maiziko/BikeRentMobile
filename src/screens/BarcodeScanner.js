import React, { useState, useEffect } from 'react';
import { Text, View, Button, StyleSheet, Dimensions, Alert } from 'react-native';
import { Camera, CameraView } from 'expo-camera';
import { firestore, firebaseAuth } from '../config/firebase';
import { collection, addDoc, query, where, getDocs, updateDoc, Timestamp } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';

const BarcodeScanner = () => {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [scannedData, setScannedData] = useState(null);
  const [cameraActive, setCameraActive] = useState(true);
  // const [currentUser, setCurrentUser] = useState("null");
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();

    // const unsubscribe = onAuthStateChanged(firebaseAuth, (user) => {
    //   if (user) {
    //     setCurrentUser(user);
    //   } else {
    //     setCurrentUser(null);
    //   }
    // });

    // return () => unsubscribe();

    setCurrentUser("richard");
  }, []);

  const handleBarcodeScanned = async ({ type, data }) => {
    setScanned(true);
    setScannedData(data);
    setCameraActive(false);

    if (!currentUser) {
      Alert.alert('Error', 'No user is logged in.');
      setScanned(false);
      setCameraActive(true);
      return;
    }

    // Convert bikeID from string to number
    const bikeID = parseInt(data, 10);

    // Check if bikeID is a valid number
    if (isNaN(bikeID)) {
      Alert.alert('Invalid QR code', 'The scanned QR code does not contain a valid bike ID.');
      setScanned(false);
      setCameraActive(true);
      return;
    }

    // Get current user's ID and current timestamp
    // const userID = currentUser.uid;
    const userID = currentUser;
    const currentTimestamp = Timestamp.now();

    try {
      // Query for the rental document where bikeID matches and rentalEnd is null
      const rentalQuery = query(
        collection(firestore, 'Rental'),
        where('bikeID', '==', bikeID),
        where('rentalEnd', '==', null)
      );

      const querySnapshot = await getDocs(rentalQuery);

      if (!querySnapshot.empty) {
        let documentUpdated = false;
        querySnapshot.forEach(async (doc) => {
          if (doc.data().userID === userID) {
            await updateDoc(doc.ref, { rentalEnd: currentTimestamp });
            documentUpdated = true;
            Alert.alert('Rental ended!', `Bike ID: ${bikeID}\nRental ID: ${doc.id}\nRental ended successfully.`);
          }
        });
        if (!documentUpdated) {
          Alert.alert('Error', 'You can only end your own rental.');
        }
      } else {
        // If no matching document is found, create a new rental document
        const rentalDocRef = await addDoc(collection(firestore, 'Rental'), {
          bikeID,
          userID,
          rentalStart: currentTimestamp,
          rentalEnd: null,
        });

        Alert.alert('Rental started!', `Bike ID: ${bikeID}\nRental ID: ${rentalDocRef.id}`);
      }
    } catch (error) {
      console.error("Error handling barcode scan: ", error);
      Alert.alert('Error', 'There was an error processing your request.');
    }
  };

  if (hasPermission === null) {
    return <Text>Requesting for camera permission</Text>;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  return (
    <View style={styles.container}>
      {cameraActive && (
        <View style={styles.cameraContainer}>
          <CameraView
            onBarcodeScanned={scanned ? undefined : handleBarcodeScanned}
            style={StyleSheet.absoluteFillObject}
          />
          <View style={styles.overlay}>
            <View style={styles.topOverlay} />
            <View style={styles.middleContainer}>
              <View style={styles.sideOverlay} />
              <View style={styles.box} />
              <View style={styles.sideOverlay} />
            </View>
            <View style={styles.bottomOverlay} />
          </View>
        </View>
      )}
      {scanned && (
        <>
          <Button title={'Tap to Scan Again'} onPress={() => {
            setScanned(false);
            setCameraActive(true);
          }} />
          {scannedData && (
            <Text style={styles.scannedData}>Scanned Data: {scannedData}</Text>
          )}
        </>
      )}
    </View>
  );
};

const overlayColor = 'rgba(0, 0, 0, 0.5)'; // Color of the overlay with opacity
const windowWidth = Dimensions.get('window').width; // Width of the camera view
const windowHeight = Dimensions.get('window').height; // Height of the camera view
const boxWidth = 250; // Width of the clear box
const boxHeight = 250; // Height of the clear box

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
  },
  cameraContainer: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  topOverlay: {
    flex: 1,
    width: windowWidth,
    backgroundColor: overlayColor,
  },
  middleContainer: {
    flexDirection: 'row',
  },
  sideOverlay: {
    width: (windowWidth - boxWidth) / 2,
    height: boxHeight,
    backgroundColor: overlayColor,
  },
  box: {
    width: boxWidth,
    height: boxHeight,
    borderColor: '#fff',
    borderWidth: 2,
    backgroundColor: 'transparent',
  },
  bottomOverlay: {
    flex: 1,
    width: windowWidth,
    backgroundColor: overlayColor,
  },
  scannedData: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    fontSize: 16,
    textAlign: 'center',
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 10,
  },
});

export default BarcodeScanner;

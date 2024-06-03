import React, { useState, useEffect } from 'react';
import { Text, View, Button, StyleSheet, Dimensions, Alert } from 'react-native';
import { Camera, CameraView } from 'expo-camera';
import { firestore, firebaseAuth } from '../config/firebase';
import { collection, addDoc, query, where, getDocs, updateDoc, Timestamp } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';

const Notification = (navigation, route) => {
    // const {userId} = route.params
    // console.log('userIddi notif',  userId)
    return(
        <View>
            <Text>sss</Text>
        </View>
    )
}

export default Notification;
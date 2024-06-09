import React, { useState, useEffect } from 'react';
import { Text, View, Button, StyleSheet, Dimensions, Alert } from 'react-native';
import { Camera, CameraView } from 'expo-camera';
import { firestore, firebaseAuth } from '../config/firebase';
import { collection, addDoc, query, where, getDocs, updateDoc, Timestamp, getDoc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import Topbar_2 from '../component/topbar_2';

const Notification = ({navigation, route}) => {
    const {userId} = route.params
    console.log('userIddi notif',  userId)
    const [notification, setNotification] = useState(null);
    const [loading, setLoading] = useState(false)
    const fetchNotificationData = async () => {
        const notificationRef = collection(firestore, "notifikasi");
        const notificationQuery = query(notificationRef, where("userId", "==", userId))
        const notificationSnapshot = await getDocs(notificationQuery)

        const notificationData = []

        notificationSnapshot.forEach((notif) => {
            const notifData = notif.data()
            notificationData.push(notifData);
        })

        notificationData.sort((a,b) => b.timeStamp-a.timeStamp)

        setNotification(notificationData);
        // console.log('notification', notificationSnapshot);
        // const dummyNotifications = [
        //     {
        //         message: "You have ended rental on bike 1",
        //         timestamp: new Date('2024-06-08T10:00:00'),
        //         userID: 123
        //     },
        //     {
        //         message: "You have ended rental on bike 2",
        //         timestamp: new Date('2024-06-08T09:30:00'),
        //         userID: 124
        //     },
        //     {
        //         message: "You have started rental on bike 1",
        //         timestamp: new Date('2024-06-08T09:00:00'),
        //         userID: 123
        //     },
        //     {
        //         message: "You have started rental on bike 2",
        //         timestamp: new Date('2024-06-08T08:00:00'),
        //         userID: 124
        //     },
        //     {
        //         message: "You have started rental on bike 1",
        //         timestamp: new Date('2024-06-08T07:00:00'),
        //         userID: 123
        //     },
        //     {
        //         message: "You have started rental on bike 2",
        //         timestamp: new Date('2024-06-08T06:00:00'),
        //         userID: 124
        //     }
        // ];
    
        // // Sort notifications in descending order based on timestamp
        // dummyNotifications.sort((a, b) => b.timestamp - a.timestamp);
    
        // // Set the notification state
        // setNotification(dummyNotifications);
    }
    useEffect(() => {
        setLoading(true)
        fetchNotificationData()
        setLoading(false)
    }, [])
    if(loading) {
        return(
            <></>
        )
    }
    return(
        <View>
            <Topbar_2 tittle={'NOTIFIKASI'}></Topbar_2>
            {notification && notification.map((notif, index) => (
                <View key={index} style={{backgroundColor: '#FFD4A8', position: 'relative', marginLeft: 10, marginRight: 10, marginTop: 10, height: 80, borderRadius: 15}}>
                    <Text style={{color: '#0B1A3F', fontSize: 15, fontWeight: 500, marginTop: 5, marginLeft: 10}}>{notif.message}</Text>
                    <Text style={{fontSize: 10, fontWeight: 400, color: '#707B81', position: 'absolute', bottom: 5, right: 10}}>{new Date(notif.timeStamp.seconds * 1000).toLocaleString()}</Text>
                </View> 
            ))}
        </View>
    )
}

export default Notification;
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Image } from 'expo-image';
import { Link } from 'expo-router';
import { firestore } from '../config/firebase'; 
import { collection, onSnapshot, query, where } from 'firebase/firestore';

const Topbar = () => {
    const [hasNotifications, setHasNotifications] = useState(false);
    const username = 'Udin';

    useEffect(() => {
        const rentalCollectionRef = collection(firestore, 'Rental');
    
        const unsubscribe = onSnapshot(rentalCollectionRef, () => {
            setHasNotifications(true); // Set notifications to true whenever changes occur
        });
    
        return () => unsubscribe();
    }, []);
    

    const handleNotificationClick = () => {
        // Logic to navigate to the notification page and mark notifications as read
        setHasNotifications(false);
        Alert.alert('Navigating to notifications page...');
        // Implement actual navigation logic here
    };

    return (    
        <View style={styles.container}>
            <LinearGradient colors={['#EB7802', '#DA421C']} style={styles.container}/>
            <View style={styles.left}>
                <Link href='/'>
                    <View>
                        <Image source={require('../../assets/functional/dummy-profile.jpeg')} contentFit='fill' style={{width:55, height:55, borderRadius:30}}/>
                    </View>
                </Link>
                <View style={{paddingLeft:10}}>
                    <Text style={{color:'#FFFFFF', fontWeight:'bold', fontSize:21}}>Hello, {username}</Text>
                    <Text style={{color:'#FFFFFF', fontWeight:'semibold', fontSize:15}}>99 Tahun</Text>
                </View>
            </View>
            <View style={styles.right}>
                <Link href='/' onPress={handleNotificationClick}>
                    <View style={{flex:1, position:'absolute', alignItems:'center', justifyContent:'center'}}>
                        <Image 
                            source={hasNotifications 
                                ? require('../../assets/nav/home-inact.svg') 
                                : require('../../assets/functional/notification.svg')} 
                            contentFit='fill' 
                            style={{width:39, height:39}}
                        />
                    </View>
                </Link>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'absolute',
        width: '100%',
        height: 100,
        top: 0,
        borderBottomLeftRadius: 25,
        borderBottomRightRadius: 25,
    },
    left: {
        position: 'absolute',
        flexDirection: 'row',
        top: 25,
        left: 25,
    },
    right: {
        position: 'absolute',
        top: 30,
        right:25,
    },
});

export default Topbar;

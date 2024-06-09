import { Alert, FlatList, Pressable, StyleSheet, Text, TouchableOpacity, View, } from 'react-native';
import { Image } from 'expo-image';
import { Link } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { LinearGradient } from 'expo-linear-gradient';

import Button from '../component/Button';
import Topbar_2 from '../component/topbar_2';


const CardItem = ({ title, account, image, onPress, isActive=false }) => (
    <TouchableOpacity style={[styles.cardItem, isActive && styles.activeCardItem]} onPress={onPress}>
        <Image source={{ uri: image }} style={styles.cardImage} />
        <View style={styles.cardTextContainer}>
            <Text style={[styles.cardTitle]}>{title}</Text>
            <Text style={[styles.cardAccount]}>{account}</Text>
        </View>
    </TouchableOpacity>
);

const Payment = () => {
    const cards = [
        {
        id: '1',
        title: 'Mandiri',
        account: '123456789',
        image: 'https://via.placeholder.com/150',
        },
        {
        id: '2',
        title: 'Free Shipping',
        account: '123456789',
        image: 'https://via.placeholder.com/150',
        },
        {
        id: '3',
        title: 'Buy 1 Get 1 Free',
        account: '123456789',
        image: 'https://via.placeholder.com/150',
        },
    ];

    const [activeCardId, setActiveCardId] = useState(null);
    const handleCardPress = (id) => {
        setActiveCardId(id);
        let desc = cards.find((card) => card.id === id).account;
        Alert.alert('Card Berhasil Digunakan', desc);
    };

    return (
        <View style={styles.container}>
            <View style={{flexDirection:'row', height:100}}>
                <LinearGradient colors={['#EB7802', '#DA421C']} style={styles.top}/>
                <View style={{position:'absolute', top:25, left:25}}>
                    <Link href='/'>
                        <View>
                            <Image source={require('../../assets/nav/back.svg')} contentFit='fill' style={{width:55, height:55, borderRadius:30}}/>
                        </View>
                    </Link>
                </View>
                <View style={{width:'100%', alignItems:'center', justifyContent:'center'}}>
                    <Text style={{color:'#FFFFFF', fontWeight:'bold', fontSize:21, textShadowColor: '#000', textShadowOffset: { width: 2, height: 2 }, textShadowRadius: 3,}}>Pembayaran</Text>
                </View>
            </View>
            <Text style={{color:'#DC481A', fontWeight:'semibold', fontSize:20, marginVertical:10, marginLeft:15}}>Pilih Kartu Pembayaran</Text>
            <FlatList
                data={cards}
                renderItem={({ item }) => (
                    <CardItem
                        title={item.title}
                        account={item.account}
                        image={item.image}
                        isActive={item.id === activeCardId}
                        onPress={() => handleCardPress(item.id)}
                    />
                )}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.cardList}
            />
            <View style={styles.bottom}>
                <View style={{flexDirection:'row'}}>
                    <Text style={{color:'#5E5F60', fontWeight:'semibold', fontSize:14, left:5}}>Diskon :</Text>
                    <Text style={{color:'#5E5F60', fontWeight:'bold', fontSize:14, position:'absolute', right:5}}>15%</Text>
                </View>
                <View style={{flexDirection:'row'}}>
                    <Text style={{color:'#5E5F60', fontWeight:'semibold', fontSize:14, left:5}}>Total Jam :</Text>
                    <Text style={{color:'#5E5F60', fontWeight:'bold', fontSize:14, position:'absolute', right:5}}>5 Jam</Text>
                </View>
                <View style={{flexDirection:'row'}}>
                    <Text style={{color:'#5E5F60', fontWeight:'semibold', fontSize:16, left:5}}>Summary :</Text>
                    <Text style={{color:'#5E5F60', fontWeight:'bold', fontSize:16, position:'absolute', right:5}}>Rp85000</Text>
                </View>
                <Button children={'Bayar'}/>
            </View>
            <Modal
                transparent={true}
                animationType="slide"
                visible={modalVisible}
                onRequestClose={handleClose}
            >
                <View style={{backgroundColor: 'rgba(0, 0, 0, 0.5)', padding: 10, width: '100%', height: '100%', marginLeft: 'auto', marginRight: 'auto'}}>
                <View style={{backgroundColor: 'white', borderRadius: 20, marginTop: 'auto', marginBottom: 'auto'}}>
                <View style={{padding: 20}}>
                    <Image source={require('../../assets/GaLang.png')} style={{width: 133, height: 189, marginLeft: 'auto', marginRight: 'auto'}}></Image>
                    <Image source={require('../../assets/TulisanGaLang.png')} style={{width: 117, height: 27, marginLeft: 'auto', marginRight: 'auto'}}></Image>
                    <Text style={{color: '#459708', marginLeft: 'auto', marginRight: 'auto', marginTop: 20, fontWeight: 'bold', fontSize: 16}}>Pembayaran Berhasil</Text>
                    <Text style={{color: '#004268', marginLeft: 'auto', marginRight: 'auto', marginTop: 10, fontWeight: 'bold', fontSize: 14}}>Terima kasih sudah menggunakan BikeRent</Text>
                    <Pressable onPress={handleClose} style={{marginTop: 20, backgroundColor: '#459708', padding: 15, borderRadius: 10}}><Text style={{textAlign: 'center', color: 'white', fontWeight: 'bold'}}>OK</Text></Pressable>
                </View>
                </View>
                </View>
            </Modal>
        </View>
    )
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 20,
    },
    top: {
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
    bottom: {
        flexDirection: 'column',
        backgroundColor: '#ffffff',
        position: 'absolute',
        width: '100%',
        height: 150,
        bottom: 0,
        marginBottom: 5,
        padding: 10,
        borderTopStartRadius: 25,
        borderTopEndRadius: 25,
        shadowColor: "#000",
        shadowOpacity: 0.5,
        shadowRadius: 100,
        elevation: 5,
    },
    cardList: {
        paddingHorizontal: 15,
    },
    cardItem: {
        flexDirection: 'row',
        marginBottom: 10,
        padding: 10,
        borderRadius: 10,
        backgroundColor: '#f9f9f9',
        elevation: 1,
    },
    activeCardItem: {
        backgroundColor: '#FFD4A8',
    },
    cardImage: {
        width: 70,
        height: 70,
        borderRadius: 25,
        marginRight: 15,
    },
    cardTextContainer: {
        flex: 1,
        justifyContent: 'center',
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    cardAccount: {
        fontSize: 14,
        color: '#666',
    },
});

export default Payment;
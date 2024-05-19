import { Alert, FlatList, Pressable, StyleSheet, Text, TouchableOpacity, View, } from 'react-native';
import { Image } from 'expo-image';
import { Link } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { LinearGradient } from 'expo-linear-gradient';


const VoucherItem = ({ title, description, image, onPress, isActive=false }) => (
    <TouchableOpacity style={[styles.voucherItem, isActive && styles.activeVoucherItem]} onPress={onPress}>
        <Image source={{ uri: image }} style={styles.voucherImage} />
        <View style={styles.voucherTextContainer}>
        <Text style={[styles.voucherTitle, isActive && styles.activeVoucherTitle]}>{title}</Text>
        <Text style={[styles.voucherDescription, isActive && styles.activeVoucherDescription]}>{description}</Text>
        </View>
    </TouchableOpacity>
);

const MyVoucher = () => {
    const vouchers = [
        {
        id: '1',
        title: 'Discount 20%',
        description: 'Get 20% off on all items',
        image: 'https://via.placeholder.com/150',
        },
        {
        id: '2',
        title: 'Free Shipping',
        description: 'Free shipping on orders over $50',
        image: 'https://via.placeholder.com/150',
        },
        {
        id: '3',
        title: 'Buy 1 Get 1 Free',
        description: 'Buy one get one free on selected items',
        image: 'https://via.placeholder.com/150',
        },
    ];

    const [activeVoucherId, setActiveVoucherId] = useState(null);

    const handleVoucherPress = (id) => {
        setActiveVoucherId(id);
        Alert.alert('Voucher Used', `You have activated the voucher with id: ${id}`);
    };

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Available Vouchers</Text>
            <FlatList
            data={vouchers}
            renderItem={({ item }) => (
                <VoucherItem
                title={item.title}
                description={item.description}
                image={item.image}
                isActive={item.id === activeVoucherId}
                onPress={() => handleVoucherPress(item.id)}
                />
            )}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.voucherList}
            />
        </View>
    )
}


const styles = StyleSheet.create({
    container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 50,
    },
    header: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    },
    voucherList: {
    paddingHorizontal: 20,
    },
    voucherItem: {
    flexDirection: 'row',
    marginBottom: 20,
    padding: 10,
    borderRadius: 10,
    backgroundColor: '#f9f9f9',
    elevation: 1,
    },
    activeVoucherItem: {
    backgroundColor: '#e0f7fa',
    },
    voucherImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
    },
    voucherTextContainer: {
    flex: 1,
    justifyContent: 'center',
    },
    voucherTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    },
    activeVoucherTitle: {
    color: '#00796b',
    },
    voucherDescription: {
    fontSize: 14,
    color: '#666',
    },
    activeVoucherDescription: {
    color: '#004d40',
    },
});

export default MyVoucher;
import React, { useState } from 'react';
import { Alert, FlatList, Modal, StyleSheet, Text, Button, TextInput, TouchableOpacity, View } from 'react-native';
import { Image } from 'expo-image';
import Topbar_2 from '../component/topbar_2';

const PaymentMethodItem = ({ image, cardNumber, expiry, cvc, cardHolder, onRemove }) => (
  <View style={styles.paymentMethodItem}>
    <Image source={image} style={styles.paymentImage} contentFit="contain" />
    <View style={styles.paymentTextContainer}>
      <Text style={styles.cardNumber}>{cardNumber}</Text>
      <Text style={styles.cardDetails}>{expiry} | {cvc}</Text>
      <Text style={styles.cardHolder}>{cardHolder}</Text>
    </View>
    <TouchableOpacity style={styles.removeButton} onPress={onRemove}>
      <Text style={styles.removeButtonText}>Remove</Text>
    </TouchableOpacity>
  </View>
);

const MyCard = () => {
  const [paymentMethods, setPaymentMethods] = useState([
    { id: '1', cardNumber: '1224 5678 9012 3456', expiry: '12/25', cvc: '123', cardHolder: 'John Doe', image: require('../../assets/bri.png') },
    { id: '2', cardNumber: '2345 6789 0123 4567', expiry: '11/24', cvc: '456', cardHolder: 'Jane Smith', image: require('../../assets/bca.png') },
    { id: '3', cardNumber: '3456 7890 1234 5678', expiry: '10/23', cvc: '789', cardHolder: 'Alice Johnson', image: require('../../assets/mandiri.png') }
  ]);

  const [modalVisible, setModalVisible] = useState(false);
  const [mdlVisible, setModalVsb] = useState(false);
  const [newCardNumber, setNewCardNumber] = useState('');
  const [selectedId, setSelectedId] = useState(null);
  const [newExpiry, setNewExpiry] = useState('');
  const [newCvc, setNewCvc] = useState('');
  const [newCardHolder, setNewCardHolder] = useState('');

  const handleAddPaymentMethod = () => {
    const newPaymentMethod = {
      id: (paymentMethods.length + 1).toString(),
      cardNumber: newCardNumber,
      expiry: newExpiry,
      cvc: newCvc,
      cardHolder: newCardHolder,
      image: require('../../assets/bri.png'),
    };
    setPaymentMethods([...paymentMethods, newPaymentMethod]);
    setModalVisible(false);
    setNewCardNumber('');
    setNewExpiry('');
    setNewCvc('');
    setNewCardHolder('');
  };


  const handleClearInput = () => {
    setModalVisible(false);
    setNewCardNumber('');
    setNewExpiry('');
    setNewCvc('');
    setNewCardHolder('');
  };

  const handleRemovePaymentMethod = (id) => {
    setPaymentMethods(paymentMethods.filter(method => method.id !== id));
  };

  return (
    <View style={{ flex : 1 }}>
        <Topbar_2 tittle={'MY CARD'}/>
        <View style={styles.container}>
        <FlatList
            data={paymentMethods}
            renderItem={({ item }) => (
            <PaymentMethodItem
                cardNumber={item.cardNumber}
                expiry={item.expiry}
                cvc={item.cvc}
                cardHolder={item.cardHolder}
                image={item.image}
                onRemove={() => { setModalVsb(true); setSelectedId(item.id); }}
            />
            )}
            keyExtractor={item => item.id}
            contentContainerStyle={styles.paymentList}
        />
        <TouchableOpacity style={styles.addButton} onPress={() => setModalVisible(true)}>
            <Image source={require('../../assets/add_button.svg')} contentFit='fill' style={{width:80, height:80, borderRadius:30}}/>
        </TouchableOpacity>

        <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => setModalVisible(false)}
        >
            <View style={styles.modalContainer}>
            <View style={styles.modalView}>
                <Text style={styles.modalTitle}>Add Payment Method</Text>
                <TextInput
                placeholder="Card Number"
                value={newCardNumber}
                onChangeText={setNewCardNumber}
                style={styles.input}
                keyboardType="numeric"
                />
                <TextInput
                placeholder="BB/TT"
                value={newExpiry}
                onChangeText={setNewExpiry}
                style={styles.input}
                keyboardType="numeric"
                />
                <TextInput
                placeholder="CVC"
                value={newCvc}
                onChangeText={setNewCvc}
                style={styles.input}
                keyboardType="numeric"
                />
                <TextInput
                placeholder="Card Holder Name"
                value={newCardHolder}
                onChangeText={setNewCardHolder}
                style={styles.input}
                />
                <TouchableOpacity style={styles.saveButton} onPress={handleAddPaymentMethod}>
                <Text style={styles.saveButtonText}>Save</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.cancelButton} onPress={handleClearInput}>
                <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
            </View>
            </View>
        </Modal>

        <Modal
          transparent={true}
          visible={mdlVisible}
          animationType="fade"
          onRequestClose={() => setModalVsb(false)}
        >
          <TouchableOpacity style={styles.modalOverlay} onPress={() => setModalVsb(false)} />
          <View style={styles.modalContent}>
            <Text>Hapus metode pembayaran?</Text>
            <View style={styles.buttonContainer}>
              <Button title="Yes" onPress={() => {handleRemovePaymentMethod(selectedId);setModalVsb(false);}} />
              <Button title="No" onPress={() => setModalVsb(false)} />
            </View>
          </View>
        </Modal>

        </View>
    </View> 
        
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
    paddingHorizontal: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },

  paymentList: {
    paddingBottom: 100,
  },
  
  paymentMethodItem: {
    flexDirection: 'row',
    marginBottom: 20,
    padding: 10,
    borderRadius: 10,
    backgroundColor: '#f9f9f9',
    elevation: 1,
  },
  paymentImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
  },
  paymentTextContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  cardNumber: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  cardDetails: {
    fontSize: 14,
    color: '#666',
  },
  cardHolder: {
    fontSize: 14,
    color: '#666',
  },
  removeButton: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
  },
  removeButtonText: {
    color: '#f00',
    fontWeight: 'bold',
  },
  addButton: {
    position: 'absolute',
    right: 10,
    bottom: 10,
    borderRadius: 50,
    padding: 15,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalView: {
    backgroundColor: 'white',
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  saveButton: {
    backgroundColor: '#28a745',
    borderRadius: 5,
    padding: 10,
    alignItems: 'center',
    marginBottom: 10,
  },
  saveButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  cancelButton: {
    backgroundColor: '#dc3545',
    borderRadius: 5,
    padding: 10,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    margin: 20,
    borderRadius: 10,
    elevation: 5,
    alignItems: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },

});

export default MyCard;

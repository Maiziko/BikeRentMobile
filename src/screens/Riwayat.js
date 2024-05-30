import React, { useEffect, useState } from 'react';
import { Alert, FlatList, Modal, StyleSheet, Text, Button, TextInput, TouchableOpacity, View } from 'react-native';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import Navbar from '../component/navbar';
import { useNavigation } from '@react-navigation/native';

const RentalHistoryItem = ({ location, price, date, duration, id, isSelected, onSelect }) => (
  <TouchableOpacity onPress={() => onSelect(id)} style={[styles.historyItem, isSelected && styles.selectedItem]}>
    <View style={styles.historyLeft}>
      <View style={styles.historyLocation}>
        <Image source={require('../../assets/nav/loc.svg')} style={styles.icon} />
        <Text style={styles.locText}>{location}</Text>
      </View>
      <Text style={styles.historyId}>ID: {id}</Text>
      <View style={styles.historyPrice}>
        <Image source={require('../../assets/nav/bill.svg')} style={{width: 18, height: 18, marginRight: 5, contentFit: 'fill'}} />
        <Text style={styles.historyText}>{price}</Text>
      </View>
    </View>
    <View style={styles.historyRight}>
      <View style={styles.historyLocation}>
        <Image source={require('../../assets/clock.svg')} style={{width: 18, height: 18, marginRight: 5, contentFit: 'fill'}} />
        <Text style={styles.historyDuration}>{duration}</Text>
      </View>
      <Text style={styles.historyDate}>{date}</Text>
    </View>
  </TouchableOpacity>
);

const Riwayat = ({route}) => {
  const {userId} = route.params;
  const navigation = useNavigation();

  const [rentalHistory, setRentalHistory] = useState([
    {
      id: '1',
      location: 'Outlet A',
      price: 'Rp200.000',
      date: '03 Apr 2024 19:15 WIB',
      duration: '3 Jam',
    },
    {
      id: '2',
      location: 'Outlet B',
      price: 'Rp150.000',
      date: '03 Apr 2024 19:15 WIB',
      duration: '2 Jam',
    },
    {
      id: '3',
      location: 'Outlet C',
      price: 'Rp300.000',
      date: '03 Apr 2024 19:15 WIB',
      duration: '5 Jam',
    },
  ]);

  const [isSelecting, setIsSelecting] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [deleting, setDeleting] = useState(false);

  

  const toggleSelectionMode = () => {
    if (isSelecting && selectedItems.length > 0) {
      setDeleting(true);
      setShowModal(true);
    } else if (isSelecting && selectedItems.length === 0) {
      setIsSelecting(false);
    } else {
      setIsSelecting(true);
    }
  };
  
  const handleShowmodal = () => {
    setShowModal(true);
  }

  const handleSelectItem = (id) => {
    if (isSelecting) {
      setSelectedItems((prevSelectedItems) => {
        if (prevSelectedItems.includes(id)) {
          return prevSelectedItems.filter(item => item !== id);
        } else {
          return [...prevSelectedItems, id];
        }
      });
    }
  };

  const handleDelete = () => {
    setRentalHistory((prevHistory) => prevHistory.filter(item => !selectedItems.includes(item.id)));
    setShowModal(false);
    setIsSelecting(false);
    setDeleting(false);
    setSelectedItems([]);
  };

  const selectAllItems = () => {
    if (isSelecting) {
      if (selectedItems.length === rentalHistory.length) {
        setSelectedItems([]);
      } else {
        setSelectedItems(rentalHistory.map(item => item.id));
      }
    }
  };  

  return (
    <View style={{ flex: 1 }}>
      <View style={{flexDirection:'row', height:100}}>
        <LinearGradient colors={['#EB7802', '#DA421C']} style={styles.top}/>
        <View style={{position:'absolute', top:25, left:25}}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Image source={require('../../assets/nav/back.svg')} contentFit='fill' style={{ width: 55, height: 55, borderRadius: 30 }} />
          </TouchableOpacity>
        </View>
        <View style={{width:'100%', alignItems:'center', justifyContent:'center'}}>
          <Text style={{color:'#FFFFFF', fontWeight:'bold', fontSize:21, textShadowColor: '#000', textShadowOffset: { width: 2, height: 2 }, textShadowRadius: 3,}}>RIWAYAT</Text>
        </View>

        <View style={{ position: 'absolute', top: 25, right: 25 }}>
            <TouchableOpacity onPress={deleting ? handleShowmodal : toggleSelectionMode}>
                <Image source={require('../../assets/nav/dustbin.svg')} contentFit='fill' style={{ width: 55, height: 55, borderRadius: 30 }} />
            </TouchableOpacity>
        </View>


      </View>
      <View style={styles.container}>
        {isSelecting && (
          <TouchableOpacity onPress={selectAllItems}>
            <Text style={styles.selectAll}>{selectedItems.length === rentalHistory.length ? 'Batalkan Semua (X)' : `Pilih Semua (${selectedItems.length})`}</Text>
          </TouchableOpacity>
        )}
        <FlatList
          data={rentalHistory}
          renderItem={({ item }) => (
            <RentalHistoryItem
              location={item.location}
              price={item.price}
              date={item.date}
              duration={item.duration}
              id={item.id}
              isSelected={selectedItems.includes(item.id)}
              onSelect={handleSelectItem}
            />
          )}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.historyList}
        />
      </View>
      <Navbar userId={userId}/>

      <Modal
        animationType="fade"
        transparent={true}
        visible={showModal}
        onRequestClose={() => setShowModal(false)}
        >
        <View style={styles.modalOverlay}>
            <View style={styles.modalContainer}>
            <TouchableOpacity style={styles.closeButton} onPress={() => { setShowModal(false); setDeleting(false); }}>
                <Text style={styles.closeButtonText}>X</Text>
            </TouchableOpacity>
            <Text style={styles.modalText}>Konfirmasi penghapusan {selectedItems.length} item riwayat?</Text>
            <View style={styles.modalButtons}>
                <Button title="Ya" onPress={handleDelete} />
                <Button title="Tidak" onPress={() => { setShowModal(false); setDeleting(false); }} />
            </View>
            </View>
        </View>
        </Modal>

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
    paddingHorizontal: 20,
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
  historyList: {
    paddingHorizontal: 0,
  },
  historyItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
    padding: 10,
    borderRadius: 10,
    backgroundColor: '#f9f9f9',
    elevation: 1,
  },
  selectedItem: {
    backgroundColor: '#ffe4b2',
  },
  historyLeft: {
    flexDirection: 'column',
  },
  historyRight: {
    flexDirection: 'column',
    alignItems: 'flex-end',
  },
  historyLocation: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  historyPrice: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  icon: {
    width: 12,
    height: 16,
    marginRight: 5,
    contentFit: 'fill',
  },
  historyText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#DD4B18',
  },
  locText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0B1A3',
  },
  historyId: {
    fontSize: 14,
    color: '#666',
  },
  historyDuration: {
    fontSize: 14,
    color: '#666',
  },
  historyDate: {
    fontSize: 14,
    color: '#666',
    marginTop: 34,
  },
  selectAll: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#007BFF',
    marginBottom: 10,
    textAlign: 'Left',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContainer: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
    elevation: 10,
  },
  closeButton: {
    alignSelf: 'flex-end',
  },
  closeButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  modalText: {
    fontSize: 18,
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContainer: {
    width: '80%',
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    alignItems: 'center',
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
  closeButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  modalText: {
    fontSize: 18,
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  
});

export default Riwayat;

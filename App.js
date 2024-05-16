import { StyleSheet, Text, View, Dimensions, StatusBar } from 'react-native';
import Map from './component/Map';
import Navbar from './component/navbar';

export default function App() {
  return (
    <View style={styles.container}>
      <Map/>
      <Navbar/>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
    marginTop: StatusBar.currentHeight,
  },
});



import { StyleSheet, Text, View, Dimensions, StatusBar } from 'react-native';
import Map from './component/Map';
import Navbar from './component/navbar';
import Topbar from './component/topbar';
import Topbar_2 from './component/topbar_2';

export default function App() {
  return (
    <View style={styles.container}>
      <Map/>
      <Topbar/>
      <Topbar_2 tittle = "My Car"/>
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



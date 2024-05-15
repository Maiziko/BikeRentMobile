import { StyleSheet, Text, View, Dimensions, StatusBar } from 'react-native';
import Map from './component/Map';

export default function App() {
  return (
    <View style={styles.container}>
      <Map />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
    borderWidth: 1,
    borderColor: 'black',
    marginTop: StatusBar.currentHeight,
  },
});



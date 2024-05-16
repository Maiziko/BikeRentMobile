import { StyleSheet, Text, View } from 'react-native';
import { Image } from 'expo-image'
import { Link } from 'expo-router';

const Navbar = () => {
  var route = route;

  return (
    <View style={styles.container}>
        <View style={styles.left}>
            <Link href='/'>
                <View style={{flex:1, position:'absolute', alignItems:'center', justifyContent:'center'}}>
                    <Image source={require('../assets/nav/home-inact.svg')} contentFit='fill' style={{width:27, height:27}}/>
                    <Text style={{color:'#5E5F60', fontWeight:'semibold'}}>Home</Text>
                </View>
            </Link>
            <Link href='/'>
            <View style={{flex:1, position:'absolute', alignItems:'center', justifyContent:'center'}}>
                    <Image source={require('../assets/nav/post-inact.svg')} contentFit='fill' style={{width:27, height:27}}/>
                    <Text style={{color:'#5E5F60', fontWeight:'semibold'}}>Post</Text>
                </View>
            </Link>
        </View>
        <View style={styles.center}>
            <Image source={require('../assets/nav/scanqr.svg')} contentFit='fill' style={{width:75, height:75}}/>
        </View>
        <View style={styles.right}>
            <Link href='/'>
                <View style={{flex:1, position:'absolute', alignItems:'center', justifyContent:'center'}}>
                    <Image source={require('../assets/nav/history-inact.svg')} contentFit='fill' style={{width:27, height:27}}/>
                    <Text style={{color:'#5E5F60', fontWeight:'semibold'}}>History</Text>
                </View>
            </Link>
            <Link href='/'>
                <View style={{flex:1, position:'absolute', alignItems:'center', justifyContent:'center'}}>
                    <Image source={require('../assets/nav/profile-inact.svg')} contentFit='fill' style={{width:27, height:27}}/>
                    <Text style={{color:'#5E5F60', fontWeight:'semibold'}}>Profile</Text>
                </View>
            </Link>
        </View>
    </View>
  )
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        backgroundColor: '#ffffff',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'absolute',
        width: '100%',
        height: 70,
        bottom: 10,
        marginBottom: 5,
        padding: 10,
        borderTopStartRadius: 25,
        borderTopEndRadius: 25,
    },
    left: {
        position: 'absolute',
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '40%',
        paddingHorizontal: 25,
        bottom: 15,
        left: 5,
    },
    center: {
        position: 'absolute',
        bottom: 21,
    },
    right: {
        position: 'absolute',
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '40%',
        paddingHorizontal: 25,
        bottom: 15,
        right: 5,
    }
});

export default Navbar;
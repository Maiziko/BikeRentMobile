import { StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Image } from 'expo-image'
import { Link } from 'expo-router';
import { useFonts } from 'expo-font';

const Topbar_2 = ({tittle}) => {
    var judul = tittle;
    return (    
        <View style={styles.container}>
            <LinearGradient colors={['#EB7802', '#DA421C']} style={styles.container}/>
            <View style={styles.left}>
                <Link href='/'>
                    <View>
                        <Image source={require('../../assets/nav/back.svg')} contentFit='fill' style={{width:55, height:55, borderRadius:30}}/>
                    </View>
                </Link>
            </View>
            <View style={styles.center}>
                <View style={{paddingLeft:10}}>
                    <Text style={{color:'#FFFFFF', fontWeight:'bold', fontSize:21, textShadowColor: '#000', textShadowOffset: { width: 2, height: 2 }, textShadowRadius: 3,}}>{judul}</Text>
                </View>
            </View>
        </View>
    )
}

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
    center: {
        position: 'absolute',
    },
});

export default Topbar_2;
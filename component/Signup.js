import { Pressable, StyleSheet, Text, View, TextInput } from 'react-native';
import { Image } from 'expo-image'
import { Link } from 'expo-router';
import Button from './Button';
import { LinearGradient } from 'expo-linear-gradient';
import { useFonts } from 'expo-font';
import { Outfit_400Regular, Outfit_700Bold } from '@expo-google-fonts/outfit';

const Signup = () => {
    let [fontsLoaded] = useFonts({
        Outfit_400Regular,
        Outfit_700Bold,
    });

    return (
        <View style={style.container}>
            <View style={style.banner}>
                <Image source={require('../assets/BikeRentbanner.svg')} contentFit='fill' style={{width:287, height:107}}/>
            </View>
            <View style={style.form}>
                {/* Button Sign In or Sign Up */}
                <View style={style.buttonSwitch}>
                    <LinearGradient colors={['#EA7604', '#DC4919']} style={style.buttonLinear}/>
                    <View style={{ flex: 1, flexDirection:'row', paddingHorizontal:8 }}>
                        <Pressable style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                            <Text style={{ fontWeight:'bold', color: '#FFFFFF', fontSize: 16}}>Sign In</Text>
                        </Pressable>
                        <Pressable style={{ flex: 1, justifyContent: 'center', alignItems: 'center' , backgroundColor: '#FFFFFF', height: 43, margin: 'auto', borderRadius: 6}}>
                            <Text style={{ fontWeight:'bold', color: '#000000', fontSize: 16}}>Sign Up</Text>
                        </Pressable>
                    </View>
                </View>
                <Text style={{ paddingLeft: 20, marginTop: 26, fontWeight:'bold' }}>Let's Sign Up</Text>
                <TextInput style={{ width: 297, height: 51, borderWidth: 1, borderRadius: 8, marginHorizontal: 'auto', marginTop: 16 , paddingHorizontal: 20, borderColor: '#C2C2C2'}} placeholder='Your Name'></TextInput>
                <TextInput style={{ width: 297, height: 51, borderWidth: 1, borderRadius: 8, marginHorizontal: 'auto', paddingHorizontal: 20, marginVertical: 10, borderColor: '#C2C2C2'}} placeholder='Enter Email'></TextInput>
                <TextInput style={{ width: 297, height: 51, borderWidth: 1, borderRadius: 8, marginHorizontal: 'auto', paddingHorizontal: 20, borderColor: '#C2C2C2'}} placeholder='Enter Password'></TextInput>
                <Button children={'Sign In'}/>
                <Text style={style.text}>Already have an account ? <Text style={{ fontWeight:'bold' }}>Sign In</Text></Text>
            </View>
        </View>
    );
};

export default Signup;

const style= StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFEBE4',
        
    },
    banner :{
        marginTop: 'auto',
        marginHorizontal: 'auto',
        marginBottom: 53
    },
    form : {
        width: 335,
        height: 425,
        backgroundColor:'#FFFFFF',
        borderRadius: 28,
        marginBottom: 'auto',
        marginHorizontal: 'auto',
        shadowColor: "#000",
        shadowOffset:{
            height: -20
        },
        shadowOpacity: 0.10,
        shadowRadius: 3.84,
        elevation: 5,
    },
    text:{
        marginHorizontal:'auto',
    }, 
    buttonSwitch : {
        marginTop: 20,
        marginHorizontal: 'auto',
        width: 297,
        height: 56,
        backgroundColor: '#EA7504',
        borderRadius: 8,
    }, 
    buttonLinear : {
        alignItems: 'center',
        justifyContent: 'center',
        position: 'absolute',
        width: 297,
        height: 56,
        top: 0,
        borderRadius: 8,
    }

});
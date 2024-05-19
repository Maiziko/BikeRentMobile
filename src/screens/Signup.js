import { Pressable, StyleSheet, Text, View, TextInput } from 'react-native';
import { Image } from 'expo-image'
import { Link } from 'expo-router';
import React, { useState } from 'react'
import Button from '../component/Button';
import { LinearGradient } from 'expo-linear-gradient';
import { useFonts } from 'expo-font';
import { Outfit_400Regular, Outfit_700Bold } from '@expo-google-fonts/outfit';
import { doc, setDoc } from 'firebase/firestore';
import { useNavigation } from '@react-navigation/native'
import { Toast } from 'react-native-toast-notifications';
import { firebaseAuth, firestore } from '../config/firebase'
import { createUserWithEmailAndPassword, sendEmailVerification } from 'firebase/auth';

const Signup = () => {
    let [fontsLoaded] = useFonts({
        Outfit_400Regular,
        Outfit_700Bold,
    });

    const navigation = useNavigation();
    const [isLoading, setIsLoading] = useState(false)
    const [inputs, setInputs] = useState({
        fullname : {value: '', isValid: true},
        email: {value: '', isValid: true},
        password: { value: '', isValid: true },
    })

    const handleRegister = async () => {

    // Object dataRegister yang datanya didapatkan dari state inputs
        const dataRegister = {
            fullname: inputs.fullname.value,
            email: inputs.email.value,
            password: inputs.password.value,
        };

        const emailIsValid = inputs.email.value.trim() !== "";
        const fullnameIsValid = inputs.fullname.value.trim() !== "";
        const passwordIsValid = inputs.password.value.trim() !== "";

        if (!emailIsValid || !passwordIsValid || !fullnameIsValid ) {
        setInputs((currentInputs) => ({
            email: { value: currentInputs.email.value, isValid: emailIsValid },
            fullname: { value: currentInputs.fullname.value, isValid: fullnameIsValid },
            password: { value: currentInputs.password.value, isValid: passwordIsValid },
        }));

        console.log(inputs);
        console.log(fullnameIsValid);
        console.log(emailIsValid);
        console.log(passwordIsValid);

        Toast.show("Check your input", {
            duration: 3000,
            placement: 'bottom',
            type: 'danger',
        });
        return;
    }

    // Jika semua input valid ubah state isLoading menjadi true
    setIsLoading(true);
    try {
        const success = await createUserWithEmailAndPassword(firebaseAuth, dataRegister.email, dataRegister.password);
        const userId = success.user.uid;

        await sendEmailVerification(firebaseAuth.currentUser)
        Toast.show("Email verifikasi terkirim", {
            duration: 3000,
            placement: 'bottom',
            type: 'success',
        });

        const docRef = {
            userId: userId,
            email: dataRegister.email,
            fullname: dataRegister.fullname,
        };

        await setDoc(doc(firestore, "users", userId), docRef);


        console.log("Register Success");

        Toast.show("Register success please login", {
            duration: 3000,
            placement: 'bottom',
            type: 'success',
        });
        navigation.replace('Home')
        } catch (error) {
        const errorMessage = error.message;
        Toast.show(errorMessage, {
        duration: 3000,
        placement: 'bottom',
        type: 'danger',
        });
    }
    };

    const inputChangeHandler = (inputIdentifier, enteredValue) => {
        setInputs((currentInputs) => {
            return {
                ...currentInputs,
                [inputIdentifier]: { value: enteredValue, isValid: true }
            }
        })
    }

    return (
        <View style={style.container}>
            <View style={style.banner}>
                <Image source={require('../../assets/BikeRentbanner.svg')} contentFit='fill' style={{width:287, height:107}}/>
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
                <TextInput style={{ width: 297, height: 51, borderWidth: 1, borderRadius: 8, marginHorizontal: 'auto', marginTop: 16 , paddingHorizontal: 20, borderColor: '#C2C2C2'}} placeholder='Enter Fullname' label={"Fullname"} invalid={!inputs.fullname.isValid} onChangeText = {inputChangeHandler.bind(this, 'fullname')}></TextInput>
                <TextInput style={{ width: 297, height: 51, borderWidth: 1, borderRadius: 8, marginHorizontal: 'auto', paddingHorizontal: 20, marginVertical: 10, borderColor: '#C2C2C2'}} placeholder='Enter Email' label={"Email"} invalid={!inputs.email.isValid} onChangeText= {inputChangeHandler.bind(this, 'email')}></TextInput>
                <TextInput style={{ width: 297, height: 51, borderWidth: 1, borderRadius: 8, marginHorizontal: 'auto', paddingHorizontal: 20, borderColor: '#C2C2C2'}} placeholder='Enter Password' label={"Password"} invalid={!inputs.password.isValid} onChangeText = {inputChangeHandler.bind(this, 'password')}></TextInput>
                <Button children={'Sign In'} onPress={handleRegister}/>
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
import { Pressable, StyleSheet, Text, View, TextInput } from 'react-native';
import { Image } from 'expo-image';
import React, { useState } from 'react';
import Button from '../component/Button';
import { LinearGradient } from 'expo-linear-gradient';
import { useFonts } from 'expo-font';
import { Outfit_400Regular, Outfit_700Bold } from '@expo-google-fonts/outfit';
import { useNavigation } from '@react-navigation/native';
import { Toast } from 'react-native-toast-notifications';
import { firebaseAuth } from '../config/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';

const SignIn = () => {
    let [fontsLoaded] = useFonts({
        Outfit_400Regular,
        Outfit_700Bold,
    });

    const navigation = useNavigation();
    const [isLoading, setIsLoading] = useState(false);
    const [inputs, setInputs] = useState({
        emailOrUsername: { value: '', isValid: true },
        password: { value: '', isValid: true },
    });

    const handleSignIn = async () => {
        const dataSignIn = {
            emailOrUsername: inputs.emailOrUsername.value,
            password: inputs.password.value,
        };

        const emailOrUsernameIsValid = dataSignIn.emailOrUsername.trim() !== "";
        const passwordIsValid = dataSignIn.password.trim() !== "";

        if (!emailOrUsernameIsValid || !passwordIsValid) {
            setInputs((currentInputs) => ({
                emailOrUsername: { value: currentInputs.emailOrUsername.value, isValid: emailOrUsernameIsValid },
                password: { value: currentInputs.password.value, isValid: passwordIsValid },
            }));

            Toast.show("Check your input", {
                duration: 3000,
                placement: 'bottom',
                type: 'danger',
            });
            return;
        }

        setIsLoading(true);
        try {
            // Assuming emailOrUsername contains email. In real application, you should resolve username to email.
            const userCredential = await signInWithEmailAndPassword(firebaseAuth, dataSignIn.emailOrUsername, dataSignIn.password);
            console.log("Sign In Success", userCredential.user);

            Toast.show("Sign In success", {
                duration: 3000,
                placement: 'bottom',
                type: 'success',
            });

            navigation.replace('Home');
        } catch (error) {
            const errorMessage = error.message;
            Toast.show(errorMessage, {
                duration: 3000,
                placement: 'bottom',
                type: 'danger',
            });
        } finally {
            setIsLoading(false);
        }
    };

    const inputChangeHandler = (inputIdentifier, enteredValue) => {
        setInputs((currentInputs) => {
            return {
                ...currentInputs,
                [inputIdentifier]: { value: enteredValue, isValid: true },
            };
        });
    };

    return (
        <View style={style.container}>
            <View style={style.banner}>
                <Image source={require('../../assets/BikeRentbanner.svg')} contentFit='fill' style={{ width: 287, height: 107 }} />
            </View>
            <View style={style.form}>
                {/* Button Sign In or Sign Up */}
                <View style={style.buttonSwitch}>
                    <LinearGradient colors={['#EA7604', '#DC4919']} style={style.buttonLinear} />
                    <View style={{ flex: 1, flexDirection: 'row', paddingHorizontal: 8 }}>
                        <Pressable style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#FFFFFF', height: 43, margin: 'auto', borderRadius: 6 }}>
                            <Text style={{ fontWeight: 'bold', color: '#000000', fontSize: 16 }}>Sign In</Text>
                        </Pressable>
                        <Pressable style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }} onPress={() => navigation.navigate('Signup')}>
                            <Text style={{ fontWeight: 'bold', color: '#FFFFFF', fontSize: 16 }}>Sign Up</Text>
                        </Pressable>
                    </View>
                </View>
                <Text style={{ paddingLeft: 20, marginTop: 26, fontWeight: 'bold' }}>Sign In With Email</Text>
                <TextInput
                    style={{ width: 297, height: 51, borderWidth: 1, borderRadius: 8, marginHorizontal: 'auto', marginTop: 16, paddingHorizontal: 20, borderColor: '#C2C2C2' }}
                    placeholder='Username or Email'
                    label={"EmailOrUsername"}
                    invalid={!inputs.emailOrUsername.isValid}
                    onChangeText={inputChangeHandler.bind(this, 'emailOrUsername')}
                />
                <TextInput
                    style={{ width: 297, height: 51, borderWidth: 1, borderRadius: 8, marginHorizontal: 'auto', paddingHorizontal: 20, marginVertical: 10, borderColor: '#C2C2C2' }}
                    placeholder='Enter Password'
                    label={"Password"}
                    invalid={!inputs.password.isValid}
                    onChangeText={inputChangeHandler.bind(this, 'password')}
                    secureTextEntry
                />
                <Text style={style.forgotPassword} onPress={() => navigation.navigate('ForgotPassword')}>Forgot Password?</Text>
                <Button children={'Sign In'} onPress={handleSignIn} />
                <Text style={style.text}>Don't have an account? <Text style={{ fontWeight: 'bold' }} onPress={() => navigation.navigate('Signup')}>Create Account</Text></Text>
            </View>
        </View>
    );
};

export default SignIn;

const style = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFEBE4',
    },
    banner: {
        marginTop: 'auto',
        marginHorizontal: 'auto',
        marginBottom: 53,
    },
    form: {
        width: 335,
        height: 425,
        backgroundColor: '#FFFFFF',
        borderRadius: 28,
        marginBottom: 'auto',
        marginHorizontal: 'auto',
        shadowColor: "#000",
        shadowOffset: {
            height: -20,
        },
        shadowOpacity: 0.10,
        shadowRadius: 3.84,
        elevation: 5,
    },
    text: {
        marginHorizontal: 'auto',
    },
    forgotPassword: {
        alignSelf: 'flex-end',
        paddingRight: 20,
        marginBottom: 10,
        color: '#EA7604',
    },
    buttonSwitch: {
        marginTop: 20,
        marginHorizontal: 'auto',
        width: 297,
        height: 56,
        backgroundColor: '#EA7504',
        borderRadius: 8,
    },
    buttonLinear: {
        alignItems: 'center',
        justifyContent: 'center',
        position: 'absolute',
        width: 297,
        height: 56,
        top: 0,
        borderRadius: 8,
    }
});

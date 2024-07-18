import React, { useState, useContext } from 'react';
import { View, Text, TextInput,Keyboard, StyleSheet,Platform,TouchableWithoutFeedback,KeyboardAvoidingView} from 'react-native';
import { AuthContext } from '../store/auth-store';
import { getFirestore, doc, updateDoc } from "firebase/firestore";
import { Colors } from '../constants/styles';
import Button from "../components/ui/Button";
import { RobotoCondensed_400Regular, useFonts, RobotoCondensed_700Bold } from '@expo-google-fonts/roboto-condensed';
function UpdateProfile({ navigation }) {
    const authCtx = useContext(AuthContext);
    const db = getFirestore();

    let [fontsLoaded, fontError] = useFonts({
        RobotoCondensed_400Regular,
        RobotoCondensed_700Bold,
      });
    // State for form inputs
    const [name, setName] = useState("");
    const [weight, setWeight] = useState("");
    const [height, setHeight] = useState("");
    const [age, setAge] = useState("");

    async function updateUserData() {
        const userDocRef = doc(db, "users", authCtx.token);
        const updates = {};
    
        if (name.trim() !== "") updates.name = name;
        if (weight.trim() !== "") updates.weight = parseFloat(weight);
        if (height.trim() !== "") updates.height = parseFloat(height);
        if (age.trim() !== "") updates.age = parseInt(age, 10);
    
        if (Object.keys(updates).length === 0) {
            alert('No changes made.');
            navigation.goBack();
        }
    
        try {
            if(Object.keys(updates).length > 0){
            await updateDoc(userDocRef, updates);
            alert('Profile Updated Successfully!');
            navigation.goBack();
            }
        } catch (error) {
            console.error("Error updating document:", error);
            alert('Failed to update profile!');
        }
    }
    

    return (
        <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
        >
            <Text style={styles.text}>Name:</Text>
            <TextInput
                value={name}
                onChangeText={setName}
                style={styles.input}
            />
            <Text style={styles.text}>Weight (kg):</Text>
            <TextInput
                value={weight}
                onChangeText={setWeight}
                keyboardType='numeric'
                style={styles.input}
            />
            <Text style={styles.text}>Height (cm):</Text>
            <TextInput
                value={height}
                onChangeText={setHeight}
                keyboardType='numeric'
                style={styles.input}
            />
            <Text style={styles.text}>Age:</Text>
            <TextInput
                value={age}
                onChangeText={setAge}
                keyboardType='numeric'
                style={styles.input}
            />
            {/* <Button title="Update Profile" onPress={updateUserData} /> */}
            <Button style={styles.button}  onPress={updateUserData}>Update Profile</Button>
        </KeyboardAvoidingView>
    );
}

export default UpdateProfile;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        backgroundColor:Colors.primary800,
    },
    input: {
        width: '100%',
        padding: 10,
        marginVertical: 10,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius:10,
        backgroundColor:Colors.primary300,
        color:'white',
        fontFamily:'RobotoCondensed_400Regular'
    },
    text:{
        color:'white',
        fontSize:18,
        fontFamily:'RobotoCondensed_700Bold'
    },
    button:
    {
        marginBottom:10,
    }
});

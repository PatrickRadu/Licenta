import React, { useState, useContext } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import { AuthContext } from '../store/auth-store';
import { getFirestore, doc, updateDoc } from "firebase/firestore";

function UpdateProfile({ navigation }) {
    const authCtx = useContext(AuthContext);
    const db = getFirestore();

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
        <View style={styles.container}>
            <Text>Name:</Text>
            <TextInput
                value={name}
                onChangeText={setName}
                style={styles.input}
            />
            <Text>Weight (kg):</Text>
            <TextInput
                value={weight}
                onChangeText={setWeight}
                keyboardType='numeric'
                style={styles.input}
            />
            <Text>Height (cm):</Text>
            <TextInput
                value={height}
                onChangeText={setHeight}
                keyboardType='numeric'
                style={styles.input}
            />
            <Text>Age:</Text>
            <TextInput
                value={age}
                onChangeText={setAge}
                keyboardType='numeric'
                style={styles.input}
            />
            <Button title="Update Profile" onPress={updateUserData} />
        </View>
    );
}

export default UpdateProfile;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20
    },
    input: {
        width: '100%',
        padding: 10,
        marginVertical: 10,
        borderWidth: 1,
        borderColor: '#ccc'
    }
});

import React, { useState } from 'react';
import { View, Text, StyleSheet,TextInput,ScrollView, Alert } from 'react-native';
import Button from '../components/ui/Button';
import { Colors } from '../constants/styles';
import { RobotoCondensed_400Regular, useFonts, RobotoCondensed_700Bold } from '@expo-google-fonts/roboto-condensed';


function Objectives({ navigation }) {
    const [targetDistance, setTargetDistance] = useState('');
    const [targetTime, setTargetTime] = useState('');

    let [fontsLoaded, fontError] = useFonts({
        RobotoCondensed_400Regular,
        RobotoCondensed_700Bold,
    });

    function onStartAccRun() {
        navigation.navigate('AccelerometerRun', { targetDistance: parseFloat(targetDistance), targetTime: parseInt(targetTime, 10) * 60 });
    }

    function onSubmit() {
        if(targetTime.includes('.'))
            Alert.alert("Time should be an integer (ex: 1)");
        else{
        navigation.navigate('Run', {
            targetDistance: parseFloat(targetDistance),
            targetTime: parseInt(targetTime, 10) * 60
        });
    }
    }

    function onChangeHandler(text)
    {
        setTargetDistance(text.replace(',', '.'))
    }
    function onChangeHandler2(text)
    {
        setTargetTime(text.replace(',', '.'))
    }
    return (
        <View style={styles.container}>
            <Text style={styles.text}>Objectives</Text>
            <Text style={styles.labels}>Target Distance:</Text>
            <TextInput
                // label="Distance (km)"
                keyboardType="numeric"
                value={targetDistance}
                onChangeText={onChangeHandler}
                style={styles.input}
                // theme={{ colors: { text: 'white', primary: 'white', background: Colors.primary300 } }}
            />
            <Text style={styles.labels}>Target Time:</Text>
            <TextInput
                keyboardType="numeric"
                value={targetTime}
                onChangeText={onChangeHandler2}
                style={[styles.input]}
            />
            <Button style={styles.button} onPress={onSubmit}>Start GPS Run</Button>
            <Button style={styles.button} onPress={onStartAccRun}>Start Accelerometer Run</Button>
        </View>
    );
}

export default Objectives;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        padding: 20,
        backgroundColor: Colors.primary800,
    },
    input: {
        width: '100%',
        color:'white',
        padding: 10,
        marginVertical: 10,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 6, 
        backgroundColor: Colors.primary300,
        fontSize:20,
        fontFamily: 'RobotoCondensed_400Regular',
        overflow: 'hidden' 
    },
    textInput:{
        color:'white',
    },
    text: {
        color: 'white',
        fontSize: 30,
        fontFamily: 'RobotoCondensed_700Bold',
        marginBottom: 20,
        // borderBottomWidth:2,
        // borderBottomColor:"white"
    },
    button: {
        marginVertical: 10,
    },
    inputText: {
        fontSize: 18,
        color: 'white',
        fontFamily: 'RobotoCondensed_400Regular',
    },
    labels:{
        color: '#069425',
        fontSize: 20,
        fontFamily: 'RobotoCondensed_700Bold',
    }
});

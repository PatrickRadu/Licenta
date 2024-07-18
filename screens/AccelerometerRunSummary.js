import React, { useContext } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Button from '../components/ui/Button';
import { formatTime } from '../util/utilfunctions';
import { getFirestore, collection, addDoc } from 'firebase/firestore';
import { AuthContext } from '../store/auth-store';
import { UserContext } from '../store/userdata-store';

import { RobotoCondensed_400Regular, RobotoCondensed_700Bold, useFonts } from '@expo-google-fonts/roboto-condensed';

function AccelerometerRunSummary({ route, navigation }) {
  const { timeElapsed, steps, distance, targetTime, targetDistance, achieved } = route.params;
  const averageSpeed = distance / (timeElapsed / 3600);
  const authToken = useContext(AuthContext);
  const userContext = useContext(UserContext);

  const caloriesBurned = distance * userContext.weight * 0.9;
  
  let [fontsLoaded, fontError] = useFonts({
    RobotoCondensed_400Regular,
    RobotoCondensed_700Bold,
  });

  async function saveData() {
    const db = getFirestore();
    const runData = {
      timeElapsed: timeElapsed,
      steps: steps,
      distance: distance,
      targetTime: targetTime,
      targetDistance: targetDistance,
      achieved: achieved,
      averageSpeed: averageSpeed,
      caloriesBurned: caloriesBurned,
      timestamp: new Date()
    };
    try {
      const addDocRef = await addDoc(collection(db, 'users', authToken.token, 'accelerometerRuns'), runData);
      console.log('Document written with ID: ', addDocRef.id);
    } catch (error) {
      console.log('Error adding document: ', error);
    }
  }

  function onSave() {
    saveData();
    navigation.navigate('History');
  }

  if (!fontsLoaded) {
    return <View><Text>Loading...</Text></View>;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Run Summary</Text>
      <View style={styles.columnContainer}>
      <Text style={[styles.congratulationText,!achieved && {color:'red'}]}>{achieved ? 'Goal Achieved' : 'Goal Not Achieved'}</Text>
        <Text style={styles.text}>Time: {formatTime(timeElapsed*1000)}</Text>
        <Text style={styles.text}>Steps: {steps}</Text>
        <Text style={styles.text}>Distance: {distance.toFixed(3)} km</Text>
        <Text style={styles.text}>Target Time: {formatTime(targetTime)}</Text>
        <Text style={styles.text}>Target Distance: {targetDistance.toFixed(3)} km</Text>
       
        <Text style={styles.text}>Average Speed: {averageSpeed.toFixed(2)} km/h</Text>
        <Text style={styles.text}>Calories Burned: {caloriesBurned.toFixed(2)} cal</Text>
      </View>
      <Button onPress={onSave}>Save</Button>
      <Button onPress={() => navigation.navigate('History')}>Delete Run</Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#0F0F0F',
  },
  columnContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 10,
    width: '100%',
  },
  text: {
    fontSize: 24,
    fontFamily: 'RobotoCondensed_400Regular',
    color: 'white',
    textAlign: 'center',
    marginVertical: 8,
  },
  title: {
    fontSize: 40,
    color: 'white',
    marginBottom: 20,
    textAlign: 'center',
    marginTop: 20,
    fontFamily: 'RobotoCondensed_700Bold',
  },
  congratulationText: {
    fontSize: 30,
    color: 'green',
    fontFamily: 'RobotoCondensed_700Bold',
  },
});

export default AccelerometerRunSummary;

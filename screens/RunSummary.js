import React, { useContext } from 'react';
import { View, Text, StyleSheet } from "react-native";
import MapView, { Polyline } from "react-native-maps";
import Button from "../components/ui/Button";
import { formatTime } from "../util/utilfunctions";
import { AuthContext } from '../store/auth-store';
import { getFirestore, collection, addDoc } from 'firebase/firestore';
import { UserContext } from '../store/userdata-store';
import { useLayoutEffect } from 'react';

import { RobotoCondensed_400Regular, useFonts, RobotoCondensed_700Bold } from '@expo-google-fonts/roboto-condensed';

function RunSummary({ navigation, route }) {
  const { routes, timeElapsed, totalDistance, achieved, targetDistance, targetTime, achieving } = route.params;
  const authToken = useContext(AuthContext);
  const userContext = useContext(UserContext);
  const averageSpeed = totalDistance / (timeElapsed / 3600000);
  
  const caloriesBurned = totalDistance * userContext.weight * 0.9;
  let [fontsLoaded, fontError] = useFonts({
    RobotoCondensed_400Regular,
    RobotoCondensed_700Bold,
  });

  const initialRegion = routes.length > 0 ? {
    latitude: routes[0].latitude,
    longitude: routes[0].longitude,
    latitudeDelta: 0.0422,
    longitudeDelta: 0.0421,
  } : null;

  async function saveData() {
    const db = getFirestore();
    const rundData = {
      totalDistance: totalDistance,
      timeElapsed: timeElapsed,
      averageSpeed: averageSpeed,
      caloriesBurned: caloriesBurned,
      routes: routes,
      achieved: achieved && achieving,
      targetDistance: targetDistance,
      targetTime: targetTime,
      timestamp: new Date()
    }
    try {
      const addDocRef = await addDoc(collection(db, "users", authToken.token, "gpsRuns"), rundData);
      console.log("Document written with ID: ", addDocRef.id);
    } catch (error) {
      console.log("Error adding document: ", error);
    }
  }

  function onPressHandler() {
    saveData();
    navigation.navigate("History");
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Run Summary</Text>
      <View style={styles.row}>
        <Text style={styles.text}>Total Distance: {totalDistance.toFixed(2)} km</Text>
        {targetDistance > 0 && <Text style={styles.text}>Target Distance: {targetDistance} km</Text>}
      </View>
      <View style={styles.row}>
        <Text style={styles.text}>Time Elapsed: {formatTime(timeElapsed)}</Text>
        {targetTime > 0 && <Text style={styles.text}>Target Time: {formatTime(targetTime)}</Text>}
      </View>
      {achieved && achieving && <Text style={styles.congratsText}>Congratulations! Target Achieved!</Text>}
      {!achieved && <Text style={styles.failedText}>Goal Not Achieved</Text>}
      <View style={styles.columnContainer}>
        <Text style={styles.text}>Average Speed: {averageSpeed.toFixed(2)} km/h</Text>
        <Text style={styles.text}>Calories Burned: {caloriesBurned.toFixed(2)} cal</Text>
      </View>
      <View style={styles.mapContainer}>
        {initialRegion && (
          <MapView
            style={styles.map}
            initialRegion={initialRegion}
          >
            <Polyline
              coordinates={routes.map(({ latitude, longitude }) => ({ latitude, longitude }))}
              strokeColor="red"
              strokeWidth={3}
            />
          </MapView>
        )}
      </View>
      <View style={styles.buttonRow}>
        <Button onPress={onPressHandler}>Save Run</Button>
        <Button onPress={() => navigation.navigate("Home")}>Delete Run</Button>
      </View>
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
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginVertical: 5,
  },
  columnContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 10,
  },
  text: {
    fontSize: 16,
    fontFamily: 'RobotoCondensed_400Regular',
    color: 'white',
    marginHorizontal: 10,
    marginVertical: 5,
  },
  congratsText: {
    fontSize: 18,
    color: 'limegreen',
    marginVertical: 10,
    fontFamily: 'RobotoCondensed_700Bold',
  },
  failedText: {
    fontSize: 18,
    color: 'red',
    marginVertical: 10,
    fontFamily: 'RobotoCondensed_700Bold',
  },
  mapContainer: {
    width: '100%',
    height: 350,
    marginVertical: 10,
    borderRadius: 15,
    borderColor: '#000',
    borderWidth: 2,
    overflow: 'hidden',
    shadowColor: 'white',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 3,
  },
  map: {
    width: '100%',
    height: '100%',
    borderRadius: 10,
  },
  title: {
    fontSize: 28,
    color: 'white',
    marginBottom: 20,
    textAlign: 'center',
    marginTop: 20,
    fontFamily: 'RobotoCondensed_700Bold',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '80%',
    marginTop: 20,
  },
});

export default RunSummary;

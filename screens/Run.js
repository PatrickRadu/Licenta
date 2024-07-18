import React, { useEffect, useLayoutEffect, useState } from 'react';
import { View, Text, Alert, StyleSheet } from "react-native";
import Button from "../components/ui/Button";
import { formatTime, getDistance } from "../util/utilfunctions";
import * as Location from "expo-location";
import { useFonts, RobotoCondensed_400Regular, RobotoCondensed_700Bold } from '@expo-google-fonts/roboto-condensed';

function Run({ navigation,route }) {


  const [secondsElapsed, setSecondsElapsed] = useState(0);
  const [timerActive, setTimerActive] = useState(false);
  const [routes, setRoutes] = useState([]);
  const [totalDistance, setTotalDistance] = useState(0);
  const [currentSpeed, setCurrentSpeed] = useState(0); 
  const[achieved,setAchieved]=useState(false);
  const[achieving,setAchieving]=useState(true);

  const targetDistance = route.params?.targetDistance || 0;
  const targetTime = route.params?.targetTime * 1000 || 0;
  const targetAvgSpeed = targetDistance / (targetTime / 3600000);

  let [fontsLoaded] = useFonts({
    RobotoCondensed_400Regular,
    RobotoCondensed_700Bold,
  });

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'Permission to access location was denied');
        return;
      }
    })();
  }, []);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: !timerActive,
    });
  }, [navigation, timerActive]);

  useEffect(() => {
    let interval;
    let locationSubscription;
    if (timerActive) {
      interval = setInterval(() => {
        setSecondsElapsed(prev => prev + 1);
      }, 1000);
      locationSubscription = Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.BestForNavigation,
          timeInterval: 1000,
          distanceInterval: 0
        },
        (locationUpdate) => {
          const newCoords = locationUpdate.coords;
          setRoutes(currentRoutes => {
            if (currentRoutes.length > 0) {
              const lastCoords = currentRoutes[currentRoutes.length - 1];
              const distanceIncrement = getDistance(
                lastCoords.latitude, lastCoords.longitude,
                newCoords.latitude, newCoords.longitude
              );
              const speed = distanceIncrement * 3600; 
              setCurrentSpeed(speed); 
              setTotalDistance(prevDistance => prevDistance + distanceIncrement);
            }
            return [...currentRoutes, newCoords];
          });
        }
      );
    } 
    else {
      if (locationSubscription) {
        locationSubscription.then(subscription => subscription.remove());
      }
    }
    return () => {
      clearInterval(interval);
      if (locationSubscription) {
        locationSubscription.then(subscription => subscription.remove());
      }
    };
  }, [timerActive]);

  useEffect(() => {
    if (targetTime > 0 && targetDistance > 0) {
      if (secondsElapsed * 1000 <= targetTime && totalDistance >= targetDistance) {
       
        setAchieved(true);
      }
    } else if (targetTime > 0) {
      if (secondsElapsed * 1000 >= targetTime) {
      
        setAchieved(true);
      }
    } else if (targetDistance > 0) {
      if (parseFloat(totalDistance) >= parseFloat(targetDistance)) {
        setAchieved(true);
      }
    } else {

      setAchieved(true);
    }
  }, [secondsElapsed, totalDistance]);
  
  
  
 
 
  useEffect(() => {
    const averageSpeedSoFar = (totalDistance / (secondsElapsed / 3600));

    if (achieved) {
      setAchieving(true);
    } else if (averageSpeedSoFar >= targetAvgSpeed && targetTime > 0 && targetDistance > 0) {
      setAchieving(true);
    } else if (averageSpeedSoFar < targetAvgSpeed && targetTime > 0 && targetDistance > 0) {
      setAchieving(false);
    }
    else
    {
      setAchieving(achieved)
    }
    if (secondsElapsed * 1000 > targetTime && !achieved) {
      setAchieving(false);
    }
  }, [totalDistance, secondsElapsed]);

  function onStartHandler() {
    setTimerActive(true);
    setRoutes([]); 
    setTotalDistance(0);
    setCurrentSpeed(0); 
  }

  function onPressEndHandler() {
    setTimerActive(false);
    navigation.navigate("Summary", { routes, timeElapsed: secondsElapsed * 1000, totalDistance,achieved,targetDistance,targetTime,achieving });
  }
 
  return (
    <View style={[styles.container, { backgroundColor: achieving ? "green" : "red" }]}>
      <View style={styles.timerContainer}>
      <Text style={styles.timerText}>
        {formatTime(secondsElapsed * 1000)}
      </Text>
      </View>
      <View style={styles.infoContainer}>
      <Text style={styles.infoText}>
        Distance: {totalDistance.toFixed(2)} km
      </Text>
      <Text style={styles.infoText}>
        Current Speed: {currentSpeed.toFixed(2)} km/h
      </Text>
       {/* <Text style={styles.infoText}>You are {achieved? "Good" : "Not Good"}</Text> */}
       {achieved && <Text style={styles.infoText}> You achieved your Goal!</Text>}
      {!timerActive && <Button onPress={onStartHandler}>Start Run</Button>}
      {timerActive && <Button onPress={onPressEndHandler}>End Run</Button>}
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  container:
  {
    flex: 1,
    justifyContent: 'center', 
    alignItems: 'center',
  },
  timerContainer:
  {
    borderColor: "white",
    borderWidth: 4,
    borderRadius: 150,
    width: 250,
    height: 250,
    justifyContent: 'center',
    alignItems: 'center',
  },
  timerText:
  {
    fontSize: 60,
    color: "white",
    fontWeight: 'bold',
    fontFamily:"RobotoCondensed_700Bold"
  },
  infoContainer:
  {
    marginTop:30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonContainer:
  {
    marginBottom: 100,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  infoText:
  {
    fontSize:24,
    color:"white",
    fontFamily:"RobotoCondensed_400Regular"
  }
})

export default Run;

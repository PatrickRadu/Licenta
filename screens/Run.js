import React, { useEffect, useState } from 'react';
import { View, Text, Alert, StyleSheet } from "react-native";
import Button from "../components/ui/Button";
import { formatTime, getDistance } from "../util/utilfunctions";
import * as Location from "expo-location";

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

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'Permission to access location was denied');
        return;
      }
    })();
  }, []);

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
    if(secondsElapsed*1000>=targetTime && totalDistance>=targetDistance && (targetTime>0 || targetDistance>0)){
      setAchieved(true);
    }

  },[secondsElapsed,totalDistance]);

  useEffect(() => {
    const averageSpeedSoFar = (totalDistance / (secondsElapsed / 3600)); 
    if (averageSpeedSoFar >= targetAvgSpeed && (targetTime > 0 && targetDistance > 0) && (targetTime>=secondsElapsed*1000 && targetDistance>=totalDistance) ) {
      setAchieving(true);
    } else if (targetTime>=secondsElapsed*1000 && targetDistance>=totalDistance && (targetTime > 0 && targetDistance > 0))  {
      setAchieving(false);
    }
  }, [totalDistance, secondsElapsed, targetAvgSpeed]);

  function onStartHandler() {
    setTimerActive(true);
    setRoutes([]); // Reset the route and distance when starting a new run
    setTotalDistance(0);
    setCurrentSpeed(0); // Reset speed when starting a new run
  }

  function onPressEndHandler() {
    setTimerActive(false);
    navigation.navigate("Summary", { routes, timeElapsed: secondsElapsed * 1000, totalDistance,achieved,targetDistance,targetTime,achieving });
  }
 
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center',backgroundColor:achieving? "green" : "red" }}>
      <Button onPress={onStartHandler}>Start Run</Button>
      <Button onPress={onPressEndHandler}>End Run</Button>
      <Text style={{ fontSize: 24, marginTop: 20 }}>
        Time: {formatTime(secondsElapsed * 1000)}
      </Text>
      <Text style={{ fontSize: 20 }}>
        Distance: {totalDistance.toFixed(2)} km
      </Text>
      <Text style={{ fontSize: 20 }}>
        Current Speed: {currentSpeed.toFixed(2)} km/h
      </Text>
      <Text>You are {achieving? "Good" : "Not Good"}</Text>
    </View>
  );
}

export default Run;

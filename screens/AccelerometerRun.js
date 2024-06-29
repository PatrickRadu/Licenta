import React, { useState, useEffect } from 'react';
import { View, Text, Alert } from 'react-native';
import Button from '../components/ui/Button';
import { Pedometer } from 'expo-sensors';
import { formatTime } from '../util/utilfunctions';

function AccelerometerRun({ navigation,route }) {
  const [secondsElapsed, setSecondsElapsed] = useState(0);
  const [timerActive, setTimerActive] = useState(false);
  const [steps, setSteps] = useState(0);
  const [distance, setDistance] = useState(0); // Distance traveled in km
  const [pedometerAvailable, setPedometerAvailable] = useState(false);
  const[achieved,setAchieved]=useState(false);
  const targetDistance = route.params?.targetDistance || 0;
  const targetTime = route.params?.targetTime * 1000 || 0;


  const STEP_LENGTH_KM = 0.000762; // Average step length in kilometers

  useEffect(() => {
    (async () => {
      const result = await Pedometer.isAvailableAsync();
      setPedometerAvailable(result);
    })().catch((error) => {
      console.log(error);
      setPedometerAvailable(false);
    });
  }, []);

  useEffect(() => {
    let interval;
    let pedometerSubscription;

    if (timerActive) {
      interval = setInterval(() => {
        setSecondsElapsed((prev) => prev + 1);
      }, 1000);

      pedometerSubscription = Pedometer.watchStepCount((result) => {
        setSteps(result.steps);
        setDistance(result.steps * STEP_LENGTH_KM); 
        
      });
    } else {
      clearInterval(interval);
      if (pedometerSubscription) {
        pedometerSubscription.remove();
      }
    }

    return () => {
      clearInterval(interval);
      if (pedometerSubscription) {
        pedometerSubscription.remove();
      }
    };
  }, [timerActive]);

  function onStartRun() {
    setTimerActive(true);
    setSecondsElapsed(0); // Reset the timer
    setSteps(0); // Reset the step count
    setDistance(0); // Reset the distance
  }
  useEffect(() => {
    if(secondsElapsed*1000>=targetTime && distance>=targetDistance && (targetTime>0 || targetDistance>0)){
      setAchieved(true);
    }

  },[secondsElapsed,distance]);

  function onEndRun() {
    setTimerActive(false);
    navigation.navigate('AccelerometerRunSummary', {
      timeElapsed: secondsElapsed,
      steps,
      distance,
      targetTime,
      targetDistance,
      achieved,
    });
}
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Button onPress={onStartRun}>Start Run</Button>
      <Button onPress={onEndRun}>Stop Run</Button>
      <Text style={{ fontSize: 24, marginTop: 20 }}>
        Time: {formatTime(secondsElapsed * 1000)}
      </Text>
      <Text style={{ fontSize: 20 }}>
        Steps: {steps}
      </Text>
      <Text style={{ fontSize: 20 }}>
        Distance: {distance.toFixed(3)} km
      </Text>
      {achieved&& <Text>Goal Achived</Text>}
      {pedometerAvailable === false && (
        <Text style={{ color: 'red' }}>Pedometer is not available on this device</Text>
      )}
    </View>
  );
}

export default AccelerometerRun;

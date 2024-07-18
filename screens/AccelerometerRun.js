import React, { useState, useEffect, useLayoutEffect } from 'react';
import { View, Text, Alert,StyleSheet } from 'react-native';
import Button from '../components/ui/Button';
import { Pedometer } from 'expo-sensors';
import { formatTime } from '../util/utilfunctions';

function AccelerometerRun({ navigation,route }) {
  const [secondsElapsed, setSecondsElapsed] = useState(0);
  const [timerActive, setTimerActive] = useState(false);
  const [steps, setSteps] = useState(0);
  const [distance, setDistance] = useState(0);
  const [pedometerAvailable, setPedometerAvailable] = useState(false);
  const[achieved,setAchieved]=useState(false);
  const targetDistance = route.params?.targetDistance || 0;
  const targetTime = route.params?.targetTime * 1000 || 0;
  const targetAvgSpeed=targetDistance/(targetTime/3600000);
  const STEP_LENGTH_KM = 0.000762;
  const[achieving,setAchieving]=useState(true);
  useEffect(() => {
    (async () => {
      const result = await Pedometer.isAvailableAsync();
      setPedometerAvailable(result);
    })().catch((error) => {
      console.log(error);
      setPedometerAvailable(false);
    });
  }, []);

  // useLayoutEffect(() => {
  //   navigation.setOptions({
  //     headerShown: !timerActive,
  //   });
  // }, [navigation, timerActive]);

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
    setSecondsElapsed(0);
    setSteps(0);
    setDistance(0); 
  }
  useEffect(() => {
    if (targetTime > 0 && targetDistance > 0) {
      if (secondsElapsed * 1000 <= targetTime && distance >= targetDistance) {
       
        setAchieved(true);
      }
    } else if (targetTime > 0) {
      if (secondsElapsed * 1000 >= targetTime) {
      
        setAchieved(true);
      }
    } else if (targetDistance > 0) {
      if (parseFloat(distance) >= parseFloat(targetDistance)) {
        setAchieved(true);
      }
    } else {

      setAchieved(true);
    }
  }, [secondsElapsed, distance]);
  
  
  
 
 
  useEffect(() => {
    const averageSpeedSoFar = (distance / (secondsElapsed / 3600));

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
  }, [distance, secondsElapsed]);

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
  <View style={[styles.container, { backgroundColor: achieving ? "green" : "red" }]}>
    <View style={styles.timerContainer}>
      <Text style={styles.timerText}>
        {formatTime(secondsElapsed * 1000)}
      </Text>
    </View>
    <View style={styles.infoContainer}>
      <Text style={styles.infoText}>
        Steps: {steps}
      </Text>
      <Text style={styles.infoText}>
        Distance: {distance.toFixed(3)} km
      </Text>
      
      {achieved && <Text style={styles.infoText}>You achieved your target!</Text>}
      {!timerActive && pedometerAvailable && <Button onPress={onStartRun}>Start Run</Button>}
      {timerActive && pedometerAvailable &&<Button onPress={onEndRun}>End Run</Button>}
      {pedometerAvailable === false && (
        <Text style={styles.errorText}>Pedometer is not available on this device</Text>
      )}
    </View>
  </View>
);
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  timerContainer: {
    borderColor: "white",
    borderWidth: 4,
    borderRadius: 150,
    width: 250,
    height: 250,
    justifyContent: 'center',
    alignItems: 'center',
  },
  timerText: {
    fontSize: 60,
    color: "white",
    fontWeight: 'bold',
    fontFamily: "RobotoCondensed_700Bold"
  },
  infoContainer: {
    marginTop: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonContainer: {
    marginBottom: 100,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  infoText: {
    fontSize: 24,
    color: "white",
    fontFamily: "RobotoCondensed_400Regular"
  },
  errorText: {
    color: 'White',
    fontSize: 20,
    fontFamily: "RobotoCondensed_400Regular"
  }
});

export default AccelerometerRun;
import React, { useContext } from 'react';
import { View, Text, StyleSheet, Alert, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { getFirestore, doc, deleteDoc } from 'firebase/firestore';
import Button from '../components/ui/Button';
import { AuthContext } from '../store/auth-store';
import { formatTime } from '../util/utilfunctions';
import { Colors } from '../constants/styles';

function AccDetails({ route }) {
  const { run } = route.params;
  const authCtx = useContext(AuthContext);
  const navigation = useNavigation();
  const db = getFirestore();

  // Formatting timestamp into a readable date and time
  const date = new Date(run.timestamp.seconds * 1000);
  const formattedDate = date.toLocaleDateString("en-US");
  const formattedTime = date.toLocaleTimeString("en-US");

  async function onDeleteHandler() {
    try {
      await deleteDoc(doc(db, "users", authCtx.token, "accelerometerRuns", run.id));
      Alert.alert("Success", "Run deleted successfully");
      navigation.navigate('History');
    } catch (error) {
      console.error("Error deleting document: ", error);
      Alert.alert("Error", "Could not delete the run");
    }
  }

  return (
      <View style={styles.container}>
        <View style={styles.row}>
          <Text style={styles.text}>Date: {formattedDate}</Text>
          <Text style={styles.text}>Time: {formattedTime}</Text>
        </View>
        <View>
          <Text style={styles.text}>Time Elapsed: {formatTime(run.timeElapsed * 1000)} </Text>
          <Text style={styles.text}>Target Distance: {run.targetDistance.toFixed(2)} km</Text>
          <Text style={styles.text}>Steps: {run.steps}</Text>
          <Text style={styles.text}>Distance: {run.distance.toFixed(2)} km</Text>
          <Text style={styles.text}>Average Speed: {run.averageSpeed.toFixed(2)} km/h</Text>
        <Text style={styles.text}>Target Time: {formatTime(run.targetTime * 1000)}</Text>
        <Text style={styles.text}>Calories Burned: {run.caloriesBurned}</Text>
        </View>
        <Text style={[
          styles.text,
          { color: run.achieved ? 'limegreen' : 'red',
            fontSize:25,
           }
        ]}>Goal Achieved: {run.achieved ? 'Yes' : 'No'}</Text>
        <View style={styles.buttonRow}>
          <Button onPress={onDeleteHandler}>Delete Run</Button>
        </View>
      </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    // justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0F0F0F',
  },
  text: {
    fontSize: 20,
    fontFamily: 'RobotoCondensed_400Regular',
    color: 'white',
    marginHorizontal: 10,
    marginVertical: 10,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    width: '80%',
    marginVertical: 20,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginVertical: 10,
  },
});

export default AccDetails;

import React, { useContext } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { getFirestore, doc, deleteDoc } from 'firebase/firestore';
import Button from '../components/ui/Button';
import { AuthContext } from '../store/auth-store';
import { formatTime } from '../util/utilfunctions';

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
      <Text style={styles.header}>Accelerometer Run Details</Text>
      <Text style={styles.detail}>Date: {formattedDate}</Text>
      <Text style={styles.detail}>Time: {formattedTime}</Text>
      <Text style={styles.detail}>Steps: {run.steps}</Text>
      <Text style={styles.detail}>Distance: {run.distance.toFixed(2)} km</Text>
      <Text style={styles.detail}>Time Elapsed: {formatTime(run.timeElapsed * 1000)}</Text>
      <Text style={styles.detail}>Average Speed: {run.averageSpeed.toFixed(2)} km/h</Text>
      <Text style={styles.detail}>Target Distance: {run.targetDistance.toFixed(2)} km</Text>
      <Text style={styles.detail}>Target Time: {formatTime(run.targetTime * 1000)}</Text>
      <Text style={styles.detail}>Goal Achieved: {run.achieved ? 'Yes' : 'No'}</Text>
      <Text style={styles.detail}> Calories:{run.caloriesBurned}</Text>
      <Button onPress={onDeleteHandler}  > Delete Run </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  },
  header: {
    fontSize: 24,
    marginBottom: 16,
    fontWeight: 'bold',
  },
  detail: {
    fontSize: 18,
    marginBottom: 8,
  }
});

export default AccDetails;

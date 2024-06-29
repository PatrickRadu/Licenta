import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import MapView, { Polyline } from 'react-native-maps';
import { formatTime } from '../util/utilfunctions';
import { getFirestore, doc, deleteDoc } from 'firebase/firestore';
import Button from '../components/ui/Button';
import { useContext } from 'react';
import { AuthContext } from '../store/auth-store';
function GpsRunDetail({ route, navigation}) {
    const authCtx=useContext(AuthContext);
  const { run } = route.params;

  // Formatting timestamp into a readable date and time
  const date = new Date(run.timestamp.seconds * 1000);
  const formattedDate = date.toLocaleDateString("en-US");
  const formattedTime = date.toLocaleTimeString("en-US");

  // Initial region based on the first coordinate in the route
  const initialRegion = run.routes.length > 0 ? {
    latitude: run.routes[0].latitude,
    longitude: run.routes[0].longitude,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421
  } : null;
  async function deleteRun() {
    const db = getFirestore();
    const runRef = doc(db, `users/${authCtx.token}/gpsRuns`, run.id); // Adjust path as necessary
    try {
      await deleteDoc(runRef);
      navigation.navigate("History") // Go back to previous screen or navigate as needed
      alert('Run deleted successfully');
    } catch (error) {
      alert(`Error removing run: ${error}`);
    }
  }
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Run Details</Text>
      <Text>ID: {run.id}</Text>
      <Text>Date: {formattedDate}</Text>
      <Text>Time: {formattedTime}</Text>
      <Text>Distance: {run.totalDistance.toFixed(2)} km</Text>
      <Text>Average Speed: {run.averageSpeed.toFixed(2)} km/h</Text>
      <Text>Goal Achieved: {run.achieved ? 'Yes' : 'No'}</Text>
      {initialRegion && (
        <MapView
          style={styles.map}
          initialRegion={initialRegion}
        >
          <Polyline
            coordinates={run.routes}
            strokeColor="#000" // black polyline
            strokeWidth={3}
          />
        </MapView>
      )}
      <Button onPress={deleteRun}> Delete the run</Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'flex-start', // Align text to the start of the view
  },
  header: {
    fontSize: 24,
    marginBottom: 10,
    fontWeight: 'bold',
  },
  map: {
    width: '100%',
    height: 300,
    marginTop: 20,
  }
});

export default GpsRunDetail;

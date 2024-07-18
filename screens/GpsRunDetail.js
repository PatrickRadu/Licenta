import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import MapView, { Polyline } from 'react-native-maps';
import { formatTime } from '../util/utilfunctions';
import { getFirestore, doc, deleteDoc } from 'firebase/firestore';
import Button from '../components/ui/Button';
import { useContext } from 'react';
import { AuthContext } from '../store/auth-store';
import { Colors } from '../constants/styles';
import { useFonts, RobotoCondensed_400Regular, RobotoCondensed_700Bold } from '@expo-google-fonts/roboto-condensed';
function GpsRunDetail({ route, navigation}) {
  const authCtx=useContext(AuthContext);
  const { run } = route.params;

  const date = new Date(run.timestamp.seconds * 1000);
  const formattedDate = date.toLocaleDateString("en-US");
  const formattedTime = date.toLocaleTimeString("en-US");
  
  let [fontsLoaded] = useFonts({
    RobotoCondensed_400Regular,
    RobotoCondensed_700Bold,
  });
  const initialRegion = run.routes.length > 0 ? {
    latitude: run.routes[0].latitude,
    longitude: run.routes[0].longitude,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421
  } : null;
  async function deleteRun() {
    const db = getFirestore();
    const runRef = doc(db, `users/${authCtx.token}/gpsRuns`, run.id); 
    try {
      await deleteDoc(runRef);
      navigation.navigate("History") 
      alert('Run deleted successfully');
    } catch (error) {
      alert(`Error removing run: ${error}`);
    }
  }
    return (
      <ScrollView>
      <View style={styles.container}>
        <View style={styles.row}>
        <Text style={styles.text}>Date: {formattedDate}</Text>
        <Text style={styles.text}>Time: {formattedTime}</Text>
        </View>
        <View>
        <Text style={styles.text}>Running Time: {formatTime(run.timeElapsed)}</Text>
        <Text style={styles.text}>Target Time: {formatTime(run.targetTime)} </Text>
        <Text style={styles.text}>Distance: {run.totalDistance.toFixed(2)} km</Text>
        <Text style={styles.text}>Target Distance: {run.targetDistance.toFixed(2)} km</Text>
        <Text style={styles.text}>Average Speed: {run.averageSpeed.toFixed(2)} km/h</Text>
        <Text style={styles.text}>Calories Burned: {run.caloriesBurned.toFixed(2)}</Text>
        </View>
        <Text style={[
          styles.text,
          { color: run.achieved ? 'limegreen' : 'red' }
        ]}>Goal Achieved: {run.achieved ? 'Yes' : 'No'}</Text>
        {initialRegion && (
          <View style={styles.mapContainer}>
          <MapView
            style={styles.map}
            initialRegion={initialRegion}
          >
            <Polyline
              coordinates={run.routes}
              strokeColor="#000" 
              strokeWidth={3}
            />
          </MapView>
          </View>
        )}
        <View style={styles.buttonRow}>
          <Button onPress={deleteRun}>Delete Run</Button>
        </View>
      </View>
      </ScrollView>
    );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0F0F0F',
  },
  title: {
    fontSize: 28,
    color: 'white',
    marginBottom: 20,
    textAlign: 'center',
    marginTop: 20,
    fontFamily: 'RobotoCondensed_700Bold',
  },
  text: {
    fontSize: 20,
    fontFamily: 'RobotoCondensed_400Regular',
    color: 'white',
    marginHorizontal: 10,
    marginVertical: 10,
    
  },
  map: {
    width: '100%',
    height: '100%',
    borderRadius: 10,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    width: '80%',
    marginVertical:20,
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
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginVertical: 10,
  },
});

export default GpsRunDetail;

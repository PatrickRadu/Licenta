import React, { useContext, useEffect, useState } from 'react';
import { View, Text,StyleSheet } from 'react-native';
import Button from '../components/ui/Button';
import { getFirestore, query, collection, onSnapshot, orderBy } from 'firebase/firestore';
import { AuthContext } from '../store/auth-store';
import GpsRunList from '../components/Run/gpsRunList';
import AccRunList from '../components/Run/accRunList'; // Make sure this is imported
import { Colors } from '../constants/styles';
function RunHistoryScreen({ navigation }) {
  const authCtx = useContext(AuthContext);
  const [runs, setRuns] = useState([]);
  const [accRuns, setAccRuns] = useState([]);
  const [isAccRuns, setIsAccRuns] = useState(false);

  useEffect(() => {
    const db = getFirestore();
    // Fetch GPS runs
    const qGps = query(collection(db, `users/${authCtx.token}/gpsRuns`), orderBy('timestamp', 'desc'));
    const unsubscribeGps = onSnapshot(qGps, (querySnapshot) => {
      const runsData = [];
      querySnapshot.forEach((doc) => {
        runsData.push({ id: doc.id, ...doc.data() });
      });
      setRuns(runsData);
    });

    // Fetch ACC runs
    const qAcc = query(collection(db, `users/${authCtx.token}/accelerometerRuns`), orderBy('timestamp', 'desc'));
    const unsubscribeAcc = onSnapshot(qAcc, (querySnapshot) => {
      const accRunsData = [];
      querySnapshot.forEach((doc) => {
        accRunsData.push({ id: doc.id, ...doc.data() });
      });
      setAccRuns(accRunsData);
      console.log('ACC Runs:', accRunsData); 
    });

    return () => {
      unsubscribeGps();
      unsubscribeAcc();
    };
  }, [authCtx.token]);

  function onPressHandler() {
    navigation.navigate('Objectives');
  }

  function onPressHandler2() {
    setIsAccRuns(true);
  }

  function onPressHandler3() {
    setIsAccRuns(false);
  }

  return (
    <View style={styles.container}>
      <Button onPress={onPressHandler} style={{backgroundColor:'#069425'}}>Start Run</Button>
      <View style={styles.buttonRow}>
        <Button onPress={onPressHandler2}> ACC List</Button>
        <Button onPress={onPressHandler3}> GPS List</Button>
      </View>
      <View style={styles.listContainer}>
        {isAccRuns ? <AccRunList runs={accRuns} /> : <GpsRunList runs={runs} />}
      </View>
    </View>
  );
}

export default RunHistoryScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal:12,
    backgroundColor: Colors.primary800,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginVertical: 16,
  },
  listContainer: {
    flex: 1,
    marginTop: 16,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: 'white',
    padding: 8,
    borderRadius: 12,
    paddingBottom:2,
  },
});
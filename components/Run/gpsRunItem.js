import React from 'react';
import { View, Text, StyleSheet, Pressable } from "react-native";
import { useNavigation } from '@react-navigation/native';
import { Colors } from '../../constants/styles';
import { RobotoCondensed_400Regular, useFonts, RobotoCondensed_700Bold } from '@expo-google-fonts/roboto-condensed';

function GpsRunItem({ run }) {
  let [fontsLoaded, fontError] = useFonts({
    RobotoCondensed_400Regular,
    RobotoCondensed_700Bold,
  });

  const navigation = useNavigation();
  const formattedDate = new Date(run.timestamp.seconds * 1000).toLocaleDateString("en-US");
  const formattedTime = new Date(run.timestamp.seconds * 1000).toLocaleTimeString("en-US");

  function onPress() {
    navigation.navigate('GpsDetails', { run });
  }

  return (
    <Pressable onPress={onPress}>
      <View style={styles.container}>
        <View style={styles.row}>
          <Text style={styles.text}>Date: {formattedDate} </Text>
          <Text style={styles.text}>Time: {formattedTime}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.text}>Distance: {run.totalDistance.toFixed(2)} km</Text>
          <Text style={styles.text}>Average Speed: {run.averageSpeed.toFixed(2)} km/h</Text>
        </View>
        <Text style={[
          styles.text,
          { color: run.achieved ? 'limegreen' : 'red' }
        ]}>Goal Achieved: {run.achieved ? 'Yes' : 'No'}</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    backgroundColor: Colors.primary800,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  text: {
    color: 'white',
    fontFamily: 'RobotoCondensed_400Regular',
  },
  textCongrats: {
    color: 'white',
    fontFamily: 'RobotoCondensed_400Regular',
  },
});

export default GpsRunItem;

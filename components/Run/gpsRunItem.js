import React from 'react';
import { View, Text, StyleSheet,Pressable } from "react-native";
import { useNavigation } from '@react-navigation/native';

function GpsRunItem({ run }) {
  // Assuming run object includes: id, timestamp, distance, averageSpeed, isAchieved
  const navigation = useNavigation();
  const formattedDate = new Date(run.timestamp.seconds * 1000).toLocaleDateString("en-US");
   const formattedTime = new Date(run.timestamp.seconds * 1000).toLocaleTimeString("en-US");
    function onPress() {
    navigation.navigate('GpsDetails', { run });
    }
  return (
    <Pressable onPress={onPress}>
    <View style={styles.container}>
      <Text>ID: {run.id}</Text>
      <Text>Date: {formattedDate} time: {formattedTime}</Text>
      <Text>Distance: {run.totalDistance.toFixed(2)} km</Text>
      <Text>Average Speed: {run.averageSpeed.toFixed(2)} km/h</Text>
      <Text>Goal Achieved: {run.achieved ? 'Yes' : 'No'}</Text>
    </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  }
});

export default GpsRunItem;

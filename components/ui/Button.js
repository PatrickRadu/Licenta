import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Colors } from '../../constants/styles';
import { useFonts, RobotoCondensed_700Bold } from '@expo-google-fonts/roboto-condensed';
function Button({ children, onPress, style }) {
  let [fontsLoaded, fontError] = useFonts({
    RobotoCondensed_700Bold,
  });
  return (
    <Pressable
      style={({ pressed }) => [
        styles.button,
        pressed && styles.pressed,
        style
      ]}
      onPress={onPress}
    >
      <View style={styles.innerContainer}>
        <Text style={styles.buttonText}>{children}</Text>
      </View>
    </Pressable>
  );
}

export default Button;

const styles = StyleSheet.create({
  button: {
    borderRadius: 10, 
    paddingVertical: 12, 
    paddingHorizontal: 20, 
    backgroundColor: '#444', 
    elevation: 2, 
    shadowColor: '#444',
    shadowOffset: { width: 1, height: 1 }, 
    shadowOpacity: 0.5, 
    shadowRadius: 4,
    marginTop: 20,
  },
  pressed: {
    opacity: 0.8, 
  },
  innerContainer: {
    alignItems: 'center', 
    justifyContent: 'center',
  },
  buttonText: {
    textAlign: 'center',
    color: '#ffffff', 
    fontSize: 18, 
    fontFamily: 'RobotoCondensed_700Bold', 
  },
});

import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Colors } from '../../constants/styles';
import { useFonts, RobotoCondensed_700Bold } from '@expo-google-fonts/roboto-condensed';
function Button({ children, onPress }) {
  let [fontsLoaded, fontError] = useFonts({
    RobotoCondensed_700Bold,
  });
  return (
    <Pressable
      style={({ pressed }) => [
        styles.button,
        pressed && styles.pressed,
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
    borderRadius: 10, // Slightly larger radius for a smoother look
    paddingVertical: 12, // Increased padding for a more substantial button
    paddingHorizontal: 20, // Increased padding for better touch targets
    backgroundColor: '#444', // Dark background to match the screen's theme
    elevation: 2, // Increased elevation for a more pronounced shadow effect
    shadowColor: '#444',
    shadowOffset: { width: 1, height: 1 }, // Larger offset for a more noticeable shadow
    shadowOpacity: 0.5, // Higher opacity for a stronger shadow
    shadowRadius: 4,
    marginTop: 20, // Added margin to provide space above the button
  },
  pressed: {
    opacity: 0.8, // Slight opacity change when pressed
  },
  innerContainer: {
    alignItems: 'center', // Center the text inside the button
    justifyContent: 'center',
  },
  buttonText: {
    textAlign: 'center',
    color: '#ffffff', // White text for high contrast
    fontSize: 18, // Slightly larger font for better readability
    fontWeight: 'bold',
    fontFamily: 'RobotoCondensed_700Bold', // Use the custom font for the button text
  },
});

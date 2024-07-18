import { useContext, useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { AuthContext } from '../store/auth-store';
import { Colors } from '../constants/styles';
import { getFirestore, doc, onSnapshot } from "firebase/firestore";
import Button from '../components/ui/Button';
import { UserContext } from '../store/userdata-store';
import { RobotoCondensed_400Regular, useFonts, RobotoCondensed_700Bold } from '@expo-google-fonts/roboto-condensed';
function WelcomeScreen({ navigation }) {
    const authCtx = useContext(AuthContext);
    const [userData, setUserData] = useState(null);
    const userContext = useContext(UserContext);

    let [fontsLoaded, fontError] = useFonts({
        RobotoCondensed_400Regular,
        RobotoCondensed_700Bold,
      });
    useEffect(() => {
        const db = getFirestore();
        const docRef = doc(db, "users", authCtx.token);
        const unsubscribe = onSnapshot(docRef, (doc) => {
            if (doc.exists()) {
                const data = doc.data();
                setUserData(data);
                if (data.weight !== undefined) {
                    userContext.updateWeight(data.weight);
                }
            } else {
                console.log("No such document!");
            }
        }, (error) => {
            console.error("Error listening to the document: ", error);
        });

       
        return () => unsubscribe();
    }, [authCtx.token]);

    function onPress() {
        navigation.navigate('UpdateProfile', { userData });
    }



    return (
        <View style={styles.rootContainer}>
            <Text style={styles.title}>Welcome {userData ? userData.name : 'User'}</Text>
            {userData && (
                <View>
                    <Text style={styles.text}>Name: {userData.name}</Text>
                    <Text style={styles.text}>Weight: {userData.weight} kg</Text>
                    <Text style={styles.text}>Height: {userData.height} cm</Text>
                    <Text style={styles.text}>Age: {userData.age} years</Text>
                </View>
            )}
            <View style={styles.buttonContainer}>
            <Button onPress={onPress}>Change Profile</Button>
            </View>
        </View>
    );
}

export default WelcomeScreen;

const styles = StyleSheet.create({
    rootContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 32,
        backgroundColor: Colors.primary800,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 8,
        color:'white',
        borderBottomColor:"white",
        borderBottomWidth:1,
        fontFamily:'RobotoCondensed_700Bold',
    },
    text:{
        fontSize: 18,
        marginVertical: 12,
        color:'white',
        fontFamily:'RobotoCondensed_700Bold',
    },
    buttonContainer: {
        marginTop: 80,
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
    },
});

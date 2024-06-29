import { useContext, useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { AuthContext } from '../store/auth-store';
import { Colors } from '../constants/styles';
import { getFirestore, doc, onSnapshot } from "firebase/firestore";
import Button from '../components/ui/Button';
import { UserContext } from '../store/userdata-store';

function WelcomeScreen({ navigation }) {
    const authCtx = useContext(AuthContext);
    const [userData, setUserData] = useState(null);
    const userContext = useContext(UserContext);

    useEffect(() => {
        const db = getFirestore();
        const docRef = doc(db, "users", authCtx.token);

        // Listen for real-time updates
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

        // Clean up the listener when the component unmounts
        return () => unsubscribe();
    }, [authCtx.token]);

    function onPress() {
        navigation.navigate('UpdateProfile', { userData });
    }

    console.log(userContext.weight);

    return (
        <View style={styles.rootContainer}>
            <Text style={styles.title}>Welcome {userData ? userData.name : 'User'}</Text>
            {userData && (
                <View>
                    <Text>Name: {userData.name}</Text>
                    <Text>Weight: {userData.weight} kg</Text>
                    <Text>Height: {userData.height} cm</Text>
                    <Text>Age: {userData.age} years</Text>
                </View>
            )}
            <Button onPress={onPress}>Change Profile</Button>
            <Text>You authenticated successfully!</Text>
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
        backgroundColor: Colors.primary500
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 8,
    },
});

import { useContext, useState } from 'react';
import AuthContent from '../components/Auth/AuthContent';
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import LoadingOverlay from '../components/ui/LoadingOverlay';
import { Alert } from 'react-native';
import { AuthContext } from '../store/auth-store';
import { getFirestore, doc, setDoc } from "firebase/firestore";
import { db } from '../util/firebase';

function SignupScreen() {
    const authCtx = useContext(AuthContext);
    const [isAuthenticating, setIsAuthenticating] = useState(false);

    async function signUpHandler({ email, password }) {
        setIsAuthenticating(true);
        const auth = getAuth();
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
            console.log(user.uid);
            // Set the document in Firestore
            const userData = {
                name: `Guest${user.uid}`,
                weight: 0,
                height: 0,
                age: 0
            };
            await setDoc(doc(db, "users", user.uid), userData);
            setIsAuthenticating(false);
            authCtx.authenticate(user.uid);
        } catch (error) {
            console.log(error.code, error.message);
            Alert.alert('Signup failed!', error.message);
            setIsAuthenticating(false);
        }
    }

    if (isAuthenticating) {
        return <LoadingOverlay message="Creating your account" />;
    }
    return <AuthContent onAuthenticate={signUpHandler} />;
}

export default SignupScreen;

import { useContext, useState } from 'react';
import AuthContent from '../components/Auth/AuthContent';
import { auth } from '../util/firebase';
import LoadingOverlay from '../components/ui/LoadingOverlay';
import { signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { Alert } from 'react-native';
import { AuthContext } from '../store/auth-store';
import { provider } from '../util/firebase';

// GoogleSignin.configure({
//     webClientId:'580786294346-3u80peeo94flsb41av0nua9kqt39hon9.apps.googleusercontent.com'
// })
function LoginScreen() {
    const authCtx=useContext(AuthContext)
    const[isLogingIn,setIsLogingIn]=useState();
    function signInHandler({ email, password }) {
    setIsLogingIn(true);
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        console.log(userCredential.user.uid)
        authCtx.authenticate(userCredential.user.uid);
        console.log(authCtx.token)
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorCode, errorMessage);
        setIsLogingIn(false);
        Alert.alert('Invalid input', 'Please check your entered credentials.');
      });
        
    }
//     function loginGoogleHandler() {
//         setIsLogingIn(true);
//         GoogleSignin.signIn()
//           .then((data) => {
//             const credential = GoogleAuthProvider.credential(data.idToken);
//             return signInWithCredential(auth, credential);
//           })
//           .then((userCredential) => {
//             console.log(userCredential.user);
//             authCtx.authenticate(userCredential.user.uid);
//             setIsLogingIn(false);
//           })
//           .catch((error) => {
//             console.error(error);
//             Alert.alert('Google Sign-in Error', error.message);
//             setIsLogingIn(false);
//           });
// }
    if(isLogingIn){
        return <LoadingOverlay message="Logging you in" />;
    }
  return <AuthContent isLogin onAuthenticate={signInHandler} />;
}

export default LoginScreen;
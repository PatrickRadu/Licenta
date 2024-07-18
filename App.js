import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { StatusBar } from "expo-status-bar";

import LoginScreen from "./screens/LoginScreen";
import SignupScreen from "./screens/SignupScreen";
import WelcomeScreen from "./screens/WelcomeScreen";
import { Colors } from "./constants/styles";
import AuthContextProvider, { AuthContext } from "./store/auth-store";
import { useContext } from "react";
import IconButton from "./components/ui/IconButton";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import RunHistoryScreen from "./screens/RunHistoryScreen";
import RunSummary from "./screens/RunSummary";
import Run from "./screens/Run";
import { auth } from "./util/firebase";
import Ionicons from 'react-native-vector-icons/Ionicons';
import RunDetails from "./screens/RunDetails";
import Objectives from "./screens/Objectives";
import AccelerometerRun from "./screens/AccelerometerRun";
import AccelerometerRunSummary from "./screens/AccelerometerRunSummary";
import GpsRunDetail from "./screens/GpsRunDetail";
import AccDetails from "./screens/AccDetailsRun";
import UpdateProfile from "./screens/UpdateProfile";
import { UserContext } from "./store/userdata-store";
import UserContextProvider from "./store/userdata-store";

const Stack = createNativeStackNavigator();
const Bottom= createBottomTabNavigator();
function BottomTab()
{
  return(
    <Bottom.Navigator screenOptions={{
      headerStyle: { backgroundColor: Colors.primary800 },
      headerTintColor: "white",
      contentStyle: { backgroundColor: Colors.primary500},
      tabBarStyle: { 
        backgroundColor: Colors.primary800,
        borderTopColor:'white',
        borderTopWidth: 1,
       },
      tabBarActiveTintColor: Colors.primary500,
    }}>
      <Bottom.Screen name="ProfileManager" component={ProfileNavigation}  options={{
        headerShown:false,
            tabBarIcon: ({ color }) => (<Ionicons name="person" size={24} color={color} />)
      }}/>
      <Bottom.Screen name="History" component={RunHistoryScreen} options={{
        tabBarIcon: ({ color }) => (<Ionicons name="earth" size={24} color={color} />)
      }}/>
      </Bottom.Navigator>
  )
}

function Running()
{
  return(
    <Stack.Navigator screenOptions={{
      headerStyle: { 
        backgroundColor: Colors.primary800,
       },
      headerTintColor: "white",
      contentStyle: { backgroundColor: Colors.primary500 },
    }}>
      <Stack.Screen name="Main" component={BottomTab} options={
        {
          headerShown:false,
        }
      }/>
      <Stack.Screen name="Run" component={Run} />
      <Stack.Screen name="Summary" component={RunSummary} options={{
        headerLeft:()=>null,
        headerShown:false,
      }}/>
      <Stack.Screen name="RunDetails" component={RunDetails} />
      <Stack.Screen name="Objectives" component={Objectives} />
      <Stack.Screen name="AccelerometerRun" component={AccelerometerRun} />
      <Stack.Screen name="AccelerometerRunSummary" component={AccelerometerRunSummary} options={{
        headerShown:false,
      }}/>
      <Stack.Screen name="GpsDetails" component={GpsRunDetail} />
      <Stack.Screen name="AccDetails" component={AccDetails}/>
    </Stack.Navigator>
  )
}

function ProfileNavigation()
{
  return(
    <Stack.Navigator screenOptions={{
      headerStyle: { backgroundColor: Colors.primary800 },
      headerTintColor: "white",
      contentStyle: { backgroundColor: Colors.primary500 },
    
    }}>
      <Stack.Screen name="Profile" component={WelcomeScreen} options={{
         headerRight: ({ tintColor }) => (
          <IconButton
            icon="exit"
            color="red"
            onPress={authCtx.logout}
            size={24}
          />),
      }}/>
      <Stack.Screen name="UpdateProfile" component={UpdateProfile}/>
    </Stack.Navigator>
  )

}
function Home()
{
  return (
    authCtx = useContext(AuthContext),
    <UserContextProvider>
    <Running/>
    </UserContextProvider>
  )
}
function AuthStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: Colors.primary800 },
        headerTintColor: "white",
        contentStyle: { backgroundColor: Colors.primary300 },
      }}
    >
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Signup" component={SignupScreen} />
    </Stack.Navigator>
  );
}

function AuthenticatedStack() {
  const authCtx = useContext(AuthContext);
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: Colors.primary800 },
        headerTintColor: "white",
        contentStyle: { backgroundColor: Colors.primary500 },
      }}>
      <Stack.Screen name="Home" component={Home} options={{
          headerRight: ({ tintColor }) => (
            <IconButton
              icon="exit"
              color="red"
              onPress={authCtx.logout}
              size={24}
            />),
          headerShown:false,
      }} />
    </Stack.Navigator>
  );
}

function Navigation() {
  const authCtx = useContext(AuthContext);
  return (
    <NavigationContainer>
      {!authCtx.isAuthenticated && <AuthStack />}
      {authCtx.isAuthenticated && <AuthenticatedStack />}
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <>
    
      <StatusBar style="light" />
      <AuthContextProvider>
        <Navigation />
      </AuthContextProvider>
    </>
  );
}

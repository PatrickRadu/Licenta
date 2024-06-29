import { View,Text,Pressable } from "react-native";
import{ useNavigation } from "@react-navigation/native";
function AccRunItem({run})
{
    const navigation = useNavigation();
    const formattedDate = new Date(run.timestamp.seconds * 1000).toLocaleDateString("en-US");
    const formattedTime = new Date(run.timestamp.seconds * 1000).toLocaleTimeString("en-US");
    function onPress()
    {
        navigation.navigate('AccDetails',{run});
    }
    return(
        <Pressable onPress={onPress}>
        <View>
        <Text>run.id: {run.id}</Text>
        <Text>Date: {formattedDate} Time: {formattedTime}</Text>
        <Text>Steps: {run.steps}</Text> 
        <Text>Distance: {run.distance.toFixed(2)} km</Text>
        <Text>Average Speed: {run.averageSpeed.toFixed(2)} km/h</Text>
        <Text>Goal Achieved: {run.achieved ? 'Yes' : 'No'}</Text>
        <Text>Calories: {run.caloriesBurned}</Text>
        </View>
        </Pressable>
    );
}
export default AccRunItem;
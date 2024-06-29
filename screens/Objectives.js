import { TextInput } from "react-native-paper";
import Button from "../components/ui/Button";
import { View, Text } from "react-native";
import { useState } from "react";
function Objectives({navigation})
{   
    const [targetDistance, setTargetDistance] = useState('');
    const [targetTime, setTargetTime] = useState('');
    function onStartAccRun()
    {
        navigation.navigate("AccelerometerRun",{targetDistance:parseFloat(targetDistance),targetTime:parseInt(targetTime,10)*60});
    }
    function onSubmit(){
        navigation.navigate("Run",{targetDistance:parseFloat(targetDistance),targetTime:parseInt(targetTime,10)*60
        });

    }
    return(<View>
        <Text>Objectives</Text>
        <TextInput 
            label="Distance"
            keyboardType="numeric"
            value={targetDistance}
            onChangeText={setTargetDistance}
        ></TextInput>
        <TextInput
            label="Time"
            keyboardType="numeric"
            value={targetTime}
            onChangeText={setTargetTime}
        ></TextInput>
        <Button onPress={onSubmit}>Start</Button>
        <Button onPress={onStartAccRun}>Start Acc Run</Button>
    </View>)

}
export default Objectives;
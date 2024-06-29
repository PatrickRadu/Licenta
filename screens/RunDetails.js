import { View,Text } from "react-native";

function RunDetails({route})
{
    const {id}=route.params;
    console.log(id)
    return(
        <View>
            <Text>Run Details for {id}</Text>
            
        </View>
    )
}
export default RunDetails;



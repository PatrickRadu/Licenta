import { View,FlatList,Text } from "react-native";
import GpsRunItem from "./gpsRunItem";

function GpsRunList({runs})
{
    function renderList({item})
    {
        return(
            <View>
                <GpsRunItem run={item}></GpsRunItem>
            </View>
        );
    
    }
    return(
        <View>
            <FlatList
            keyExtractor={(item) => item.id}
            data={runs}
            renderItem={renderList}
            />
        </View>
    );
}
export default GpsRunList;
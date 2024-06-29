import { View,FlatList,Text } from "react-native";
import AccRunItem from "./accRunItem";
function AccRunList({runs})
{
    function renderList({item})
    {
        return(
            <View>
                <AccRunItem run={item}></AccRunItem>
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
export default AccRunList;
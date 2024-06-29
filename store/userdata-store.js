import { createContext,useState } from "react";

export const UserContext=createContext({
    weight:0,
    updateWeight:((weight)=>{}),
})

function UserContextProvider({children})
{
    const[weight,setWeight]=useState(0);
    function updateWeight(weight){
        setWeight(weight);
    }
    const value={
        weight:weight,
        updateWeight:updateWeight,
    }
    return(
        <UserContext.Provider value={value}>
            {children}
        </UserContext.Provider>
    )
}
export default UserContextProvider;

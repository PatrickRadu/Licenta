
import { createContext } from "react";

export const RunsContext=createContext({
    runs:[],
    setRun:((runs)=>{}),
    deleteRun:((id)=>{}),
})

function RunsContextProvider({children})
{
    return(
        <RunsContext.Provider>
            {children}
        </RunsContext.Provider>
    )
}
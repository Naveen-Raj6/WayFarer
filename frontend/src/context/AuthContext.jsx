import { useState,useContext,useEffect,createContext } from "react";
const AuthContext = createContext();


export const AuthProvider = ({ children }) => {
    let [token,setToken]=useState(localStorage.getItem("userToken"));
    let [user,setUser]=useState(
        localStorage.getItem("user")
    );
    useEffect(()=>{
        const token = localStorage.getItem("userToken");
        if(token){
            setToken(token);
        }
    },[])
    
    return (
        <AuthContext.Provider value={{token,setToken,user,setUser}}>
            {children}
        </AuthContext.Provider>
    )
}

export default function useAuth() {
    return useContext(AuthContext);
}
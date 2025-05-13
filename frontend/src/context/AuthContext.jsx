import { useState, useContext, useEffect, createContext } from "react";
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  let [token, setToken] = useState(localStorage.getItem("userToken") || null);
  let [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  useEffect(() => {
    if (token) {
      localStorage.setItem("userToken", token);
    } else {
      localStorage.removeItem("userToken");
    }
  }, [token]);
  useEffect(() => {
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
    } else {
      localStorage.removeItem("user");
    }
  }, [user]);

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("userToken");
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider value={{ token, setToken, user, setUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default function useAuth() {
  return useContext(AuthContext);
}

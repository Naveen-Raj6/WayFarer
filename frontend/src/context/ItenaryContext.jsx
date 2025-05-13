import { useContext, createContext, useEffect, useState } from "react";
import useAuth from "./AuthContext";
import axios from "../utils/axios";

const ItineraryContext = createContext();

export const ItineraryProvider = ({ children }) => {
  const { token } = useAuth();
  const [itenaries, setItenaries] = useState([]);

  useEffect(() => {
    if (token) {
      fetchItinaries();
    }
  }, [token]);

  const fetchItinaries = async () => {
    try {
      const response = await axios.get("/itenaries", {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Replace the existing state with the fetched data
      setItenaries([...response.data]);
    } catch (error) {
      console.error("Error fetching itineraries:", error);
    }
  };

  useEffect(() => {
    if (token) {
      fetchItinaries();
    }
  }, [token]);

  return (
    <ItineraryContext.Provider value={{ itenaries, setItenaries }}>
      {children}
    </ItineraryContext.Provider>
  );
};
export default function useItinerary() {
  return useContext(ItineraryContext);
}

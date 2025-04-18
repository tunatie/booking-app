import { createContext, useState, useEffect, useContext } from "react";
import axios from "./utils/axios";

export const UserContext = createContext({});

export function useUser() {
    const context = useContext(UserContext);
    if (context === undefined) {
        throw new Error('useUser must be used within a UserContextProvider');
    }
    return context;
}

export function UserContextProvider({children}) {
    const [user, setUser] = useState(null);
    const [ready, setReady] = useState(false);

    useEffect(() => {
        // Always try to fetch profile when component mounts
        fetchProfile();
    }, []);

    async function fetchProfile() {
        try {
            const { data } = await axios.get('/profile');
            console.log('Profile data:', data);
            if (data) {
                setUser(data);
            } else {
                setUser(null);
            }
        } catch (error) {
            console.error('Profile fetch error:', error);
            setUser(null);
        } finally {
            setReady(true);
        }
    }

    return (
        <UserContext.Provider value={{
            user,
            setUser,
            ready,
            fetchProfile // Export this function to allow manual refresh
        }}>
            {children}
        </UserContext.Provider>
    );
}




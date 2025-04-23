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
        const checkAuth = async () => {
            const token = localStorage.getItem('token');
            if (token) {
                try {
                    const { data } = await axios.get('/auth/profile');
                    setUser(data);
                } catch (error) {
                    console.error('Error fetching profile:', error);
                    if (error.response?.status === 401) {
                        localStorage.removeItem('token');
                    }
                }
            }
            setReady(true);
        };

        checkAuth();
    }, []);

    async function login(email, password) {
        try {
            const { data } = await axios.post('/auth/login', { email, password });
            setUser(data);
            if (data.token) {
                localStorage.setItem('token', data.token);
            }
            return { success: true };
        } catch (e) {
            return {
                success: false,
                error: e.response?.data?.error || 'Something went wrong'
            };
        }
    }

    async function register(name, email, password) {
        try {
            const { data } = await axios.post('/auth/register', {
                name,
                email,
                password,
            });
            setUser(data);
            if (data.token) {
                localStorage.setItem('token', data.token);
            }
            return { success: true };
        } catch (e) {
            return {
                success: false,
                error: e.response?.data?.error || 'Something went wrong'
            };
        }
    }

    function logout() {
        setUser(null);
        localStorage.removeItem('token');
    }

    return (
        <UserContext.Provider value={{ user, setUser, ready, login, logout, register }}>
            {children}
        </UserContext.Provider>
    );
}




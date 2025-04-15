import { useContext } from "react";
import { UserContext } from "../UserContext";
import { Navigate } from "react-router-dom";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import { useState } from "react";
import PlacesPage from "./PlacesPage";
import AccountNav from "../AccountNav";

export default function ProfilePage(){
    const [redirect,setRedirect] = useState(null);
    const {user,ready,setUser} = useContext(UserContext);
    let {subpage} = useParams();
    if(subpage === undefined){
        subpage = 'profile';
    }

    async function logout(){
        try {
            await axios.post('/logout');
            setUser(null);
            setRedirect('/');
        } catch (error) {
            console.error('Logout error:', error);
        }
    }

    if(!ready){ 
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-gray-900"></div>
            </div>
        );
    }

    if(ready && !user && !redirect){
        return <Navigate to={'/login'}/>
    }

    if(redirect){
        return <Navigate to={redirect}/>
    }

    return(
        <div>
            <AccountNav/>
            {subpage === 'profile' && (
                <div className="text-center max-w-lg mx-auto">
                    Logged in as {user.name} ({user.email})
                    <button onClick={logout} className="primary max-w-sm mt-2">Logout</button>
                </div>
            )}
            {subpage === 'places' && (
                <PlacesPage/>
            )}
        </div>
    )
}
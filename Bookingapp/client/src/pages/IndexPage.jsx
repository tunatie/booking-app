import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import CategoryFilter from "../components/CategoryFilter";

export default function IndexPage() {
    const [places,setPlaces] = useState([]);

    useEffect(() => {
        axios.get('/places').then(response => {
            setPlaces(response.data);
        });
    }, []);

    return (
        <>
            <CategoryFilter />
            <div className="mt-8 grid gap-x-6 gap-y-8 grid-cols-1 md:grid-cols-3 lg:grid-cols-4">
                {places.length > 0 && places.map(place => (
                    <Link to={'/place/'+place._id} key={place._id} className="group">
                        <div className="bg-gray-500 mb-2 rounded-2xl flex aspect-square overflow-hidden">
                            {place.photos?.[0] && (
                                <img 
                                    className="object-cover aspect-square w-full group-hover:scale-105 transition-transform duration-300" 
                                    src={'http://localhost:4000/uploads/'+place.photos?.[0]} 
                                    alt={place.title}
                                />
                            )}
                        </div>
                        <h3 className="font-bold truncate">{place.title}</h3>
                        <h2 className="text-sm text-gray-500">{place.address}</h2>
                        <div className="mt-1">
                            <span className="font-bold">${place.price}</span> per night
                        </div>
                    </Link>
                ))}
            </div>
        </>
    );
}
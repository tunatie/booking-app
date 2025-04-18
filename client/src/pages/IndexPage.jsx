import { useEffect, useState } from "react";
import axios from "../utils/axios";
import { Link } from "react-router-dom";
import CategoryFilter from "../components/CategoryFilter";
import { API_BASE_URL } from "../config";

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
                                    src={`${API_BASE_URL}/uploads/${place.photos[0]}`}
                                    alt={place.title}
                                    onError={(e) => {
                                        e.target.onerror = null; 
                                        e.target.src="https://placehold.co/600x600?text=Image+Not+Found"; 
                                    }}
                                />
                            )}
                            {!place.photos?.[0] && (
                                <div className="w-full h-full flex items-center justify-center bg-gray-200">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12 text-gray-400">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
                                    </svg>
                                </div>
                            )}
                        </div>
                        <h3 className="font-bold truncate">{place.title}</h3>
                        <h2 className="text-sm text-gray-500">{place.address}</h2>
                        <div className="mt-1">
                            <span className="font-bold">${place.price?.toLocaleString('vi-VN')}</span> / đêm
                        </div>
                    </Link>
                ))}
            </div>
        </>
    );
}
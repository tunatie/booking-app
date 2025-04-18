import { API_BASE_URL } from './config'; // Import the base URL

export default function PlaceImg({place, index=0, className=null}) {
    // Check if place exists and has photos
    if (!place || !place.photos || place.photos.length === 0) {
        return (
            <div className={`w-full h-full flex items-center justify-center bg-gray-200 ${className}`}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12 text-gray-400">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
                </svg>
            </div>
        );
    }

    // Make sure index is valid
    if (index >= place.photos.length) {
        index = 0;
    }

    if (!className) {
        className = 'object-cover';
    }

    return (
        <img 
            className={className} 
            src={`${API_BASE_URL}/uploads/${place.photos[index]}`} 
            alt={place.title || "Place image"}
            onError={(e) => {
                e.target.onerror = null;
                e.target.src = "https://placehold.co/600x400?text=Image+Not+Found";
            }}
        />
    );
}

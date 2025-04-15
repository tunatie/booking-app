import { useState } from "react";

export default function PlaceGallery({place}){
    const [showAllPhotos,setShowAllPhotos] = useState(false);
    const [showCarousel, setShowCarousel] = useState(false);
    const [currentPhoto, setCurrentPhoto] = useState(0);
    
    if (showCarousel) {
        return (
            <div className="fixed inset-0 bg-black min-h-screen z-50">
                <div className="p-4">
                    <div className="flex justify-between items-center">
                        <h2 className="text-white text-xl">{currentPhoto + 1} / {place.photos.length} - {place.title}</h2>
                        <button onClick={() => setShowCarousel(false)} 
                                className="bg-white/10 hover:bg-white/20 px-4 py-2 rounded-2xl flex gap-1 items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-white">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                            <span className="text-white">Close</span>
                        </button>
                    </div>
                    <div className="flex justify-center items-center h-[calc(100vh-6rem)] relative">
                        <button onClick={() => setCurrentPhoto((prev) => (prev > 0 ? prev - 1 : place.photos.length - 1))} 
                                className="absolute left-4 bg-white/10 hover:bg-white/20 p-2 rounded-full">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6 text-white">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                            </svg>
                        </button>
                        <img src={`http://localhost:4000/uploads/${place.photos[currentPhoto]}`} 
                             alt="" 
                             className="max-h-full max-w-full object-contain"/>
                        <button onClick={() => setCurrentPhoto((prev) => (prev < place.photos.length - 1 ? prev + 1 : 0))}
                                className="absolute right-4 bg-white/10 hover:bg-white/20 p-2 rounded-full">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6 text-white">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        );
    }
    
    if (showAllPhotos) {
        return (
            <div className="fixed inset-0 bg-gray-100 min-h-screen z-50">
                <div className="p-8">
                    <div className="flex justify-between items-center mb-8">
                        <h2 className="text-2xl">Photos of {place.title}</h2>
                        <button onClick={() => setShowAllPhotos(false)} 
                                className="hover:bg-gray-200 px-4 py-2 rounded-2xl flex gap-1 items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                            Close
                        </button>
                    </div>
                    <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
                        {place.photos?.length > 0 && place.photos.map((photo, index) => (
                            <div key={index} 
                                 className="aspect-square cursor-pointer" 
                                 onClick={() => {
                                     setCurrentPhoto(index);
                                     setShowCarousel(true);
                                 }}>
                                <img src={`http://localhost:4000/uploads/${photo}`} 
                                     alt="" 
                                     className="w-full h-full object-cover"/>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    return(
        <div className="relative">
            <div className="grid grid-cols-[2fr_1fr_1fr] gap-2 rounded-3xl overflow-hidden">
                <div className="aspect-square cursor-pointer" onClick={() => setShowAllPhotos(true)}>
                    {place.photos?.[0] && (
                        <img 
                            className="aspect-square object-cover w-full h-full"
                            src={`http://localhost:4000/uploads/${place.photos[0]}`} 
                        />
                    )}
                </div>
                <div className="grid">
                    <div className="aspect-square cursor-pointer" onClick={() => setShowAllPhotos(true)}>
                        {place.photos?.[1] && (
                            <img 
                                className="aspect-square object-cover w-full h-full"
                                src={`http://localhost:4000/uploads/${place.photos[1]}`} 
                            />
                        )}
                    </div>
                    <div className="aspect-square cursor-pointer" onClick={() => setShowAllPhotos(true)}>
                        {place.photos?.[3] && (
                            <img 
                                className="aspect-square object-cover w-full h-full"
                                src={`http://localhost:4000/uploads/${place.photos[3]}`} 
                            />
                        )}
                    </div>
                </div>
                <div className="grid">
                    <div className="aspect-square cursor-pointer" onClick={() => setShowAllPhotos(true)}>
                        {place.photos?.[2] && (
                            <img 
                                className="aspect-square object-cover w-full h-full"
                                src={`http://localhost:4000/uploads/${place.photos[2]}`} 
                            />
                        )}
                    </div>
                    <div className="aspect-square cursor-pointer relative" onClick={() => setShowAllPhotos(true)}>
                        {place.photos?.[4] && (
                            <img 
                                className="aspect-square object-cover w-full h-full"
                                src={`http://localhost:4000/uploads/${place.photos[4]}`} 
                            />
                        )}
                        {place.photos?.length > 5 && (
                            <button onClick={(e) => {e.stopPropagation(); setShowAllPhotos(true);}} 
                                    className="absolute inset-0 bg-black bg-opacity-40 text-white flex items-center justify-center">
                                <span className="text-lg">+{place.photos.length - 5} photos</span>
                            </button>
                        )}
                    </div>
                </div>
            </div>
            <button onClick={() => setShowAllPhotos(true)} 
                    className="flex gap-1 absolute bottom-2 right-2 py-2 px-4 bg-white rounded-2xl shadow-md shadow-gray-500">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                    <path fillRule="evenodd" d="M1.5 6a2.25 2.25 0 012.25-2.25h16.5A2.25 2.25 0 0122.5 6v12a2.25 2.25 0 01-2.25 2.25H3.75A2.25 2.25 0 011.5 18V6zM3 16.06V18c0 .414.336.75.75.75h16.5A.75.75 0 0021 18v-1.94l-2.69-2.689a1.5 1.5 0 00-2.12 0l-.88.879.97.97a.75.75 0 11-1.06 1.06l-5.16-5.159a1.5 1.5 0 00-2.12 0L3 16.061zm10.125-7.81a1.125 1.125 0 112.25 0 1.125 1.125 0 01-2.25 0z" clipRule="evenodd" />
                </svg>
                Show more photos
            </button>
        </div>
    )
}

import { Link,useParams } from "react-router-dom";
import { useState,useEffect } from "react";
import axios from "axios";
import AccountNav from "../AccountNav";
import PlaceImg from "../PlaceImg";

export default function PlacesPage(){ 
    const [places,setPlaces] = useState([]);
    const [loading, setLoading] = useState(true);
    
    useEffect(()=>{
        setLoading(true);
        axios.get('/user-places').then(({data})=>{
            setPlaces(data);
            setLoading(false);
        }).catch(err => {
            console.error('Error fetching places:', err);
            setLoading(false);
        });
    },[]);

    // Separate places into published and draft
    const publishedPlaces = places.filter(place => !place.draft);
    const draftPlaces = places.filter(place => place.draft);

    // Render placeholder when no image is available
    function PlaceholderImg() {
        return (
            <div className="w-full h-full flex items-center justify-center bg-gray-200 rounded-xl">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12 text-gray-400">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
                </svg>
            </div>
        );
    }

    // Render place card
    function PlaceCard({place, isDraft = false}) {
        const hasPhotos = place.photos && place.photos.length > 0;
        
        return (
            <div className={`flex cursor-pointer gap-4 p-4 rounded-2xl ${isDraft ? 'bg-gray-50 border border-gray-200' : 'bg-gray-100'}`}>
                <div className="w-32 h-32 shrink-0 rounded-xl overflow-hidden">
                    {hasPhotos ? (
                        <PlaceImg place={place} className="w-full h-full object-cover" />
                    ) : (
                        <PlaceholderImg />
                    )}
                </div>
                <div className="grow flex flex-col">
                    <h2 className="text-xl font-medium">{place.title || 'Chưa có tiêu đề'}</h2>
                    <p className="text-sm text-gray-500 line-clamp-2 mt-1 mb-2">{place.description || 'Chưa có mô tả'}</p>
                    {isDraft && (
                        <div className="mt-auto">
                            <Link to="/account/places/overview" className="inline-block px-4 py-2 bg-primary text-white rounded-lg">
                                Tiếp tục hoàn tất
                            </Link>
                        </div>
                    )}
                    {!isDraft && place.price && (
                        <div className="mt-auto">
                            <span className="font-medium">{place.price.toLocaleString('vi-VN')}₫</span>
                            <span className="text-gray-500"> /đêm</span>
                        </div>
                    )}
                </div>
            </div>
        );
    }

    return(
        <div>
            <AccountNav/>
            <div className="text-center">
                <Link className="inline-flex gap-1 bg-primary text-white py-2 px-6 rounded-full" to="/account/places/overview">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                    </svg>
                    Thêm nơi ở mới
                </Link>
            </div>         
            
            {loading && (
                <div className="flex justify-center items-center h-40">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
                </div>
            )}

            {!loading && (
                <>
                    {/* Published Places */}
                    {publishedPlaces.length > 0 && (
                        <div className="mt-8">
                            <h2 className="text-xl font-bold mb-4">Đã đăng ({publishedPlaces.length})</h2>
                            <div className="flex flex-col gap-4">
                                {publishedPlaces.map(place => (
                                    <Link key={place._id} to={'/account/places/'+place._id}>
                                        <PlaceCard place={place} />
                                    </Link>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Draft Places */}
                    {draftPlaces.length > 0 && (
                        <div className="mt-8">
                            <h2 className="text-xl font-bold mb-4">Đang chờ hoàn tất ({draftPlaces.length})</h2>
                            <div className="flex flex-col gap-4">
                                {draftPlaces.map(place => (
                                    <PlaceCard key={place._id} place={place} isDraft={true} />
                                ))}
                            </div>
                        </div>
                    )}

                    {/* No Places Message */}
                    {places.length === 0 && (
                        <div className="mt-8 text-center text-gray-500">
                            Bạn chưa có phòng nào. Hãy thêm phòng mới!
                        </div>
                    )}
                </>
            )}
        </div>
    );
}
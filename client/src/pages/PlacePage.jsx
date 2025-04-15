import { useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useState } from "react";
import BookingWidget from "../BookingWidget";
import PlaceGallery from "../PlaceGallery";
import AddressLink from "./AddressLink";

export default function PlacePage() {
    const {id} = useParams();
    const [place, setPlace] = useState(null);
    const [showAllPhotos, setShowAllPhotos] = useState(false);
    const [showAllAmenities, setShowAllAmenities] = useState(false);
    const [isLiked, setIsLiked] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [stats, setStats] = useState({
        cleanliness: 0,
        accuracy: 0,
        communication: 0,
        location: 0,
        checkin: 0,
        value: 0,
        average: 0,
        total: 0
    });
    const [showCancellationModal, setShowCancellationModal] = useState(false);

    useEffect(() => {
        if(!id) {
            return;
        }
        
        const fetchData = async () => {
            try {
                setLoading(true);
                const response = await axios.get(`/places/${id}`);
            setPlace(response.data);
                
                // Check if user has liked this place
                const likedPlaces = JSON.parse(localStorage.getItem('likedPlaces') || '[]');
                setIsLiked(likedPlaces.includes(id));
                
            } catch (err) {
                setError(err.message);
                console.error('Error fetching data:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id]);

    const toggleLike = () => {
        const likedPlaces = JSON.parse(localStorage.getItem('likedPlaces') || '[]');
        if (isLiked) {
            const updatedLikes = likedPlaces.filter(placeId => placeId !== id);
            localStorage.setItem('likedPlaces', JSON.stringify(updatedLikes));
        } else {
            likedPlaces.push(id);
            localStorage.setItem('likedPlaces', JSON.stringify(likedPlaces));
        }
        setIsLiked(!isLiked);
    };

    if (loading) return (
        <div className="flex justify-center items-center min-h-screen">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
        </div>
    );

    if (error) return (
        <div className="flex justify-center items-center min-h-screen text-red-500">
            Đã có lỗi xảy ra: {error}
        </div>
    );

    if (!place) return '';
    
    return (
        <div className="max-w-6xl mx-auto px-8 pt-8 pb-12">
            {/* Header */}
            <div className="mb-6">
                <h1 className="text-2xl font-semibold mb-4">{place.title}</h1>
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                                <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
                </svg>
                            <span className="font-medium">0</span>
                <span className="text-gray-500">·</span>
                            <button className="underline bg-transparent">0 đánh giá</button>
                        </div>
                <span className="text-gray-500">·</span>
                        <div className="flex items-center gap-2">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                                <path fillRule="evenodd" d="M11.54 22.351l.07.04.028.016a.76.76 0 00.723 0l.028-.015.071-.041a16.975 16.975 0 001.144-.742 19.58 19.58 0 002.683-2.282c1.944-1.99 3.963-4.98 3.963-8.827a8.25 8.25 0 00-16.5 0c0 3.846 2.02 6.837 3.963 8.827a19.58 19.58 0 002.682 2.282 16.975 16.975 0 001.145.742zM12 13.5a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                            </svg>
                            <span className="underline font-medium">{place.address}</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <button onClick={toggleLike} className="flex items-center gap-2 px-4 py-2 rounded-lg border bg-white">
                            <svg xmlns="http://www.w3.org/2000/svg" fill={isLiked ? "currentColor" : "none"} viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                            </svg>
                            <span>Lưu</span>
                        </button>
                        <button className="flex items-center gap-2 px-4 py-2 rounded-lg border bg-white">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314m0 0a2.25 2.25 0 103.935 2.186 2.25 2.25 0 00-3.935-2.186zm0-12.814a2.25 2.25 0 103.933-2.185 2.25 2.25 0 00-3.933 2.185z" />
                </svg>
                            <span>Chia sẻ</span>
                        </button>
                    </div>
                </div>
            </div>
            
            {/* Gallery */}
            <PlaceGallery place={place} />
            
            {/* Main content */}
            <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr] gap-8 mt-8">
                <div>
                    {/* Host info */}
                    <div className="border-b pb-8">
                        <div className="flex justify-between">
                        <div>
                                <h2 className="text-2xl font-semibold">
                                    {place.type === 'entire' ? 'Toàn bộ căn hộ' : 'Phòng riêng'} tại {place.address}
                                </h2>
                                <div className="flex gap-2 text-gray-500 mt-2">
                                <span>{place.maxGuests} khách</span>
                                <span>·</span>
                                    <span>{place.bedrooms} phòng ngủ</span>
                                <span>·</span>
                                    <span>{place.beds} giường</span>
                                <span>·</span>
                                    <span>{place.bathrooms} phòng tắm</span>
                                </div>
                            </div>
                            <div className="flex-shrink-0">
                                <div className="w-14 h-14 rounded-full overflow-hidden">
                                    <img 
                                        src={place.owner?.avatar || "https://a0.muscache.com/defaults/user_pic-50x50.png?v=3"} 
                                        alt="Host"
                                        className="w-full h-full object-cover"
                                    />
                        </div>
                    </div>
                        </div>
                    </div>

                    {/* Features */}
                    <div className="py-8 border-b">
                        <div className="grid grid-cols-3 gap-4 mb-6">
                            <div className="flex items-center gap-4">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                            </svg>
                        <div>
                                    <div className="font-semibold">Chủ nhà siêu cấp</div>
                                    <div className="text-sm text-gray-500">Chủ nhà có kinh nghiệm</div>
                        </div>
                    </div>
                            <div className="flex items-center gap-4">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                                </svg>
                                <div>
                                    <div className="font-semibold">Địa điểm tuyệt vời</div>
                                    <div className="text-sm text-gray-500">90% khách gần đây đã xếp 5 sao</div>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                                </svg>
                                <div>
                                    <div className="font-semibold">Hủy miễn phí trước 6:00</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Aircover */}
                    <div className="py-8 border-b">
                        <img 
                            src="/logo/logo2.png" 
                            alt="TuanKiet Cover"
                            className="h-7 mb-4"
                        />
                        <div className="mb-2">Mọi đặt phòng đều được bảo vệ miễn phí trong trường hợp Chủ nhà hủy, thông tin nhà/phòng cho thuê không chính xác và những vấn đề khác như sự cố trong quá trình nhận phòng.</div>
                        <button className="underline bg-transparent">Tìm hiểu thêm</button>
                            </div>

                    {/* Description */}
                    <div className="py-8 border-b">
                        <p className="text-gray-600 leading-6">{place.description}</p>
                    </div>

                    {/* Sleeping arrangements */}
                    <div className="py-8 border-b">
                        <h2 className="text-2xl font-semibold mb-4">Nơi bạn sẽ ngủ nghỉ</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {Array.from({length: place.bedrooms || 1}, (_, i) => (
                                <div key={i} className="border rounded-xl p-6">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 mb-4">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5m8.25 3v6.75m0 0l-3-3m3 3l3-3M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
                                                </svg>
                                    <h3 className="font-medium mb-2">Phòng ngủ {i + 1}</h3>
                                    <p className="text-gray-500">1 giường {i === 0 ? 'đôi' : 'đơn'}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Amenities */}
                    <div className="py-8 border-b">
                        <h2 className="text-2xl font-semibold mb-6">Nơi này có những gì cho bạn</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {place.perks?.slice(0, showAllAmenities ? undefined : 8).map((perk, index) => (
                                <div key={index} className="flex gap-4 items-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                        <path strokeLinecap="round" strokeLinejoin="round" d={perk.icon} />
                                    </svg>
                                    <span>{perk.name}</span>
                                </div>
                            ))}
                        </div>
                        {place.perks?.length > 8 && (
                            <button 
                                onClick={() => setShowAllAmenities(!showAllAmenities)}
                                className="mt-6 px-6 py-3 border border-black rounded-lg font-semibold bg-white"
                            >
                                {showAllAmenities ? 'Ẩn bớt' : `Hiển thị tất cả ${place.perks.length} tiện nghi`}
                        </button>
                        )}
                    </div>

                    {/* Location */}
                    <div className="py-8 border-b">
                        <h2 className="text-2xl font-semibold mb-4">Nơi bạn sẽ đến</h2>
                        <AddressLink>{place.address}</AddressLink>
                        <div className="relative mt-4">
                            <div className="aspect-[16/9] rounded-xl overflow-hidden">
                            <iframe
                                    src={`https://maps.google.com/maps?q=${encodeURIComponent(place.address)}&t=&z=13&ie=UTF8&iwloc=&output=embed`}
                                    className="w-full h-full"
                                    frameBorder="0"
                                    scrolling="no"
                                    marginHeight="0"
                                    marginWidth="0"
                            ></iframe>
                            </div>
                            <a 
                                href={`https://maps.google.com/maps?q=${encodeURIComponent(place.address)}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="absolute left-4 bottom-4 bg-white px-4 py-2 rounded-lg shadow-md flex items-center gap-2"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                                </svg>
                                Xem bản đồ lớn hơn
                            </a>
                        </div>
                    </div>

                    {/* Reviews */}
                    <div className="mt-4">
                        <h2 className="text-2xl font-semibold mb-4">
                            <div className="flex items-center gap-2">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                                    <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
                                </svg>
                                <span>0</span>
                                <span>·</span>
                                <button className="underline bg-transparent">0 đánh giá</button>
                            </div>
                        </h2>
                    </div>

                    {/* Things to know */}
                    <div className="py-8">
                        <h2 className="text-2xl font-semibold mb-6">Những điều cần biết</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            <div>
                                <h3 className="font-medium mb-4">Nội quy nhà</h3>
                                <ul className="space-y-4 text-gray-700">
                                    <li className="flex gap-2">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                        <span>Nhận phòng sau 14:00</span>
                                    </li>
                                    <li className="flex gap-2">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                        <span>Trả phòng trước 12:00</span>
                                    </li>
                                    <li className="flex gap-2">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.182 15.182a4.5 4.5 0 01-6.364 0M21 12a9 9 0 11-18 0 9 9 0 0118 0zM9.75 9.75c0 .414-.168.75-.375.75S9 10.164 9 9.75 9.168 9 9.375 9s.375.336.375.75zm-.375 0h.008v.015h-.008V9.75zm5.625 0c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75zm-.375 0h.008v.015h-.008V9.75z" />
                                </svg>
                                        <span>Tối đa {place.maxGuests} khách</span>
                                    </li>
                                </ul>
                            </div>

                            <div>
                                <h3 className="font-medium mb-4">An toàn và chỗ ở</h3>
                                <ul className="space-y-4 text-gray-700">
                                    <li className="flex gap-2">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.362 5.214A8.252 8.252 0 0112 21 8.25 8.25 0 016.038 7.048 8.287 8.287 0 009 9.6a8.983 8.983 0 013.361-6.867 8.21 8.21 0 003 2.48z" />
                                        </svg>
                                        <span>Máy phát hiện khí CO</span>
                                    </li>
                                    <li className="flex gap-2">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.362 5.214A8.252 8.252 0 0112 21 8.25 8.25 0 016.038 7.048 8.287 8.287 0 009 9.6a8.983 8.983 0 013.361-6.867 8.21 8.21 0 003 2.48z" />
                                        </svg>
                                        <span>Máy báo khói</span>
                                    </li>
                                </ul>
                                    </div>

                            <div>
                                <h3 className="font-medium mb-4">Chính sách hủy</h3>
                                <p className="mb-2">Hủy miễn phí trước 6:00.</p>
                                <button className="underline bg-transparent">Tìm hiểu thêm</button>
                            </div>
                            </div>
                        </div>
                    </div>

                {/* Booking widget */}
                <div className="relative">
                    <div className="sticky top-8">
                        <BookingWidget place={place} />
                    </div>
                </div>
            </div>

            {/* Cancellation Policy Modal */}
            {showCancellationModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-8 max-w-2xl w-full mx-4">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-semibold">Chính sách hủy</h2>
                            <button 
                                onClick={() => setShowCancellationModal(false)}
                                className="text-gray-500 hover:text-gray-700"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                                    </button>
                                </div>
                        <div className="space-y-4">
                            <h3 className="font-medium">Hủy miễn phí trước 6:00</h3>
                            <p className="text-gray-700">
                                Bạn có thể hủy đặt phòng miễn phí trước 6:00 ngày nhận phòng. Sau thời gian này, bạn sẽ được hoàn lại 50% tổng số tiền đã thanh toán cho các đêm còn lại.
                            </p>
                            <div className="border-t pt-4">
                                <h3 className="font-medium mb-2">Các trường hợp đặc biệt</h3>
                                <ul className="list-disc pl-5 space-y-2 text-gray-700">
                                    <li>Nếu bạn hủy trong vòng 24 giờ sau khi đặt phòng, bạn sẽ được hoàn tiền 100%.</li>
                                    <li>Nếu bạn nhận phòng và quyết định rời đi sớm, số tiền cho các đêm không ở sẽ không được hoàn lại.</li>
                                    <li>Trong trường hợp bất khả kháng, chúng tôi sẽ xem xét hoàn tiền theo từng trường hợp cụ thể.</li>
                                </ul>
                            </div>
                        </div>
                        <div className="mt-8 flex justify-end">
                            <button 
                                onClick={() => setShowCancellationModal(false)}
                                className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary-dark"
                            >
                                Đã hiểu
                            </button>
                        </div>
                    </div>
                </div>
            )}
            </div>
    );
}
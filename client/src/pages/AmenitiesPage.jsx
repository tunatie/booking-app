import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import { getNextPage, getPreviousPage } from "../utils/pageOrder";
import HeaderActions from "../components/HeaderActions";

export default function AmenitiesPage() {
    const navigate = useNavigate();
    const [selectedAmenities, setSelectedAmenities] = useState([]);
    const [loading, setLoading] = useState(true);

    // Load dữ liệu amenities ban đầu từ API
    useEffect(() => {
        setLoading(true);
        axios.get('/places-form-data')
            .then(({ data }) => {
                // Giả sử dữ liệu tiện nghi lưu trong trường `amenities` hoặc `perks`
                // Kiểm tra cả hai trường
                const amenitiesFromServer = data?.amenities || data?.perks || [];
                setSelectedAmenities(amenitiesFromServer);
                setLoading(false);
            })
            .catch(err => {
                console.error("Error loading initial amenities:", err);
                setLoading(false);
            });
    }, []);

    // Hàm cập nhật amenities trên server (Debounced để tránh gọi API quá nhiều)
    useEffect(() => {
        // Chỉ chạy khi không phải lần load đầu tiên và selectedAmenities đã thay đổi
        if (!loading) {
            const handler = setTimeout(() => {
                // Cập nhật vào cả `amenities` và `perks` cho nhất quán (hoặc chọn 1 trường)
                axios.put('/places-form-data', { amenities: selectedAmenities, perks: selectedAmenities })
                    .catch(err => console.error("Error updating amenities:", err));
            }, 500); // Chờ 500ms sau lần thay đổi cuối cùng

            // Cleanup function để hủy timeout nếu component unmount hoặc state thay đổi lần nữa
            return () => {
                clearTimeout(handler);
            };
        }
    }, [selectedAmenities, loading]);

    function handleNext() {
        const nextPage = getNextPage('amenities');
        if (nextPage) {
            navigate(`/account/hosting/${nextPage}`);
        }
    }

    function handleBack() {
        const prevPage = getPreviousPage('amenities');
        if (prevPage) {
            navigate(`/account/hosting/${prevPage}`);
        }
    }

    const toggleAmenity = (amenityId) => {
        setSelectedAmenities(prev => {
            return prev.includes(amenityId)
                ? prev.filter(id => id !== amenityId)
                : [...prev, amenityId];
        });
    };

    const popularAmenities = [
        { id: 'wifi', name: 'Wi-fi', icon: 'M8.288 15.038a5.25 5.25 0 017.424 0M5.106 11.856c3.807-3.808 9.98-3.808 13.788 0M1.924 8.674c5.565-5.565 14.587-5.565 20.152 0M12.53 18.22l-.53.53-.53-.53a.75.75 0 011.06 0z' },
        { id: 'tv', name: 'TV', icon: 'M6 20.25h12m-7.5-3v3m3-3v3m-10.125-3h17.25c.621 0 1.125-.504 1.125-1.125V4.875c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125z' },
        { id: 'kitchen', name: 'Bếp', icon: 'M12 8.25v-1.5m0 1.5c-1.355 0-2.697.056-4.024.166C6.845 8.51 6 9.473 6 10.608v2.513m6-4.87c1.355 0 2.697.055 4.024.165C17.155 8.51 18 9.473 18 10.608v2.513m-3-4.87v-1.5m-6 1.5v-1.5m12 9.75l-1.5.75a3.354 3.354 0 01-3 0 3.354 3.354 0 00-3 0 3.354 3.354 0 01-3 0 3.354 3.354 0 00-3 0 3.354 3.354 0 01-3 0L3 16.5m15-3.38a48.474 48.474 0 00-6-.37c-2.032 0-4.034.125-6 .37m12 0c.39.049.777.102 1.163.16 1.07.16 1.837 1.094 1.837 2.175v5.17c0 .62-.504 1.124-1.125 1.124H4.125A1.125 1.125 0 013 20.625v-5.17c0-1.08.768-2.014 1.837-2.174A47.78 47.78 0 016 13.12M12.265 3.11a.375.375 0 11-.53 0L12 2.845l.265.265zm-3 0a.375.375 0 11-.53 0L9 2.845l.265.265zm6 0a.375.375 0 11-.53 0L15 2.845l.265.265z' },
        { id: 'washer', name: 'Máy giặt', icon: 'M8.25 3v1.5M4.5 8.25H3m18 0h-1.5M4.5 12H3m18 0h-1.5m-15 3.75H3m18 0h-1.5M8.25 19.5V21M12 3v1.5m0 15V21m3.75-18v1.5m0 15V21m-9-1.5h10.5a2.25 2.25 0 002.25-2.25V6.75a2.25 2.25 0 00-2.25-2.25H6.75A2.25 2.25 0 004.5 6.75v10.5a2.25 2.25 0 002.25 2.25zm.75-12h9v9h-9v-9z' },
        { id: 'parking', name: 'Chỗ đỗ xe miễn phí tại nơi ở', icon: 'M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12' },
        { id: 'paid-parking', name: 'Chỗ đỗ xe có thu phí trong khuôn viên', icon: 'M15 8.25H9m6 3H9m3 6l-3-3h1.5a3 3 0 100-6M13.5 21v-7.5a.75.75 0 01.75-.75h3a.75.75 0 01.75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349m-16.5 11.65V9.35m0 0a3.001 3.001 0 003.75-.615A2.993 2.993 0 009.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 002.25 1.016c.896 0 1.7-.393 2.25-1.016a3.001 3.001 0 003.75.614m-16.5 0a3.004 3.004 0 01-.621-4.72L4.318 3.44A1.5 1.5 0 015.378 3h13.243a1.5 1.5 0 011.06.44l1.19 1.189a3 3 0 01-.621 4.72m-13.5 8.65h3.75a.75.75 0 00.75-.75V13.5a.75.75 0 00-.75-.75H6.75a.75.75 0 00-.75.75v3.75c0 .415.336.75.75.75z' },
        { id: 'workspace', name: 'Không gian riêng để làm việc', icon: 'M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 00.75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 00-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0112 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 01-.673-.38m0 0A2.18 2.18 0 013 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 013.413-.387m7.5 0V5.25A2.25 2.25 0 0013.5 3h-3a2.25 2.25 0 00-2.25 2.25v.894m7.5 0a48.667 48.667 0 00-7.5 0M12 12.75h.008v.008H12v-.008z' }
    ];

    const outdoorAmenities = [
        { id: 'pool', name: 'Bể bơi', icon: 'M7.5 3.75H6A2.25 2.25 0 003.75 6v1.5M16.5 3.75H18A2.25 2.25 0 0120.25 6v1.5m0 9V18A2.25 2.25 0 0118 20.25h-1.5m-9 0H6A2.25 2.25 0 013.75 18v-1.5M15 12a3 3 0 11-6 0 3 3 0 016 0z' },
        { id: 'bbq', name: 'Lò nướng BBQ', icon: 'M12 8.25v-1.5m0 1.5c-1.355 0-2.697.056-4.024.166C6.845 8.51 6 9.473 6 10.608v2.513m6-4.87c1.355 0 2.697.055 4.024.165C17.155 8.51 18 9.473 18 10.608v2.513m-3-4.87v-1.5m-6 1.5v-1.5m12 9.75l-1.5.75a3.354 3.354 0 01-3 0 3.354 3.354 0 00-3 0 3.354 3.354 0 01-3 0 3.354 3.354 0 00-3 0 3.354 3.354 0 01-3 0L3 16.5m15-3.38a48.474 48.474 0 00-6-.37c-2.032 0-4.034.125-6 .37m12 0c.39.049.777.102 1.163.16 1.07.16 1.837 1.094 1.837 2.175v5.17c0 .62-.504 1.124-1.125 1.124H4.125A1.125 1.125 0 013 20.625v-5.17c0-1.08.768-2.014 1.837-2.174A47.78 47.78 0 016 13.12M12.265 3.11a.375.375 0 11-.53 0L12 2.845l.265.265zm-3 0a.375.375 0 11-.53 0L9 2.845l.265.265zm6 0a.375.375 0 11-.53 0L15 2.845l.265.265z' },
        { id: 'outdoor-dining', name: 'Khu vực ăn uống ngoài trời', icon: 'M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5' },
        { id: 'billiards', name: 'Bàn bi-da', icon: 'M12.75 3.03v.568c0 .334.148.65.405.864l1.068.89c.442.369.535 1.01.216 1.49l-.51.766a2.25 2.25 0 01-1.161.886l-.143.048a1.107 1.107 0 00-.57 1.664c.369.555.169 1.307-.427 1.605L9 13.125l.423 1.059a.956.956 0 01-1.652.928l-.679-.906a1.125 1.125 0 00-1.906.172L4.5 15.75l-.612.153M12.75 3.031a9 9 0 00-8.862 12.872M12.75 3.031a9 9 0 016.69 14.036m0 0l-.177-.529A2.25 2.25 0 0017.128 15H16.5l-.324-.324a1.453 1.453 0 00-2.328.377l-.036.073a1.586 1.586 0 01-.982.816l-.99.282c-.55.157-.894.702-.8 1.267l.073.438c.08.474.49.821.97.821.846 0 1.598.542 1.865 1.345l.215.643m5.276-3.67a9.012 9.012 0 01-5.276 3.67m0 0a9 9 0 01-10.275-4.835M15.75 9c0 .896-.393 1.7-1.016 2.25' },
        { id: 'indoor-fireplace', name: 'Lò sưởi trong nhà', icon: 'M15.362 5.214A8.252 8.252 0 0112 21 8.25 8.25 0 016.038 7.048 8.287 8.287 0 009 9.6a8.983 8.983 0 013.361-6.867 8.21 8.21 0 003 2.48z' },
        { id: 'piano', name: 'Đàn piano', icon: 'M9 9l10.5-3m0 6.553v3.75a2.25 2.25 0 01-1.632 2.163l-1.32.377a1.803 1.803 0 11-.99-3.467l2.31-.66a2.25 2.25 0 001.632-2.163zm0 0V2.25L9 5.25v10.303m0 0v3.75a2.25 2.25 0 01-1.632 2.163l-1.32.377a1.803 1.803 0 01-.99-3.467l2.31-.66A2.25 2.25 0 009 15.553z' }
    ];

    const safetyAmenities = [
        { id: 'smoke-alarm', name: 'Máy báo khói', icon: 'M11.42 15.17L17.25 21A2.652 2.652 0 0021 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 11-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 004.486-6.336l-3.276 3.277a3.004 3.004 0 01-2.25-2.25l3.276-3.276a4.5 4.5 0 00-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085m-1.745 1.437L5.909 7.5H4.5L2.25 3.75l1.5-1.5L7.5 4.5v1.409l4.26 4.26m-1.745 1.437l1.745-1.437m6.615 8.206L15.75 15.75M4.867 19.125h.008v.008h-.008v-.008z' },
        { id: 'first-aid', name: 'Bộ sơ cứu', icon: 'M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z' },
        { id: 'fire-extinguisher', name: 'Bình chữa cháy', icon: 'M15.362 5.214A8.252 8.252 0 0112 21 8.25 8.25 0 016.038 7.048 8.287 8.287 0 009 9.6a8.983 8.983 0 013.361-6.867 8.21 8.21 0 003 2.48z' }
    ];

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen pb-24">
            <HeaderActions />
            
            <div className="max-w-[1280px] mx-auto px-20 py-12">
                <h1 className="text-[32px] font-semibold mb-2">
                    Cho khách biết chỗ ở của bạn có những gì
                </h1>
                <p className="text-gray-500 mb-8">
                    Bạn có thể thêm tiện nghi sau khi đăng mục cho thuê.
                </p>

                {/* Popular Amenities */}
                <div className="mb-12">
                    <h2 className="text-lg mb-6">Còn những tiện nghi yêu thích của khách sau đây thì sao?</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {popularAmenities.map(amenity => (
                            <button 
                                key={amenity.id}
                                onClick={() => toggleAmenity(amenity.id)}
                                className={`
                                    flex items-center p-6 border rounded-2xl cursor-pointer transition-all hover:border-gray-300 bg-white
                                    ${selectedAmenities.includes(amenity.id) 
                                        ? 'border-black' 
                                        : 'border-gray-200'
                                    }
                                `}
                            >
                                <div className="flex items-center gap-4">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                                        <path strokeLinecap="round" strokeLinejoin="round" d={amenity.icon} />
                                    </svg>
                                    <span className="font-medium">{amenity.name}</span>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Outdoor Amenities */}
                <div className="mb-12">
                    <h2 className="text-lg mb-6">Bạn có tiện nghi nào nổi bật không?</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {outdoorAmenities.map(amenity => (
                            <button 
                                key={amenity.id}
                                onClick={() => toggleAmenity(amenity.id)}
                                className={`
                                    flex items-center p-6 border rounded-2xl cursor-pointer transition-all hover:border-gray-300 bg-white
                                    ${selectedAmenities.includes(amenity.id) 
                                        ? 'border-black' 
                                        : 'border-gray-200'
                                    }
                                `}
                            >
                                <div className="flex items-center gap-4">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                                        <path strokeLinecap="round" strokeLinejoin="round" d={amenity.icon} />
                                    </svg>
                                    <span className="font-medium">{amenity.name}</span>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Safety Amenities */}
                <div>
                    <h2 className="text-lg mb-6">Bạn có tiện nghi nào trong số những tiện nghi đảm bảo an toàn sau đây không?</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {safetyAmenities.map(amenity => (
                            <button 
                                key={amenity.id}
                                onClick={() => toggleAmenity(amenity.id)}
                                className={`
                                    flex items-center p-6 border rounded-2xl cursor-pointer transition-all hover:border-gray-300 bg-white
                                    ${selectedAmenities.includes(amenity.id) 
                                        ? 'border-black' 
                                        : 'border-gray-200'
                                    }
                                `}
                            >
                                <div className="flex items-center gap-4">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                                        <path strokeLinecap="round" strokeLinejoin="round" d={amenity.icon} />
                                    </svg>
                                    <span className="font-medium">{amenity.name}</span>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Footer */}
            <div className="fixed bottom-0 left-0 right-0 bg-white border-t">
                <div className="max-w-[1280px] mx-auto px-20 py-6 flex justify-between">
                    <button 
                        onClick={handleBack}
                        className="bg-white px-6 py-3 rounded-lg hover:bg-gray-100 border border-black font-medium"
                    >
                        Quay lại
                    </button>
                    <button 
                        onClick={handleNext}
                        className="px-6 py-3 rounded-lg font-medium bg-black text-white hover:bg-[#222222]"
                    >
                        Tiếp theo
                    </button>
                </div>
            </div>
        </div>
    );
} 
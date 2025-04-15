import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "../utils/axios";

export default function HostingPage() {
    const [places, setPlaces] = useState([]);

    useEffect(() => {
        loadPlaces();
    }, []);

    async function loadPlaces() {
        try {
            const { data } = await axios.get('/user-places');
            setPlaces(data);
        } catch (error) {
            console.error('Error fetching places:', error);
        }
    }

    return (
        <div className="min-h-screen bg-white">
            {/* Welcome Section */}
            <div className="max-w-6xl mx-auto px-4 py-8">
                <h1 className="text-3xl font-semibold mb-6">Chào mừng quay trở lại</h1>
                
                {/* Quick Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                    <div className="bg-gray-50 p-4 rounded-lg">
                        <h3 className="text-lg font-medium">Số phòng (đã đăng)</h3>
                        <p className="text-2xl font-bold mt-2">{places.length}</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                        <h3 className="text-lg font-medium">Đặt phòng mới</h3>
                        <p className="text-2xl font-bold mt-2">0</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                        <h3 className="text-lg font-medium">Tin nhắn chưa đọc</h3>
                        <p className="text-2xl font-bold mt-2">0</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                        <h3 className="text-lg font-medium">Đánh giá mới</h3>
                        <p className="text-2xl font-bold mt-2">0</p>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-4 mb-8">
                    <Link to="/account/hosting/new" 
                        className="inline-flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary/90">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                        </svg>
                        Đăng phòng mới
                    </Link>
                </div>

                {/* Properties Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {places.length > 0 && places.map(place => (
                        <Link to={'/account/hosting/'+place._id} key={place._id} 
                            className="block bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-shadow">
                            <div className="aspect-video relative overflow-hidden">
                                {place.photos?.[0] && (
                                    <img 
                                        className="object-cover w-full h-full" 
                                        src={'http://localhost:4000/uploads/'+place.photos[0]} 
                                        alt=""
                                    />
                                )}
                            </div>
                            <div className="p-4">
                                <h2 className="text-xl font-semibold mb-2 line-clamp-1">{place.title}</h2>
                                <p className="text-gray-500 text-sm mb-2 line-clamp-2">{place.description}</p>
                                <div className="flex items-center justify-between">
                                    <span className="text-lg font-semibold">{place.price?.toLocaleString('vi-VN')} VNĐ</span>
                                    <span className="text-sm text-gray-500">/ đêm</span>
                                </div>
                                <div className="mt-2 flex items-center gap-2">
                                    {place.status === 'pending' && (
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                            Chờ xác nhận
                                        </span>
                                    )}
                                    {place.status === 'confirmed' && (
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                            Đang cho thuê
                                        </span>
                                    )}
                                    {place.status === 'cancelled' && (
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                            Đã hủy
                                        </span>
                                    )}
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>

                {/* Empty State */}
                {places.length === 0 && (
                    <div className="text-center py-12">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" 
                            className="w-16 h-16 mx-auto text-gray-400 mb-4">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 21v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21m0 0h4.5V3.545M12.75 21h7.5V10.75M2.25 21h1.5m18 0h-18M2.25 9l4.5-1.636M18.75 3l-1.5.545m0 6.205l3 1m1.5.5l-1.5-.5M6.75 7.364V3h-3v18m3-13.636l10.5-3.819" />
                        </svg>
                        <h3 className="text-xl font-medium text-gray-900 mb-2">Bạn chưa có phòng nào</h3>
                        <p className="text-gray-500 mb-6">Hãy bắt đầu bằng việc đăng phòng đầu tiên của bạn</p>
                        <Link to="/account/hosting/new" 
                            className="inline-flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary/90">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                            </svg>
                            Đăng phòng ngay
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
} 
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "../utils/axios";
import { API_BASE_URL } from '../config';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';

export default function ListingsPage() {
    const [places, setPlaces] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        loadPlaces();
    }, []);

    async function loadPlaces() {
        try {
            // Kiểm tra xác thực trước
            const profileResponse = await axios.get('/profile');
            if (!profileResponse.data) {
                navigate('/login');
                return;
            }

            const { data } = await axios.get('/user-places');
            setPlaces(data);
        } catch (error) {
            console.error('Error loading places:', error);
            if (error.response?.status === 401) {
                navigate('/login');
            }
        } finally {
            setLoading(false);
        }
    }

    const getStatusInfo = (place) => {
        if (place.draft) {
            return {
                text: "Bản nháp",
                color: "text-gray-600",
                bgColor: "bg-gray-50",
                icon: (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                    </svg>
                )
            };
        }

        // Kiểm tra xem nhà/phòng đã hoàn tất thông tin chưa
        const requiredFields = ['title', 'address', 'photos', 'description', 'price'];
        const isComplete = requiredFields.every(field => {
            if (field === 'photos') {
                return place[field] && place[field].length > 0;
            }
            return place[field] && place[field].toString().trim() !== '';
        });

        if (!isComplete) {
            return {
                text: "Chờ hoàn tất",
                color: "text-yellow-600",
                bgColor: "bg-yellow-50",
                icon: (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                    </svg>
                )
            };
        }

        return {
            text: "Đã đăng",
            color: "text-green-600",
            bgColor: "bg-green-50",
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                </svg>
            )
        };
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white">
            <div className="max-w-6xl mx-auto px-4 py-8">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-semibold">Nhà/phòng cho thuê</h1>
                    <Link 
                        to="/account/hosting/overview" 
                        className="inline-flex items-center gap-2 bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary-dark"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                        </svg>
                        Tạo mục cho thuê mới
                    </Link>
                </div>

                {places.length === 0 ? (
                    <div className="text-center py-12">
                        <h3 className="text-xl font-medium mb-2">Bạn chưa có mục cho thuê nào</h3>
                        <p className="text-gray-500 mb-6">Bắt đầu bằng cách tạo mục cho thuê đầu tiên của bạn</p>
                        <Link 
                            to="/account/hosting/overview"
                            className="inline-flex items-center gap-2 bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary-dark"
                        >
                            Tạo mục cho thuê
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {places.map(place => {
                            const statusInfo = getStatusInfo(place);
                            return (
                                <div key={place._id} className="border rounded-xl overflow-hidden hover:shadow-lg transition-shadow">
                                    <div className="aspect-video relative overflow-hidden">
                                        {place.photos?.[0] ? (
                                            <img 
                                                src={`${API_BASE_URL}/uploads/${place.photos[0]}`}
                                                alt={place.title}
                                                className="object-cover w-full h-full"
                                            />
                                        ) : (
                                            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12 text-gray-400">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
                                                </svg>
                                            </div>
                                        )}
                                        <Link 
                                            to={`/account/hosting/${place._id}`}
                                            className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-10 transition-opacity"
                                        />
                                    </div>
                                    <div className="p-4">
                                        <h3 className="font-medium mb-1">{place.title}</h3>
                                        <p className="text-sm text-gray-500 mb-2">{place.address}</p>
                                        <div className="flex items-center justify-between">
                                            <span className="text-primary font-medium">${place.price}</span>
                                            <div className={`flex items-center gap-1 text-sm px-2 py-1 rounded-full ${statusInfo.color} ${statusInfo.bgColor}`}>
                                                {statusInfo.icon}
                                                <span>{statusInfo.text}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
} 
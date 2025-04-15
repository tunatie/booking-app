import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "../utils/axios";

export default function ProfilePage() {
    const [profile, setProfile] = useState(null);
    const [places, setPlaces] = useState([]);

    useEffect(() => {
        loadProfile();
        loadPlaces();
    }, []);

    async function loadProfile() {
        try {
            const { data } = await axios.get('/profile');
            setProfile(data);
        } catch (error) {
            console.error('Error fetching profile:', error);
        }
    }

    async function loadPlaces() {
        try {
            const { data } = await axios.get('/user-places');
            setPlaces(data);
        } catch (error) {
            console.error('Error fetching places:', error);
        }
    }

    if (!profile) {
        return 'Loading...';
    }

    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            <div className="flex gap-8">
                {/* Left Column */}
                <div className="w-1/3">
                    <div className="flex flex-col items-center">
                        <div className="w-32 h-32 rounded-full overflow-hidden">
                            {profile.avatar ? (
                                <img 
                                    src={`http://localhost:4000/uploads/${profile.avatar}`}
                                    alt={profile.name}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="w-full h-full bg-gray-900 text-white flex items-center justify-center text-5xl font-medium">
                                    {profile.name?.[0]?.toUpperCase() || 'T'}
                                </div>
                            )}
                        </div>
                        <h2 className="mt-4 text-2xl font-medium">{profile.name || 'Tuấn'}</h2>
                        <p className="text-gray-500">Chủ nhà/Người cho thuê</p>
                    </div>

                    <div className="mt-8">
                        <h3 className="text-lg font-medium mb-4">Thông tin đã được xác nhận</h3>
                        <div className="space-y-3">
                            <div className="flex items-center gap-2">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                                </svg>
                                <span>Danh tính</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                                </svg>
                                <span>Địa chỉ email</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                                </svg>
                                <span>Số điện thoại</span>
                            </div>
                        </div>
                        <Link to="/account/verification" className="text-sm text-gray-600 hover:underline block mt-4">
                            Tìm hiểu về quy trình xác minh danh tính
                        </Link>
                    </div>
                </div>

                {/* Right Column */}
                <div className="w-2/3">
                    <div className="bg-gray-50 p-6 rounded-xl">
                        <h2 className="text-2xl font-medium mb-2">Đã đến lúc tạo hồ sơ của bạn</h2>
                        <p className="text-gray-600 mb-4">
                            Hồ sơ của bạn là một phần quan trọng của mỗi đặt phòng của bạn. 
                            Hãy chia sẻ một vài thông tin về bản thân để giúp các chủ nhà và khách khác tìm hiểu về bạn.
                        </p>
                        <Link 
                            to="/account/profile/edit" 
                            className="inline-flex items-center justify-center px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90"
                        >
                            Tạo hồ sơ
                        </Link>
                    </div>

                    <div className="mt-8">
                        <h3 className="text-xl font-medium mb-4">Mục cho thuê của {profile.name || 'Tuấn'}</h3>
                        <div className="grid grid-cols-2 gap-4">
                            {places.map(place => (
                                <Link key={place._id} to={'/place/'+place._id} className="block">
                                    <div className="aspect-video rounded-xl overflow-hidden">
                                        {place.photos?.[0] && (
                                            <img 
                                                className="object-cover w-full h-full" 
                                                src={'http://localhost:4000/uploads/'+place.photos[0]} 
                                                alt=""
                                            />
                                        )}
                                    </div>
                                    <h3 className="font-medium mt-2">{place.title}</h3>
                                    <p className="text-sm text-gray-500">{place.price?.toLocaleString('vi-VN')} VNĐ/đêm</p>
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
} 
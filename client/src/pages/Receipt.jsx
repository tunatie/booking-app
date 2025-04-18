import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../utils/axios';
import HeaderActions from '../components/HeaderActions';
import { getNextPage, getPreviousPage } from '../utils/pageOrder';
import { API_BASE_URL } from '../config';

export default function Receipt() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [placeData, setPlaceData] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        console.log('Component mounted');
        loadPlaceData();
    }, []);

    const loadPlaceData = async () => {
        console.log('Starting to load place data...');
        try {
            setLoading(true);
            setError(null);
            
            // Log the request URL
            console.log('Making request to:', `${API_BASE_URL}/api/places-form-data`);
            
            const response = await axios.get('/api/places-form-data');
            console.log('Full API Response:', response);
            
            const { data } = response;
            console.log('Place Data:', data);
            
            if (data?.photos) {
                console.log('Photos found:', data.photos);
                console.log('First photo URL will be:', `${API_BASE_URL}/uploads/${data.photos[0]}`);
            } else {
                console.log('No photos found in response');
            }
            
            setPlaceData(data);
        } catch (err) {
            console.error('Error details:', {
                message: err.message,
                response: err.response,
                status: err.response?.status,
                data: err.response?.data
            });
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    function handleNext() {
        const nextPage = getNextPage('receipt');
        if (nextPage) {
            navigate(`/account/hosting/${nextPage}`);
        }
    }

    function handleBack() {
        const prevPage = getPreviousPage('receipt');
        if (prevPage) {
            navigate(`/account/hosting/${prevPage}`);
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen flex flex-col">
                <HeaderActions />
                <div className="flex-1 flex justify-center items-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex flex-col">
                <HeaderActions />
                <div className="flex-1 flex justify-center items-center flex-col gap-4">
                    <p className="text-red-500">Error: {error}</p>
                    <button 
                        onClick={loadPlaceData}
                        className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark"
                    >
                        Thử lại
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col">
            <HeaderActions />
            
            <div className="flex-1 pt-[48px] pb-[88px]">
                <div className="w-full max-w-[1280px] mx-auto px-20">
                    <h1 className="text-[32px] font-semibold mb-4">
                        Thật tuyệt! Đã đến lúc đăng cho thuê.
                    </h1>
                    <p className="text-gray-500 mb-12">
                        Dưới đây là những thông tin mà chúng tôi sẽ hiển thị cho khách. Hãy đảm bảo bạn đã kiểm tra kỹ những tin trước khi đăng.
                    </p>

                    <div className="grid grid-cols-2 gap-12">
                        {/* Left Column - Preview */}
                        <div className="space-y-8">
                            <div className="bg-white rounded-xl p-6 shadow-sm border">
                                <h3 className="font-semibold mb-4">Hiển thị bản xem trước</h3>
                                {placeData?.photos && placeData.photos.length > 0 ? (
                                    <div className="aspect-[4/3] mb-4 rounded-xl overflow-hidden">
                                        <img 
                                            src={`${API_BASE_URL}/uploads/${placeData.photos[0]}`}
                                            alt="Preview"
                                            className="w-full h-full object-cover"
                                            onError={(e) => {
                                                console.error('Image load error for URL:', e.target.src);
                                                e.target.src = 'https://via.placeholder.com/400x300?text=No+Image';
                                            }}
                                        />
                                    </div>
                                ) : (
                                    <div className="aspect-[4/3] mb-4 rounded-xl overflow-hidden bg-gray-100 flex items-center justify-center">
                                        <p className="text-gray-400">
                                            {placeData?.photos ? 'Chưa có ảnh' : 'Đang tải...'}
                                        </p>
                                    </div>
                                )}
                                <div className="space-y-2">
                                    <p className="font-medium">{placeData?.title || 'Chưa có tiêu đề'}</p>
                                    <p className="text-gray-500">{placeData?.address || 'Chưa có địa chỉ'}</p>
                                    <p className="text-gray-500">{placeData?.description || 'Chưa có mô tả'}</p>
                                </div>
                            </div>
                        </div>

                        {/* Right Column - Next Steps */}
                        <div className="space-y-8">
                            <h2 className="text-2xl font-semibold">Tiếp theo là gì?</h2>
                            
                            <div className="space-y-6">
                                <div className="flex gap-4">
                                    <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h3 className="font-medium">Thiết lập lịch</h3>
                                        <p className="text-gray-500 text-sm">Chọn ngày đón tiếp khách. Sau 24 giờ sẽ có thời điểm bạn đồng ý khách có thể đặt chỗ ở của bạn.</p>
                                    </div>
                                </div>

                                <div className="flex gap-4">
                                    <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h3 className="font-medium">Điều chỉnh các chế độ cài đặt của bạn</h3>
                                        <p className="text-gray-500 text-sm">Đặt ra nội quy nhà, chọn chính sách hủy, chọn cách thức đặt phòng của khách và nhiều chế độ khác.</p>
                                    </div>
                                </div>

                                <div className="flex gap-4">
                                    <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 01-.825-.242m9.345-8.334a2.126 2.126 0 00-.476-.095 48.64 48.64 0 00-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0011.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h3 className="font-medium">Chuẩn bị đón vị khách đầu tiên</h3>
                                        <p className="text-gray-500 text-sm">Tìm hiểu các mẹo trong hướng dẫn để nguyên cứu chung tôi hoặc nhận sự hướng dẫn trực tiếp từ một Chủ nhà siêu cấp.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
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
                        className="px-6 py-3 rounded-lg font-medium bg-primary text-white hover:bg-primary-dark"
                    >
                        Đăng
                    </button>
                </div>
            </div>
        </div>
    );
} 
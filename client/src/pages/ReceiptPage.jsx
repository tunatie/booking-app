import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useProgress } from "../HostLayout";
import HeaderActions from "../components/HeaderActions";
import { getNextPage, getPreviousPage, getPageProgress } from "../utils/pageOrder";
import axios from "axios";

export default function ReceiptPage() {
    const { setProgress } = useProgress();
    const navigate = useNavigate();
    const [place, setPlace] = useState(null);
    const [showPreview, setShowPreview] = useState(false);

    useEffect(() => {
        const progress = getPageProgress('receipt');
        setProgress(progress);

        // Fetch the place data
        axios.get('/places-form-data').then(({data}) => {
            setPlace(data);
        }).catch(error => {
            console.error('Error fetching place data:', error);
        });
    }, [setProgress]);

    const handleNext = () => {
        const nextPage = getNextPage('receipt');
        if (nextPage) {
            navigate(`/account/hosting/${nextPage}`);
        }
    };

    const handleBack = () => {
        const prevPage = getPreviousPage('receipt');
        if (prevPage) {
            navigate(`/account/hosting/${prevPage}`);
        }
    };

    async function handlePublish() {
        try {
            // Get current draft data
            const { data: formData } = await axios.get('/places-form-data');
            
            // Create a new published place from the draft data
            await axios.post('/places', {
                ...formData,
                draft: false
            });
            
            // Clear the draft data after publishing
            await axios.delete('/places-form-data');
            
            // Navigate to celebration page
            navigate('/account/hosting/celebration');
        } catch (error) {
            console.error('Error publishing place:', error);
            alert('Đã xảy ra lỗi khi đăng phòng. Vui lòng thử lại sau.');
        }
    }

    return (
        <div className="min-h-screen">
            <div className="max-w-[1280px] mx-auto px-20 pt-12 pb-32">
                <h1 className="text-[32px] font-semibold mb-4">
                    Thật tuyệt! Đã đến lúc đăng cho thuê.
                </h1>
                <p className="text-gray-500 mb-12">
                    Dưới đây là những thông tin mà chúng tôi sẽ hiển thị cho khách. Hãy đảm bảo bạn đã kiểm tra kỹ thông tin trước khi đăng.
                </p>

                <div className="grid grid-cols-[1fr,1fr] gap-20">
                    {/* Left Column */}
                    <div>
                        <div 
                            className="bg-white rounded-xl border hover:shadow-lg transition-shadow cursor-pointer"
                            onClick={() => setShowPreview(true)}
                        >
                            <div className="relative">
                                <div className="absolute top-4 left-4 bg-white rounded-lg px-4 py-2 text-sm shadow-md z-10">
                                    Hiển thị bản xem trước
                                </div>
                                {place?.photos?.length > 0 && (
                                    <img 
                                        src={'http://localhost:4000/uploads/' + place.photos[0]}
                                        alt=""
                                        className="w-full aspect-[4/3] object-cover"
                                    />
                                )}
                            </div>
                            <div className="p-6">
                                <div className="flex items-center justify-between mb-2">
                                    <p className="text-[15px] text-gray-800 line-through">đ{place?.price ? `${place.price.toLocaleString('vi-VN')}` : ''}</p>
                                    <span className="text-[14px] bg-gray-100 px-3 py-1 rounded-full">Mới ★</span>
                                </div>
                                <div className="flex items-baseline gap-1">
                                    <span className="text-[17px] font-semibold">đ{place?.price ? (place.price * 0.8).toLocaleString('vi-VN') : ''}</span>
                                    <span className="text-[15px]">đêm</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column */}
                    <div>
                        <h2 className="text-2xl font-semibold mb-6">Tiếp theo là gì?</h2>
                        <div className="space-y-8">
                            <div className="flex gap-4">
                                <div className="flex-shrink-0">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" className="w-8 h-8 fill-current">
                                        <path d="M11.67 0v1.67h8.66V0h2v1.67h6a2 2 0 0 1 2 1.85v16.07a2 2 0 0 1-.46 1.28l-.12.13L21 29.75a2 2 0 0 1-1.24.58H6.67a5 5 0 0 1-5-4.78V3.67a2 2 0 0 1 1.85-2h6.15V0zm16.66 11.67H3.67v13.66a3 3 0 0 0 2.82 3h11.18v-5.66a5 5 0 0 1 4.78-5h5.88zm-.08 8h-5.58a3 3 0 0 0-3 2.82v5.76zm-18.58-16h-6v6h24.66v-6h-6v1.66h-2V3.67h-8.66v1.66h-2z"/>
                                    </svg>
                                </div>
                                <div>
                                    <h3 className="font-semibold mb-2">Thiết lập lịch</h3>
                                    <p className="text-gray-500">Chọn ngày đón tiếp khách. Sau 24 giờ kể từ thời điểm bạn đăng, khách có thể đặt chỗ ở của bạn.</p>
                                </div>
                            </div>

                            <div className="flex gap-4">
                                <div className="flex-shrink-0">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" className="w-8 h-8 fill-current">
                                        <path d="M20.8 4.8a4.54 4.54 0 0 1 6.57 6.24l-.16.17L9 29.4a2 2 0 0 1-1.24.58L7.6 30H2v-5.59a2 2 0 0 1 .47-1.28l.12-.13zM19 9.4l-15 15V28h3.59l15-15zm6.8-3.2a2.54 2.54 0 0 0-3.46-.13l-.13.13L20.4 8 24 11.59l1.8-1.8c.94-.94.98-2.45.12-3.45z"/>
                                    </svg>
                                </div>
                                <div>
                                    <h3 className="font-semibold mb-2">Điều chỉnh các chế độ cài đặt của bạn</h3>
                                    <p className="text-gray-500">Đặt ra nội quy nhà, chọn chính sách hủy, chọn cách thức đặt phòng của khách và nhiều chế độ khác.</p>
                                </div>
                            </div>

                            <div className="flex gap-4">
                                <div className="flex-shrink-0">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" className="w-8 h-8 fill-current">
                                        <path d="M11 31v-9.07a8 8 0 0 1 1.75-14.6 4 4 0 1 1 6.73-.35A6 6 0 0 0 25 1.23V1h2a8 8 0 0 1-7.75 8H17V6.73a2 2 0 1 0-2 0V9a6 6 0 0 0-4 10.47V13h2v16h2v-9h2v9h2V13h2v18H11z"/>
                                    </svg>
                                </div>
                                <div>
                                    <h3 className="font-semibold mb-2">Chuẩn bị đón vị khách đầu tiên</h3>
                                    <p className="text-gray-500">Tìm hiểu các mẹo trong Trung tâm tài nguyên của chúng tôi hoặc nhận sự hướng dẫn trực tiếp từ một Chủ nhà siêu cấp.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Preview Modal */}
            {showPreview && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
                    <div className="bg-white rounded-2xl w-[800px] overflow-hidden">
                        <div className="flex items-center h-[64px] px-6 border-b relative">
                            <button 
                                onClick={() => setShowPreview(false)}
                                className="absolute left-6 bg-white hover:bg-gray-100 rounded-full p-2 border"
                            >
                                <svg viewBox="0 0 32 32" className="w-4 h-4 fill-current">
                                    <path d="M6 6L26 26M26 6L6 26" stroke="currentColor" strokeWidth="2.5" fill="none"/>
                                </svg>
                            </button>
                            <h2 className="flex-1 text-center text-base">Bản xem trước đầy đủ</h2>
                        </div>

                        <div className="flex">
                            {/* Left - Image */}
                            <div className="w-[320px] pt-8 px-6 pb-6">
                                {place?.photos?.length > 0 && (
                                    <img 
                                        src={'http://localhost:4000/uploads/' + place.photos[0]}
                                        alt=""
                                        className="w-full aspect-[4/3] object-cover rounded-lg"
                                    />
                                )}
                            </div>

                            {/* Right - Content */}
                            <div className="flex-1 pt-8 pr-6 pb-6 pl-2">
                                <div>
                                    <h3 className="text-[22px] font-normal leading-7">{place?.title || 'dsfdvs cxv'}</h3>
                                    <p className="mt-1 text-[15px]">Nhà theo phong cách Cycladic. Chủ nhà Tuấn</p>
                                    <p className="mt-1 text-[14px] text-gray-500">4 khách · 1 phòng ngủ · 1 giường · 1 phòng tắm</p>
                                </div>
                                
                                <div className="mt-5">
                                    <p className="text-[15px]">Đưa cả gia đình đến nơi ở tuyệt vời này với rất nhiều không gian vui chơi.</p>
                                </div>

                                <div className="mt-5">
                                    <h4 className="font-medium mb-1">Vị trí</h4>
                                    <p className="text-[15px]">QMF5+MR9, Quận 10, Hồ Chí Minh, Việt Nam</p>
                                    <p className="mt-2 text-[14px] text-gray-500">
                                        Chúng tôi sẽ chỉ chia sẻ địa chỉ của bạn với những khách đã đặt phòng theo quy định trong chính sách quyền riêng tư của chúng tôi.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <div className="fixed bottom-0 left-0 right-0 bg-white border-t">
                <div className="max-w-[1280px] mx-auto px-20 py-6 flex justify-between">
                    <Link to={`/account/hosting/${getPreviousPage('receipt')}`} className="bg-white hover:bg-gray-100 py-2 px-4 rounded-lg border">
                        Quay lại
                    </Link>
                    <button 
                        onClick={handlePublish}
                        className="bg-primary hover:bg-primary-dark text-white py-2 px-8 rounded-lg"
                    >
                        Đăng
                    </button>
                </div>
            </div>
        </div>
    );
} 
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import HeaderActions from "../components/HeaderActions";
import axios from "../utils/axios";
import { useForm } from "../contexts/FormContext";
import { API_BASE_URL } from '../config';
import { getPreviousRoute, getNextRoute, getFallbackRoute } from '../utils/navigation';

export default function ReceiptPage() {
    const navigate = useNavigate();
    const { formData } = useForm();
    const [loading, setLoading] = useState(true);
    const [showPreview, setShowPreview] = useState(false);

    // Debug log
    useEffect(() => {
        console.log('FormContext Data:', formData);
    }, [formData]);

    // Check if we have all required data
    useEffect(() => {
        if (!formData) {
            console.log('No form data, redirecting to fallback route');
            alert('Không tìm thấy dữ liệu. Vui lòng thử lại.');
            navigate(getFallbackRoute('receipt'), { replace: true });
            return;
        }
        setLoading(false);
    }, [formData, navigate]);

    const handleBack = () => {
        const prevRoute = getPreviousRoute('receipt');
        if (prevRoute) {
            navigate(prevRoute, { replace: true });
        }
    };

    async function handlePublish() {
        if (!formData) {
            alert('Không tìm thấy dữ liệu. Vui lòng thử lại.');
            return;
        }

        try {
            setLoading(true);
            console.log('Publishing place with data:', formData);

            // Format the data before sending
            const placeData = {
                title: formData.title,
                description: formData.description,
                address: formData.address,
                photos: formData.photos || [],
                perks: formData.amenities || [],
                extraInfo: '',
                checkIn: '14:00',
                checkOut: '12:00',
                maxGuests: formData.floorPlan?.guests || 1,
                price: Number(formData.price) || 0,
                propertyType: formData.propertyType,
                privacyType: formData.privacyType,
                location: formData.location,
                floorPlan: formData.floorPlan,
                security: formData.security,
                standOut: formData.standOut || [],
                draft: false
            };

            console.log('Formatted place data:', placeData);
            
            // Create a new published place
            const response = await axios.post('/places', placeData);
            console.log('Place created successfully:', response.data);
            
            // Clear the draft data after publishing
            await axios.delete('/places-form-data');
            
            // Navigate to celebration page
            const nextRoute = getNextRoute('receipt');
            if (nextRoute) {
                navigate(nextRoute, { replace: true });
            }
        } catch (error) {
            console.error('Error publishing place:', error);
            if (error.response) {
                console.error('Error response:', error.response.data);
                alert(`Đã xảy ra lỗi khi đăng phòng: ${error.response.data.message || 'Vui lòng thử lại sau'}`);
            } else {
                alert('Đã xảy ra lỗi khi đăng phòng. Vui lòng thử lại sau.');
            }
        } finally {
            setLoading(false);
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen flex flex-col">
                <HeaderActions />
                <div className="flex-1 flex justify-center items-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
                </div>
                <div className="fixed bottom-0 left-0 right-0 bg-white border-t">
                    <div className="max-w-[1280px] mx-auto px-20 py-6 flex justify-between">
                        <button 
                            onClick={handleBack}
                            className="bg-white px-6 py-3 rounded-lg hover:bg-gray-100 border border-black font-medium"
                        >
                            Quay lại
                        </button>
                        <button 
                            className="px-6 py-3 rounded-lg font-medium bg-gray-300 text-gray-500 cursor-not-allowed"
                            disabled
                        >
                            Đăng
                        </button>
                    </div>
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
                                    {formData?.photos?.length > 0 && (
                                        <img 
                                            src={`${API_BASE_URL}/uploads/${formData.photos[0]}`}
                                            alt=""
                                            className="w-full aspect-[4/3] object-cover rounded-t-xl"
                                        />
                                    )}
                                </div>
                                <div className="p-6">
                                    <div className="flex items-center justify-between mb-2">
                                        <p className="text-[15px] text-gray-800 line-through">đ{formData?.price ? `${formData.price.toLocaleString('vi-VN')}` : ''}</p>
                                        <span className="text-[14px] bg-gray-100 px-3 py-1 rounded-full">Mới ★</span>
                                    </div>
                                    <div className="flex items-baseline gap-1">
                                        <span className="text-[17px] font-semibold">đ{formData?.price ? (formData.price * 0.8).toLocaleString('vi-VN') : ''}</span>
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
                                        <h3 className="font-semibold mb-2">Hoàn thiện hồ sơ</h3>
                                        <p className="text-gray-500">Thêm thông tin cá nhân và các tài liệu cần thiết để xác minh danh tính của bạn.</p>
                                    </div>
                                </div>

                                <div className="flex gap-4">
                                    <div className="flex-shrink-0">
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" className="w-8 h-8 fill-current">
                                            <path d="M16 0a16 16 0 1 1 0 32 16 16 0 0 1 0-32zm0 2A14 14 0 1 0 30 16 14 14 0 0 0 16 2zm5.3 7.3-8.6 8.7-4-4.1L7.3 15.3l5.4 5.4 10-10.1z"/>
                                        </svg>
                                    </div>
                                    <div>
                                        <h3 className="font-semibold mb-2">Chờ phê duyệt</h3>
                                        <p className="text-gray-500">Chúng tôi sẽ xem xét thông tin của bạn và thông báo khi chỗ ở được duyệt.</p>
                                    </div>
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
                                {formData?.photos?.length > 0 && (
                                    <img 
                                        src={`${API_BASE_URL}/uploads/${formData.photos[0]}`}
                                        alt=""
                                        className="w-full aspect-[4/3] object-cover rounded-lg"
                                    />
                                )}
                            </div>

                            {/* Right - Content */}
                            <div className="flex-1 pt-8 pr-6 pb-6 pl-2">
                                <div>
                                    <h3 className="text-[22px] font-normal leading-7">{formData.title}</h3>
                                    <p className="mt-1 text-[15px]">Nhà theo phong cách {formData.propertyType}</p>
                                    <p className="mt-1 text-[14px] text-gray-500">
                                        {formData.floorPlan?.guests} khách · {formData.floorPlan?.bedrooms} phòng ngủ · {formData.floorPlan?.beds} giường · {formData.floorPlan?.bathrooms} phòng tắm
                                    </p>
                                </div>
                                
                                <div className="mt-5">
                                    <p className="text-[15px]">{formData.description}</p>
                                </div>

                                <div className="mt-5">
                                    <h4 className="font-medium mb-1">Vị trí</h4>
                                    <p className="text-[15px]">{formData.address}</p>
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
                    <button
                        onClick={handleBack}
                        className="bg-white px-6 py-3 rounded-lg hover:bg-gray-100 border border-black font-medium"
                    >
                        Quay lại
                    </button>
                    <button
                        onClick={handlePublish}
                        className="px-6 py-3 rounded-lg font-medium bg-black text-white hover:bg-[#222222]"
                    >
                        Đăng
                    </button>
                </div>
            </div>
        </div>
    );
} 
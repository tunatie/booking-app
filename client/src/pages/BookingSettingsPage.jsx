import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from '../utils/axios';
import { useProgress } from "../contexts/ProgressContext";
import HeaderActions from "../components/HeaderActions";
import { getNextPage, getPreviousPage, getPageProgress } from "../utils/pageOrder";
import ToggleSwitch from '../components/ToggleSwitch';

export default function BookingSettingsPage() {
    const { setProgress } = useProgress();
    const navigate = useNavigate();
    const [selectedOption, setSelectedOption] = useState('review');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        axios.get('/places-form-data')
            .then(({ data }) => {
                setSelectedOption(data?.bookingSettings?.bookingType || 'review');
                setLoading(false);
            })
            .catch(err => {
                console.error("Error loading initial booking settings:", err);
                setLoading(false);
            });

        const progress = getPageProgress('booking-settings');
        setProgress(progress);
    }, [setProgress]);

    async function updateBookingType(option) {
        setSelectedOption(option);
        try {
            await axios.put('/places-form-data', { 
                bookingSettings: { 
                    bookingType: option
                } 
            });
        } catch (err) {
            console.error("Error updating booking type:", err);
        }
    }

    const handleNext = () => {
        const nextPage = getNextPage('booking-settings');
        if (nextPage) {
            navigate(`/account/hosting/${nextPage}`);
        }
    };

    const handleBack = () => {
        const prevPage = getPreviousPage('booking-settings');
        if (prevPage) {
            navigate(`/account/hosting/${prevPage}`);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col">
            <HeaderActions />
            
            <div className="flex-1 pt-[48px] pb-[88px] flex items-center">
                <div className="w-full max-w-[640px] mx-auto px-20">
                    <h1 className="text-[32px] font-semibold mb-4">
                        Chọn cài đặt đặt phòng
                    </h1>
                    <p className="text-gray-500 mb-1">
                        Bạn có thể thay đổi cài đặt này bất kỳ lúc nào. 
                        <Link to="#" className="underline ml-1">Tìm hiểu thêm</Link>
                    </p>

                    <div className="mt-8 space-y-4">
                        <button 
                            onClick={() => updateBookingType('review')}
                            className={`w-full p-6 border rounded-2xl text-left transition-all ${
                                selectedOption === 'review' 
                                    ? 'border-black bg-[#F7F7F7]' 
                                    : 'border border-gray-200 bg-white hover:bg-[#F7F7F7]'
                            }`}
                            disabled={loading}
                        >
                            <div className="flex justify-between items-start gap-4">
                                <div>
                                    <h3 className="text-lg font-medium mb-1">Chấp thuận 5 lượt đặt phòng đầu tiên</h3>
                                    <span className="text-sm text-green-600 font-medium">Được đề xuất</span>
                                    <p className="text-gray-500 mt-2 text-sm">
                                        Bạn đầu, hãy xem xét các yêu cầu đặt phòng, sau đó chuyển sang chế độ Đặt ngay để khách có thể đặt phòng tự động.
                                    </p>
                                </div>
                                <div className="text-2xl">📋</div>
                            </div>
                        </button>

                        <button 
                            onClick={() => updateBookingType('instant')}
                            className={`w-full p-6 border rounded-2xl text-left transition-all ${
                                selectedOption === 'instant' 
                                    ? 'border-black bg-[#F7F7F7]' 
                                    : 'border border-gray-200 bg-white hover:bg-[#F7F7F7]'
                            }`}
                            disabled={loading}
                        >
                            <div className="flex justify-between items-start gap-4">
                                <div>
                                    <h3 className="text-lg font-medium mb-1">Sử dụng tính năng Đặt ngay</h3>
                                    <p className="text-gray-500 mt-2 text-sm">
                                        Cho phép khách đặt phòng tự động.
                                    </p>
                                </div>
                                <div className="text-2xl">⚡</div>
                            </div>
                        </button>
                    </div>
                </div>
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
                        onClick={handleNext}
                        className="px-6 py-3 rounded-lg font-medium bg-black text-white hover:bg-[#222222]"
                        disabled={loading}
                    >
                        Tiếp theo
                    </button>
                </div>
            </div>
        </div>
    );
} 
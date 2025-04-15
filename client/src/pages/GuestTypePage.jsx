import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from 'axios';
import { useProgress } from "../HostLayout";
import HeaderActions from "../components/HeaderActions";
import { getNextPage, getPreviousPage, getPageProgress } from "../utils/pageOrder";

export default function GuestTypePage() {
    const { setProgress } = useProgress();
    const navigate = useNavigate();
    const [selectedType, setSelectedType] = useState('any');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        axios.get('/places-form-data')
            .then(({ data }) => {
                setSelectedType(data?.guestType || 'any');
                setLoading(false);
            })
            .catch(err => {
                console.error("Error loading initial guest type:", err);
                setLoading(false);
            });

        const progress = getPageProgress('guest-type');
        setProgress(progress);
    }, [setProgress]);

    async function updateGuestType(type) {
        setSelectedType(type);
        try {
            await axios.put('/places-form-data', { guestType: type });
        } catch (err) {
            console.error("Error updating guest type:", err);
        }
    }

    const handleNext = () => {
        const nextPage = getNextPage('guest-type');
        if (nextPage) {
            navigate(`/account/hosting/${nextPage}`);
        }
    };

    const handleBack = () => {
        const prevPage = getPreviousPage('guest-type');
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
                        Chọn đối tượng khách để chào đón trong lần đón tiếp khách đầu tiên của bạn
                    </h1>
                    <p className="text-gray-500 mb-1">
                        Sau khi bạn đón tiếp vị khách đầu tiên, bất kỳ khách nào cũng có thể đặt chỗ ở của bạn. 
                        <Link to="#" className="underline ml-1">Tìm hiểu thêm</Link>
                    </p>

                    <div className="mt-8 space-y-4">
                        <label 
                            className={`w-full p-6 border rounded-2xl flex items-start gap-4 cursor-pointer transition-all ${
                                selectedType === 'any' 
                                    ? 'border-black bg-[#F7F7F7]' 
                                    : 'border-gray-200 bg-white hover:bg-[#F7F7F7]'
                            }`}
                        >
                            <input
                                type="radio"
                                name="guestType"
                                value="any"
                                checked={selectedType === 'any'}
                                onChange={(e) => updateGuestType(e.target.value)}
                                className="w-5 h-5 mt-1 accent-black"
                                disabled={loading}
                            />
                            <div>
                                <h3 className="text-lg font-medium mb-1">Khách Airbnb bất kỳ</h3>
                                <p className="text-gray-500 text-sm">
                                    Bạn có thể nhận được yêu cầu đặt phòng nhanh chóng hơn nếu chào đón bất kỳ thành viên nào trong cộng đồng Airbnb.
                                </p>
                            </div>
                        </label>

                        <label 
                            className={`w-full p-6 border rounded-2xl flex items-start gap-4 cursor-pointer transition-all ${
                                selectedType === 'experienced' 
                                    ? 'border-black bg-[#F7F7F7]' 
                                    : 'border-gray-200 bg-white hover:bg-[#F7F7F7]'
                            }`}
                        >
                            <input
                                type="radio"
                                name="guestType"
                                value="experienced"
                                checked={selectedType === 'experienced'}
                                onChange={(e) => updateGuestType(e.target.value)}
                                className="w-5 h-5 mt-1 accent-black"
                                disabled={loading}
                            />
                            <div>
                                <h3 className="text-lg font-medium mb-1">Khách có kinh nghiệm</h3>
                                <p className="text-gray-500 text-sm">
                                    Đối với vị khách đầu tiên, chỉ chào đón người có lịch sử hoạt động tốt trên Airbnb – người có thể chia sẻ các mẹo để giúp bạn trở thành một Chủ nhà tuyệt vời.
                                </p>
                            </div>
                        </label>
                    </div>
                </div>
            </div>

            <div className="fixed bottom-0 left-0 right-0 bg-white border-t">
                <div className="max-w-[1280px] mx-auto px-20 py-6 flex justify-between items-center">
                    <button
                        onClick={handleBack}
                        className="bg-white px-6 py-3 rounded-lg hover:bg-gray-100 border border-black font-medium"
                    >
                        Quay lại
                    </button>
                    <button 
                        onClick={handleNext}
                        className="px-6 py-3 rounded-lg font-medium bg-black text-white hover:bg-gray-800"
                        disabled={loading}
                    >
                        Tiếp theo
                    </button>
                </div>
            </div>
        </div>
    );
} 
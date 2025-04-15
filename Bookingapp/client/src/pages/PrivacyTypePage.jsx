import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useProgress } from "../HostLayout";

export default function PrivacyTypePage() {
    const navigate = useNavigate();
    const [selected, setSelected] = useState(() => {
        // Lấy giá trị đã chọn từ localStorage khi khởi tạo
        return localStorage.getItem('placePrivacyType') || '';
    });
    const { setProgress } = useProgress();

    useEffect(() => {
        setProgress('30%');
    }, []);

    // Lưu lựa chọn vào localStorage khi có thay đổi
    useEffect(() => {
        localStorage.setItem('placePrivacyType', selected);
    }, [selected]);

    const privacyTypes = [
        {
            id: 'entire',
            title: 'Toàn bộ nhà',
            description: 'Khách được sử dụng riêng toàn bộ chỗ ở này.',
            icon: '🏠'
        },
        {
            id: 'private',
            title: 'Một căn phòng',
            description: 'Khách sẽ có phòng riêng trong một ngôi nhà và được sử dụng những khu vực chung.',
            icon: '🚪'
        },
        {
            id: 'shared',
            title: 'Phòng chung trong khách sạn giá rẻ',
            description: 'Khách ngủ trong phòng chung tại một khách sạn giá rẻ được quản lý chuyên nghiệp và có nhân viên trực tại chỗ 24/7.',
            icon: '🛏️'
        }
    ];

    function handleNext() {
        if (!selected) {
            alert('Vui lòng chọn loại phòng');
            return;
        }
        navigate('/account/places/location');
    }

    return (
        <div className="flex flex-col h-screen pb-24">
            <div className="flex-1 overflow-y-auto scrollbar-hide">
                <div className="max-w-screen-lg mx-auto px-20 py-12">
                    <h1 className="text-[32px] font-medium mb-2">
                        Khách sẽ được sử dụng loại chỗ ở nào?
                    </h1>
                    <p className="text-gray-500 mb-8">
                        Chọn loại không gian mà khách có thể sử dụng.
                    </p>

                    <div className="flex flex-col gap-4 max-w-3xl">
                        {privacyTypes.map(type => (
                            <label 
                                key={type.id}
                                className={`
                                    flex items-start p-6 border rounded-2xl cursor-pointer transition-all hover:border-black
                                    ${selected === type.id 
                                        ? 'border-black bg-gray-50' 
                                        : 'border-gray-200'
                                    }
                                `}
                                onClick={() => setSelected(type.id)}
                            >
                                <input
                                    type="radio"
                                    name="privacyType"
                                    value={type.id}
                                    checked={selected === type.id}
                                    onChange={() => setSelected(type.id)}
                                    className="hidden"
                                />
                                <div className="flex-1">
                                    <div className="flex items-center gap-4">
                                        <span className="text-3xl">{type.icon}</span>
                                        <span className="font-medium text-lg">{type.title}</span>
                                    </div>
                                    <p className="text-gray-500 mt-2 text-base">{type.description}</p>
                                </div>
                            </label>
                        ))}
                    </div>
                </div>
            </div>

            {/* Navigation */}
            <div className="fixed bottom-0 left-0 right-0 bg-white border-t">
                {/* Buttons */}
                <div className="max-w-screen-lg mx-auto px-20 py-4 flex justify-between items-center">
                    <button 
                        onClick={() => navigate('/account/places/structure')}
                        className="px-4 py-2 rounded-lg border border-gray-200 font-medium bg-white"
                    >
                        Quay lại
                    </button>
                    <button 
                        onClick={handleNext}
                        className="bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors font-medium"
                    >
                        Tiếp theo
                    </button>
                </div>
            </div>
        </div>
    );
} 
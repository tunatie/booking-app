import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import { getNextPage, getPreviousPage } from "../utils/pageOrder";
import HeaderActions from "../components/HeaderActions";

export default function PrivacyTypePage() {
    const navigate = useNavigate();
    const [selected, setSelected] = useState('');
    const [loading, setLoading] = useState(true);

    // Load dữ liệu privacyType ban đầu từ API
    useEffect(() => {
        setLoading(true);
        axios.get('/places-form-data')
            .then(({ data }) => {
                if (data?.privacyType) {
                    setSelected(data.privacyType);
                }
                setLoading(false);
            })
            .catch(err => {
                console.error("Error loading initial privacyType:", err);
                setLoading(false);
            });
    }, []);

    // Hàm cập nhật privacyType trên server
    async function updatePrivacyType(privacyTypeId) {
        setSelected(privacyTypeId);
        try {
            await axios.put('/places-form-data', { privacyType: privacyTypeId });
        } catch (err) {
            console.error("Error updating privacyType:", err);
        }
    }

    const privacyTypes = [
        {
            id: 'entire',
            name: 'Toàn bộ nơi ở',
            description: 'Khách được sử dụng riêng toàn bộ chỗ ở',
            icon: '🏠'
        },
        {
            id: 'private',
            name: 'Phòng riêng',
            description: 'Khách có phòng riêng để ngủ và có thể sử dụng một số khu vực chung',
            icon: '🛏️'
        },
        {
            id: 'shared',
            name: 'Phòng chung',
            description: 'Khách ngủ trong phòng hoặc khu vực chung mà người khác cũng có thể sử dụng',
            icon: '👥'
        }
    ];

    function handleNext() {
        if (!selected) {
            alert('Vui lòng chọn loại quyền riêng tư');
            return;
        }
        const nextPage = getNextPage('privacy-type');
        if (nextPage) {
            navigate(`/account/hosting/${nextPage}`);
        }
    }

    function handleBack() {
        const prevPage = getPreviousPage('privacy-type');
        if (prevPage) {
            navigate(`/account/hosting/${prevPage}`);
        }
    }

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-screen pb-24">
            <HeaderActions />
            
            <div className="flex-1 overflow-y-auto scrollbar-hide">
                <div className="max-w-screen-lg mx-auto px-20 py-12">
                    <h1 className="text-[32px] font-medium mb-2">
                        Khách sẽ có được không gian nào?
                    </h1>
                    <p className="text-gray-500 mb-8">
                        Chọn loại hình cho thuê phù hợp với chỗ ở của bạn
                    </p>

                    <div className="space-y-4">
                        {privacyTypes.map(type => (
                            <label 
                                key={type.id}
                                className={`
                                    w-full p-6 border rounded-2xl flex items-start gap-4 cursor-pointer transition-all hover:border-black
                                    ${selected === type.id 
                                        ? 'border-black bg-gray-50' 
                                        : 'border-gray-200'
                                    }
                                `}
                                onClick={() => updatePrivacyType(type.id)}
                            >
                                <input
                                    type="radio"
                                    name="privacyType"
                                    value={type.id}
                                    checked={selected === type.id}
                                    onChange={() => {}}
                                    className="hidden"
                                />
                                <div className="text-3xl">{type.icon}</div>
                                <div>
                                    <h3 className="text-lg font-medium mb-1">{type.name}</h3>
                                    <p className="text-gray-500">{type.description}</p>
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
                        onClick={handleBack}
                        className="px-4 py-2 rounded-lg border border-gray-200 font-medium bg-white"
                    >
                        Quay lại
                    </button>
                    <button 
                        onClick={handleNext}
                        className={`px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors font-medium ${!selected ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-black text-white'}`}
                        disabled={!selected}
                    >
                        Tiếp theo
                    </button>
                </div>
            </div>
        </div>
    );
} 
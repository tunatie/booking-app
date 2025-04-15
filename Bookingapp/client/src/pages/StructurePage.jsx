import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useProgress } from "../HostLayout";

export default function StructurePage() {
    const navigate = useNavigate();
    const [selected, setSelected] = useState(() => {
        // Lấy giá trị đã chọn từ localStorage khi khởi tạo
        return localStorage.getItem('placeStructure') || '';
    });
    const { setProgress } = useProgress();

    useEffect(() => {
        setProgress('15%');
    }, []);

    // Lưu lựa chọn vào localStorage khi có thay đổi
    useEffect(() => {
        localStorage.setItem('placeStructure', selected);
    }, [selected]);

    const placeTypes = [
        { id: 'house', name: 'Nhà', icon: '🏠' },
        { id: 'apartment', name: 'Căn hộ', icon: '🏢' },
        { id: 'guesthouse', name: 'Nhà nghỉ dưỡng', icon: '🏡' },
        { id: 'breakfast', name: 'Chỗ nghỉ phục vụ bữa sáng', icon: '☕' },
        { id: 'boat', name: 'Thuyền', icon: '⛵' },
        { id: 'cabin', name: 'Cabin', icon: '🏠' },
        { id: 'camper', name: 'Xe cắm trại/RV', icon: '🚐' },
        { id: 'casa', name: 'Casa particular', icon: '🏠' },
        { id: 'castle', name: 'Lâu đài', icon: '🏰' },
        { id: 'cave', name: 'Hang', icon: '🗻' },
        { id: 'container', name: 'Nhà container', icon: '📦' },
        { id: 'cycladic', name: 'Nhà theo phong cách Cycladic', icon: '🏠' },
        { id: 'dammuso', name: 'Dammuso', icon: '🏠' },
        { id: 'dome', name: 'Nhà vòm', icon: '🏠' },
        { id: 'earth', name: 'Nhà dưới lòng đất', icon: '🏠' },
        { id: 'farm', name: 'Nông trại', icon: '🌾' },
        { id: 'guest', name: 'Nhà khách', icon: '🏠' },
        { id: 'hotel', name: 'Khách sạn', icon: '🏨' },
        { id: 'houseboat', name: 'Nhà thuyền', icon: '⛵' },
        { id: 'kezhan', name: 'Kezhan', icon: '🏠' },
        { id: 'minsu', name: 'Minsu', icon: '🏠' },
        { id: 'riad', name: 'Riad', icon: '🏠' },
        { id: 'ryokan', name: 'Ryokan', icon: '🏠' },
        { id: 'shepherd', name: 'Lều mục đồng', icon: '⛺' },
        { id: 'tent', name: 'Lều vải', icon: '⛺' },
        { id: 'tiny', name: 'Nhà nhỏ', icon: '🏠' },
        { id: 'tower', name: 'Tháp', icon: '🗼' },
        { id: 'treehouse', name: 'Nhà trên cây', icon: '🌳' },
        { id: 'trullo', name: 'Nhà chóm nón', icon: '🏠' },
        { id: 'windmill', name: 'Cối xay gió', icon: '🏠' },
        { id: 'yurt', name: 'Lều yurt', icon: '⛺' }
    ];

    function handleNext() {
        if (!selected) {
            alert('Vui lòng chọn loại chỗ ở');
            return;
        }
        navigate('/account/places/privacy-type');
    }

    return (
        <div className="flex flex-col h-screen pb-24">
            <div className="flex-1 overflow-y-auto scrollbar-hide">
                <div className="max-w-screen-lg mx-auto px-20 py-12">
                    <h1 className="text-[32px] font-medium mb-2">
                        Điều nào sau đây mô tả chính xác nhất về chỗ ở của bạn?
                    </h1>
                    <p className="text-gray-500 mb-8">
                        Chọn loại chỗ ở phù hợp nhất với nơi bạn cho thuê.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pb-6">
                        {placeTypes.map(type => (
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
                                    name="placeType"
                                    value={type.id}
                                    checked={selected === type.id}
                                    onChange={() => setSelected(type.id)}
                                    className="hidden"
                                />
                                <div className="flex flex-col gap-2">
                                    <span className="text-3xl mb-1">{type.icon}</span>
                                    <span className="font-medium text-base">{type.name}</span>
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
                        onClick={() => navigate('/account/places/new')}
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
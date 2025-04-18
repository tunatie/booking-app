import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from '../utils/axios';
import { getNextPage, getPreviousPage } from "../utils/pageOrder";
import HeaderActions from "../components/HeaderActions";

export default function StructurePage() {
    const navigate = useNavigate();
    const [selected, setSelected] = useState('');
    const [loading, setLoading] = useState(true);

    // Load dữ liệu structure ban đầu từ API
    useEffect(() => {
        setLoading(true);
        axios.get('/places-form-data')
            .then(({ data }) => {
                if (data?.structure) {
                    setSelected(data.structure);
                }
                setLoading(false);
            })
            .catch(err => {
                console.error("Error loading initial structure:", err);
                setLoading(false);
                // Có thể xử lý lỗi ở đây, ví dụ: quay lại trang trước
            });
    }, []);

    // Hàm cập nhật structure trên server
    async function updateStructure(structureId) {
        setSelected(structureId); // Cập nhật state cục bộ ngay lập tức
        try {
            // Chỉ gửi trường structure để cập nhật
            await axios.put('/places-form-data', { structure: structureId });
        } catch (err) {
            console.error("Error updating structure:", err);
            // Có thể thông báo lỗi cho người dùng
        }
    }

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
        // Đã lưu tự động, chỉ cần chuyển trang
        const nextPage = getNextPage('structure');
        if (nextPage) {
            navigate(`/account/hosting/${nextPage}`);
        }
    }

    function handleBack() {
        const prevPage = getPreviousPage('structure');
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
                                onClick={() => updateStructure(type.id)} // Gọi hàm cập nhật khi click
                            >
                                <input
                                    type="radio"
                                    name="placeType"
                                    value={type.id}
                                    checked={selected === type.id}
                                    onChange={() => {}} // onChange có thể để trống hoặc gọi updateStructure
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
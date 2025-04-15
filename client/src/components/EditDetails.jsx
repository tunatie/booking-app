import { useState, useEffect } from 'react';

export default function EditDetails({ place, onChange }) {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');

    // Cập nhật state nội bộ khi prop `place` thay đổi
    useEffect(() => {
        if (place) {
            setTitle(place.title || '');
            setDescription(place.description || '');
        }
    }, [place]);

    // Hàm xử lý thay đổi và gọi prop onChange
    const handleInputChange = (setter, fieldName) => (event) => {
        const newValue = event.target.value;
        setter(newValue);
        onChange({ [fieldName]: newValue });
    };

    if (!place) return null;

    return (
        <div className="max-w-2xl">
            <h2 className="text-2xl font-semibold mb-6">Tiêu đề & mô tả</h2>

            <div className="mb-6 pb-6 border-b border-gray-200">
                <label htmlFor="title" className="block text-base font-medium text-gray-900 mb-2">Tiêu đề nhà/phòng cho thuê</label>
                <input
                    type="text"
                    id="title"
                    value={title}
                    onChange={handleInputChange(setTitle, 'title')}
                    className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary text-base"
                    placeholder="Ví dụ: Căn hộ studio ấm cúng gần trung tâm"
                />
                <p className="text-sm text-gray-500 mt-2">Tiêu đề của bạn nên nêu bật những điểm đặc biệt của chỗ ở.</p>
            </div>

            <div className="mb-6">
                <label htmlFor="description" className="block text-base font-medium text-gray-900 mb-2">Mô tả về chỗ ở</label>
                <textarea
                    id="description"
                    rows="8"
                    value={description}
                    onChange={handleInputChange(setDescription, 'description')}
                    className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary text-base"
                    placeholder="Mô tả chi tiết về chỗ ở, những điểm đặc biệt, không gian xung quanh..."
                />
                 <p className="text-sm text-gray-500 mt-2">Chia sẻ những điều làm cho chỗ ở của bạn trở nên đặc biệt, từ phong cách trang trí cho đến các tiện nghi có sẵn.</p>
            </div>

             {/* Có thể thêm các trường khác như structure, privacyType ở đây nếu muốn */}

        </div>
    );
}


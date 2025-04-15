import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

// Các component con cho từng mục chỉnh sửa
// import EditPhotos from '../components/EditPhotos';
import EditDetails from '../components/EditDetails'; // <-- Import EditDetails
// import EditLocation from '../components/EditLocation';
// ...

export default function PlaceEditPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [place, setPlace] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeSection, setActiveSection] = useState('details'); 

    useEffect(() => {
        if (!id) {
            return;
        }
        setLoading(true);
        axios.get(`/places/${id}`)
            .then(response => {
                // Kiểm tra xem người dùng có quyền sở hữu không (nếu API trả về owner)
                // if (response.data.owner !== loggedInUserId) { navigate('/account/places'); return; }
                setPlace(response.data);
                setLoading(false);
            })
            .catch(err => {
                console.error("Error fetching place data:", err);
                setLoading(false);
                // Có thể chuyển hướng hoặc hiển thị lỗi nếu không tìm thấy
                // navigate('/account/places');
            });
    }, [id]);

    function renderEditSection() {
        // Dựa vào activeSection để render component con tương ứng
        switch (activeSection) {
            case 'photos':
                // return <EditPhotos place={place} onChange={handlePlaceChange} />;
                return <div>Chỉnh sửa Ảnh... (Component sẽ tạo sau)</div>;
            case 'details':
                 return <EditDetails place={place} onChange={handlePlaceChange} />; // <-- Sử dụng EditDetails
            case 'location':
                 // return <EditLocation place={place} onChange={handlePlaceChange} />;
// ... (các case khác) ...
            default:
                return <div>Chọn một mục để chỉnh sửa</div>;
        }
    }

    // Hàm để cập nhật state `place` khi component con thay đổi dữ liệu
    const handlePlaceChange = (updatedData) => {
        setPlace(prevPlace => ({ ...prevPlace, ...updatedData }));
    };

    // Hàm xử lý lưu thay đổi
    async function handleSave() {
        if (!place) return;
        try {
            setLoading(true); // Hiển thị loading khi đang lưu
            // Chỉ gửi các trường cần thiết, tránh gửi cả __v hoặc các dữ liệu không mong muốn
            const { __v, createdAt, updatedAt, ...dataToSave } = place;
            await axios.put(`/places`, dataToSave); // Giả sử endpoint PUT là /places
            alert('Lưu thay đổi thành công!');
            // Có thể điều hướng về danh sách sau khi lưu
            // navigate('/account/places');
        } catch (error) {
            console.error("Error saving place:", error);
            alert("Lỗi lưu thay đổi. Vui lòng thử lại.");
        } finally {
            setLoading(false);
        }
    }

    // ... (phần return loading, !place) ...

    // Danh sách các mục chỉnh sửa cho sidebar - Cập nhật GIỐNG HỆT Airbnb
    const editSections = [
        { key: 'photos', label: 'Ảnh' }, 
        { key: 'title_description', label: 'Tiêu đề & mô tả' }, // Gộp title và description
        { key: 'place_type', label: 'Loại chỗ ở' },
        { key: 'pricing', label: 'Định giá' },
        { key: 'availability', label: 'Tình trạng còn phòng' }, 
        { key: 'guests', label: 'Số lượng khách' }, // Mặc dù không thấy rõ trong ảnh, đây là mục logic
        { key: 'amenities', label: 'Tiện nghi' },
        // { key: 'accessibility', label: 'Đặc điểm phù hợp với nhu cầu đặc biệt' }, // Mục này có thể phức tạp, tạm ẩn
        { key: 'location', label: 'Vị trí' },
        // { key: 'host_profile', label: 'Giới thiệu về Chủ nhà' }, // Tạm ẩn
        // { key: 'co_hosts', label: 'Đồng chủ nhà' }, // Tạm ẩn
        { key: 'booking_settings', label: 'Cài đặt đặt phòng' },
        { key: 'rules', label: 'Nội quy nhà' },
        { key: 'safety', label: 'An toàn cho khách' },
        { key: 'cancellation_policy', label: 'Chính sách hủy' },
        // { key: 'custom_link', label: 'Liên kết tùy chỉnh' }, // Tạm ẩn
    ];

    return (
        <div className="flex h-screen bg-gray-50">
            {/* Cột trái - Sidebar Menu */}
            <div className="w-72 border-r bg-white p-4 overflow-y-auto flex flex-col shadow-sm">
                <Link to="/account/hosting/listings" className="flex items-center gap-2 mb-6 text-sm font-medium text-gray-600 hover:text-black">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                    </svg>
                    Trình chỉnh sửa mục cho thuê
                </Link>
                <nav className="flex-grow">
                    <ul>
                        {editSections.map(section => (
                            <li key={section.key} className="mb-1">
                                <button
                                    onClick={() => setActiveSection(section.key)}
                                    className={`w-full text-left px-3 py-2.5 rounded-md text-sm transition-colors ${activeSection === section.key ? 'bg-gray-100 font-semibold text-gray-900' : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'}`}
                                >
                                    {/* Bỏ icon */} 
                                    {section.label}
                                </button>
                            </li>
                        ))}
                    </ul>
                </nav>
                 <div className="mt-auto pt-4 border-t">
                     {/* Có thể thêm nút xem trước hoặc nút lưu tổng thể ở đây */}
                     <button 
                        onClick={handleSave} // <-- Gắn hàm handleSave
                        disabled={loading} // Disable nút khi đang loading
                        className="w-full bg-primary text-white py-2 rounded hover:bg-primary-dark disabled:bg-gray-400"
                    >
                         {loading ? 'Đang lưu...' : 'Lưu thay đổi'}
                     </button>
                 </div>
            </div>

            {/* Cột phải - Content Area */}
            <div className="flex-1 p-8 overflow-y-auto">
                {renderEditSection()}
            </div>
        </div>
    );
} 
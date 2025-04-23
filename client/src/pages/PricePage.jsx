import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { useProgress } from "../contexts/ProgressContext";
import { getPageProgress } from "../utils/pageOrder";
import HeaderActions from "../components/HeaderActions";
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import axios from "../utils/axios";
import { useForm } from "../contexts/FormContext";
import { getPreviousRoute, getNextRoute, getFallbackRoute } from '../utils/navigation';

// Fix Leaflet default marker icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: null,
    iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

// Custom marker icon
const customIcon = new L.Icon({
    iconUrl: 'https://cdn0.iconfinder.com/data/icons/small-n-flat/24/678111-map-marker-512.png',
    iconSize: [35, 35],
    iconAnchor: [17, 35],
    popupAnchor: [0, -35]
});

export default function PricePage() {
    const { setProgress } = useProgress();
    const navigate = useNavigate();
    const { formData, updateFormData } = useForm();
    const [basePrice, setBasePrice] = useState(formData.price || 1000000);
    const [loading, setLoading] = useState(true);
    const [showBreakdown, setShowBreakdown] = useState(false);
    const [showMapModal, setShowMapModal] = useState(false);
    const [showPricingInfoModal, setShowPricingInfoModal] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editPrice, setEditPrice] = useState('');
    const mapRef = useRef(null);
    const inputRef = useRef(null);
    
    const markers = [
        { position: [10.7769, 106.7009], price: '438.347' },
        { position: [10.7859, 106.6957], price: '464.132' },
        { position: [10.7799, 106.6999], price: '587.475' },
        { position: [10.7729, 106.6989], price: '721.983' }
    ];

    // Set initial progress and load data
    useEffect(() => {
        const progress = getPageProgress('price');
        setProgress(progress);

        const loadData = async () => {
            try {
                const response = await axios.get('/places-form-data');
                if (response.data && response.data.price) {
                    setBasePrice(response.data.price);
                    updateFormData('price', response.data.price);
                }
            } catch (error) {
                console.error('Error loading price data:', error);
                const fallbackRoute = getFallbackRoute();
                if (fallbackRoute) {
                    navigate(fallbackRoute);
                }
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, []);

    // Update form context when price changes
    useEffect(() => {
        if (!isEditing && !loading) {
            updateFormData('price', basePrice);
        }
    }, [basePrice, isEditing, loading]);

    const serviceFee = Math.round(basePrice * 0.15);
    const totalPrice = basePrice + serviceFee;
    const earnings = Math.round(basePrice * 0.97);

    const formatPrice = (price) => {
        if (price === null || typeof price === 'undefined') {
            return '0';
        }
        const priceString = String(price);
        return new Intl.NumberFormat('vi-VN').format(priceString.replace(/\./g, ''));
    };

    const formatInputPrice = (value) => {
        if (!value) return '';
        const numberValue = value.replace(/\D/g, '');
        return new Intl.NumberFormat('vi-VN').format(numberValue);
    };

    const handleEditClick = () => {
        setEditPrice(String(basePrice));
        setIsEditing(true);
        setTimeout(() => {
            inputRef.current?.focus();
            inputRef.current?.select();
        }, 0);
    };

    const handlePriceChange = (e) => {
        const value = e.target.value.replace(/\D/g, '');
        setEditPrice(value);
    };

    const handlePriceSubmit = () => {
        const newPrice = parseInt(editPrice) || 0;
        if (newPrice !== basePrice) {
            setBasePrice(newPrice);
        }
        setIsEditing(false);
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            handlePriceSubmit();
        } else if (e.key === 'Escape') {
            setEditPrice(String(basePrice));
            setIsEditing(false);
        }
    };

    const handleNext = async () => {
        if (basePrice < 100000) {
            alert('Giá phòng không thể thấp hơn 100,000đ');
            return;
        }

        try {
            await axios.put('/places-form-data', {
                ...formData,
                price: basePrice
            });
            
            const nextRoute = getNextRoute('price');
            if (nextRoute) {
                navigate(nextRoute);
            }
        } catch (error) {
            console.error('Error saving price:', error);
            alert('Có lỗi xảy ra khi lưu giá. Vui lòng thử lại.');
        }
    };

    const handleBack = () => {
        const prevRoute = getPreviousRoute('price');
        if (prevRoute) {
            navigate(prevRoute);
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
            {showMapModal && (
                <div className="fixed inset-0 z-[1000]">
                    <div className="absolute inset-0 bg-black bg-opacity-25"></div>
                    <div className="relative w-[1320px] h-[800px] mx-auto mt-[5vh]">
                        <div className="relative w-full h-full bg-[#F7F7F7] rounded-xl overflow-hidden">
                            <MapContainer 
                                center={[10.7769, 106.7009]} 
                                zoom={12} 
                                className="w-full h-full"
                                zoomControl={false}
                                ref={mapRef}
                            >
                                <TileLayer
                                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                />
                                {markers.map((marker, idx) => (
                                    <Marker 
                                        key={idx} 
                                        position={marker.position}
                                        icon={customIcon}
                                    >
                                        <Popup>
                                            <div className="px-3 py-1">
                                                ₫{marker.price}
                                            </div>
                                        </Popup>
                                    </Marker>
                                ))}
                            </MapContainer>

                            <div className="map-overlay">
                                <button 
                                    onClick={() => setShowMapModal(false)}
                                    className="map-controls absolute left-4 top-4 bg-white hover:bg-gray-100 rounded-full p-2"
                                >
                                    <svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" role="presentation" focusable="false" style={{display: "block", fill: "none", height: "16px", width: "16px", stroke: "currentcolor", strokeWidth: 3}}><path d="m6 6 20 20"></path><path d="m26 6-20 20"></path></svg>
                                </button>

                                <div className="map-controls absolute right-4 bottom-4 flex gap-2">
                                    <button 
                                        onClick={() => mapRef.current?.zoomIn()}
                                        className="bg-white rounded-lg px-4 py-2 shadow-md hover:bg-gray-50"
                                    >
                                        Phóng to
                                    </button>
                                    <button 
                                        onClick={() => mapRef.current?.zoomOut()}
                                        className="bg-white rounded-lg px-4 py-2 shadow-md hover:bg-gray-50"
                                    >
                                        Thu nhỏ
                                    </button>
                                </div>

                                <div className="map-panel absolute right-4 top-4 bg-white rounded-xl shadow-lg" style={{width: '320px'}}>
                                    <div className="p-6">
                                        <h1 className="text-[22px] font-semibold">So sánh các nhà/phòng cho thuê tương tự</h1>
                                        <div className="text-gray-600 mt-2">Toàn bộ nhà/căn hộ · 0 – 1 phòng ngủ</div>
                                        <div className="text-gray-600">2 thg 4, 2024 – 2 thg 4, 2025</div>
                                        
                                        <div className="border-t my-6"></div>
                                        
                                        <div className="font-semibold">Nhà/phòng cho thuê đã có khách đặt</div>
                                        <div className="text-gray-600 mt-2 text-sm">
                                            Hầu hết các nhà/phòng cho thuê có khách đặt vào những ngày này có giá thuê trung bình từ ₫515.702 – ₫758.082 mỗi đêm.
                                        </div>
                                        <button className="text-[#006AFF] hover:opacity-80 mt-4 text-sm font-normal">Tìm hiểu thêm</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            
            {showPricingInfoModal && (
                <div className="fixed inset-0 z-[1000]">
                    <div className="absolute inset-0 bg-black bg-opacity-25"></div>
                    <div className="relative w-[568px] mx-auto mt-[5vh]">
                        <div className="relative w-full bg-white rounded-xl">
                            <div className="flex items-center justify-between p-6 border-b">
                                <h2 className="text-xl font-semibold">Thông tin thêm về cách định giá</h2>
                                <button 
                                    onClick={() => setShowPricingInfoModal(false)}
                                    className="hover:bg-gray-100 rounded-full p-2"
                                >
                                    <svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" role="presentation" focusable="false" style={{display: "block", fill: "none", height: "16px", width: "16px", stroke: "currentcolor", strokeWidth: 3}}><path d="m6 6 20 20"></path><path d="m26 6-20 20"></path></svg>
                                </button>
                            </div>
                            
                            <div className="p-6 space-y-6">
                                <div>
                                    <p className="mb-4">Bạn là người chọn giá và có thể thay đổi giá bất cứ lúc nào. Chúng tôi không đảm bảo sẽ có khách đặt.</p>
                                </div>
                                
                                <div>
                                    <h3 className="font-semibold mb-2">Giá mỗi đêm</h3>
                                    <p>Giá đề xuất được tính dựa trên các yếu tố như vị trí và tiện nghi của nhà/phòng cho thuê, nhu cầu của khách và các nhà/phòng cho thuê tương tự.</p>
                                </div>
                                
                                <div>
                                    <h3 className="font-semibold mb-2">Chi tiết giá hiển thị cho khách</h3>
                                    <p>Trong phần chi tiết giá hiển thị khi bạn đặt giá, phí dịch vụ dành cho khách và/hoặc các khoản thuế (nếu có) có thể khác nhau tùy thuộc vào thông tin của chuyến đi được đặt (chẳng hạn như thời gian hoặc số lượng khách).</p>
                                </div>
                                
                                <div>
                                    <h3 className="font-semibold mb-2">So sánh các nhà/phòng cho thuê tương tự</h3>
                                    <p>Để xác định những chỗ ở tương tự như nhà/phòng cho thuê của bạn, chúng tôi xét đến những tiêu chí như vị trí, loại hình cho thuê, sức chứa, tiện nghi, đánh giá, điểm xếp hạng và những chỗ ở mà khách thường tham khảo khi xem nhà/phòng cho thuê của bạn. Chúng tôi chỉ tránh xét đến các nhà/phòng cho thuê không có hoạt động tích cực – ví dụ như, chúng tôi sẽ không bao gồm xét đến nhà/phòng cho thuê chưa từng có khách đặt trong năm qua, hay nhà/phòng cho thuê không còn trống trong tháng sắp tới. Giá trung bình mỗi đêm sẽ hiển thị là giá của những nhà/phòng cho thuê có đã có khách đặt và/hoặc còn trống. Khi bạn mới khởi đăng nhà/phòng cho thuê có thể hiển thị trên bản đồ với trạng thái đã được đặt và được đặt nếu có đêm đã đặt và còn trống trong giai đoạn đó.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            
            <HeaderActions />
            <div className="flex-1 pt-[48px] pb-[88px] flex items-center">
                <div className="w-full max-w-[640px] mx-auto px-20">
                    <h1 className="text-[32px] font-semibold mb-4 text-center">
                        Bây giờ, hãy đặt mức giá mà bạn muốn
                    </h1>

                    <div className="flex justify-center items-center mb-6">
                        <div className="relative inline-flex items-center gap-2">
                            {isEditing ? (
                                <div className="relative">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[32px] font-semibold">₫</span>
                                    <input
                                        ref={inputRef}
                                        type="text" 
                                        value={formatInputPrice(editPrice)}
                                        onChange={handlePriceChange}
                                        onBlur={handlePriceSubmit}
                                        onKeyDown={handleKeyDown}
                                        style={{textIndent: "30px"}}
                                        className="text-[32px] font-semibold pl-[30px] pr-6 py-2 w-[280px] border border-gray-300 rounded-xl focus:outline-none focus:border-black"
                                    />
                                </div>
                            ) : (
                                <>
                                    <span className="text-[32px] font-semibold">₫{formatPrice(basePrice)}</span>
                                    <button 
                                        onClick={handleEditClick}
                                        className="hover:bg-gray-100 rounded-full p-2"
                                        disabled={loading}
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" aria-label="Chỉnh sửa" role="img" focusable="false" style={{display: "block", height: "16px", width: "16px", fill: "var(--linaria-theme_palette-icon-primary)"}}><path d="m18.23 7.35 6.42 6.42L10 28.4c-.38.38-.88.59-1.41.59H3v-5.59c0-.52.21-1.04.59-1.41L18.23 7.35zm9.98-3.56a4.54 4.54 0 0 0-6.42 0l-1.44 1.44 6.42 6.42 1.44-1.44a4.54 4.54 0 0 0 0-6.42z"></path></svg>
                                    </button>
                                </>
                            )}
                        </div>
                    </div>

                    <div className="w-full">
                        <div 
                            className={`border-2 border-black rounded-2xl p-4 mb-3`}
                        >
                            {!showBreakdown ? (
                                <div className="flex justify-between items-center cursor-pointer" onClick={() => setShowBreakdown(true)}>
                                    <span>Giá cho khách (trước thuế)</span>
                                    <span>₫{formatPrice(totalPrice)} ▼</span>
                                </div>
                            ) : (
                                <>
                                    <div className="space-y-4">
                                        <div className="flex justify-between items-center">
                                            <span>Giá cơ sở</span>
                                            <span>₫{formatPrice(basePrice)}</span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span>Phí dịch vụ cho khách</span>
                                            <span>₫{formatPrice(serviceFee)}</span>
                                        </div>
                                        <div className="flex justify-between items-center border-t pt-4">
                                            <span>Giá cho khách (trước thuế)</span>
                                            <span>₫{formatPrice(totalPrice)}</span>
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>

                        {showBreakdown && (
                            <>
                                <div className="border rounded-2xl p-4 mb-3">
                                    <div className="flex justify-between items-center">
                                        <span>Bạn kiếm được</span>
                                        <span>₫{formatPrice(earnings)}</span>
                                    </div>
                                </div>
                                <div className="text-center">
                                    <div className="rjcfnm2 dir dir-ltr" style={{display: 'inline-flex', alignItems: 'center', gap: '4px', cursor: 'pointer'}} onClick={() => setShowBreakdown(false)}>
                                        <div className="fabhw8m dir dir-ltr">Ẩn bớt</div>
                                        <div className="c7wu8oq dir dir-ltr" style={{display: 'flex'}}>
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" aria-hidden="true" role="presentation" focusable="false" style={{display: 'block', height: '12px', width: '12px', fill: 'currentcolor'}}>
                                                <path d="m15.71 11.05-1.41 1.42L8 6.17l-6.29 6.3L.3 11.05l6.59-6.59c.58-.58 1.5-.61 2.12-.1l.12.1z"></path>
                                            </svg>
                                        </div>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>

                    {!showBreakdown && (
                        <>
                            <div 
                                className="mt-8 flex items-center gap-2 bg-white border border-gray-300 p-4 rounded-2xl cursor-pointer hover:bg-gray-50"
                                onClick={() => setShowMapModal(true)}
                            >
                                <span className="text-2xl">📍</span>
                                <span className="text-sm">Nhà/phòng cho thuê tương tự: ₫505.388 - ₫758.082</span>
                            </div>

                            <div className="mt-4 text-center">
                                <button 
                                    onClick={() => setShowPricingInfoModal(true)}
                                    className="bg-white text-black underline hover:opacity-70 text-sm"
                                >
                                    Tìm hiểu thêm về định giá
                                </button>
                            </div>
                        </>
                    )}
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
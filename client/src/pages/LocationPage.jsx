import { Link, useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect, useCallback, useRef } from "react";
import { getNextPage, getPreviousPage } from "../utils/pageOrder";
import axios from "../utils/axios";
import HeaderActions from "../components/HeaderActions";
import { debounce } from "lodash";
import { useForm } from "../contexts/FormContext";
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import LocationMap from "../components/LocationMap";
import { getPreviousRoute, getNextRoute, getFallbackRoute } from '../utils/navigation';

// Fix for default marker icons in Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

function LocationMarker({ position, setPosition }) {
    const map = useMapEvents({
        click(e) {
            setPosition(e.latlng);
        },
    });

    return position === null ? null : (
        <Marker position={position} />
    );
}

export default function LocationPage() {
    const navigate = useNavigate();
    const location = useLocation();
    const { formData, updateFormData } = useForm();
    const [loading, setLoading] = useState(true);
    const [isInputFocused, setIsInputFocused] = useState(false);
    const dropdownRef = useRef(null);
    const inputRef = useRef(null);
    const mapRef = useRef(null);
    const [address, setAddress] = useState(formData.address || "");
    const [selectedLocation, setSelectedLocation] = useState(formData.location || null);

    // Load existing data when component mounts
    useEffect(() => {
        const loadData = async () => {
            try {
                setLoading(true);
                const { data } = await axios.get('/places-form-data');
                if (!data) {
                    alert('Không tìm thấy dữ liệu. Vui lòng thử lại.');
                    navigate(getFallbackRoute('location'), { replace: true });
                    return;
                }
                if (data.address && data.address !== address) {
                    setAddress(data.address);
                }
                if (data.location && JSON.stringify(data.location) !== JSON.stringify(selectedLocation)) {
                    setSelectedLocation(data.location);
                }
            } catch (err) {
                console.error("Error loading location data:", err);
                alert('Có lỗi xảy ra khi tải dữ liệu. Vui lòng thử lại.');
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, []);

    // Update form context when address or location changes
    useEffect(() => {
        const updateForm = async () => {
            updateFormData('address', address);
            updateFormData('location', selectedLocation);
        };
        updateForm();
    }, [address, selectedLocation]);

    // Xử lý click outside để đóng dropdown
    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target) &&
                inputRef.current && !inputRef.current.contains(event.target)) {
                setIsInputFocused(false);
            }
        }

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleLocationSelect = (location) => {
        setSelectedLocation(location);
        if (location.fromMap) {
            setAddress(location.address);
        }
    };

    const handleNext = async () => {
        if (!address.trim()) {
            alert('Vui lòng nhập địa chỉ');
            return;
        }

        try {
            await axios.put('/places-form-data', {
                address,
                location: selectedLocation
            });
            const nextRoute = getNextRoute('location');
            if (nextRoute) {
                navigate(nextRoute, { replace: true });
            }
        } catch (error) {
            console.error("Error updating location data:", error);
            alert("Lỗi cập nhật địa chỉ. Vui lòng thử lại.");
        }
    };

    const handleBack = () => {
        const prevRoute = getPreviousRoute('location');
        if (prevRoute) {
            navigate(prevRoute, { replace: true });
        }
    };

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
                            Tiếp theo
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col">
            <HeaderActions 
                title="Chỗ ở của bạn nằm ở đâu?"
                subtitle="Địa chỉ của bạn chỉ được chia sẻ với khách sau khi họ đặt phòng thành công."
            />
            
            <div className="flex-1 px-20 py-8">
                <div className="max-w-2xl mx-auto">
                    {/* Search input */}
                    <div className="relative mb-4">
                        <div className="absolute left-6 top-1/2 -translate-y-1/2 z-10">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-gray-700">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                            </svg>
                        </div>
                        <input
                            ref={inputRef}
                            type="text"
                            placeholder="Nhập địa chỉ của bạn"
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            onFocus={() => setIsInputFocused(true)}
                            className="w-full h-[56px] pl-16 pr-8 border border-gray-300 rounded-[32px] focus:outline-none focus:border-gray-500 text-[15px] text-left [text-indent:35px]"
                        />

                        {/* Location suggestion dropdown */}
                        {isInputFocused && (
                            <div 
                                ref={dropdownRef}
                                className="absolute left-0 right-0 bg-white rounded-2xl mt-2 shadow-lg border border-gray-200 z-[9999] overflow-hidden"
                            >
                                <button 
                                    type="button"
                                    className="w-full flex items-center gap-4 px-6 py-4 bg-white hover:bg-gray-50 transition-all"
                                    onClick={() => {
                                        if (navigator.geolocation) {
                                            navigator.geolocation.getCurrentPosition(
                                                async (position) => {
                                                    const { latitude, longitude } = position.coords;
                                                    try {
                                                        const response = await fetch(
                                                            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`
                                                        );
                                                        const data = await response.json();
                                                        const currentLocation = {
                                                            lat: latitude,
                                                            lng: longitude,
                                                            address: data.display_name,
                                                            fromMap: true
                                                        };
                                                        handleLocationSelect(currentLocation);
                                                        setIsInputFocused(false);
                                                    } catch (error) {
                                                        console.error('Error getting current location:', error);
                                                    }
                                                },
                                                (error) => {
                                                    console.error('Error getting location:', error);
                                                }
                                            );
                                        }
                                    }}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
                                    </svg>
                                    Sử dụng vị trí hiện tại của tôi
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Map */}
                    <div className="w-full rounded-xl overflow-hidden border border-gray-200 mt-4">
                        <div className="h-[500px]">
                            <LocationMap 
                                address={address} 
                                onLocationSelect={handleLocationSelect}
                                mapRef={mapRef}
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer */}
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
                    >
                        Tiếp theo
                    </button>
                </div>
            </div>
        </div>
    );
} 
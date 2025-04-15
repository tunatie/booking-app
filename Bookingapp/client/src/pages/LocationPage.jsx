import { Link } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import LocationMap from "../components/LocationMap";
import { useProgress } from "../HostLayout";

export default function LocationPage() {
    const [isInputFocused, setIsInputFocused] = useState(false);
    const dropdownRef = useRef(null);
    const inputRef = useRef(null);
    const mapRef = useRef(null);
    const [address, setAddress] = useState(() => {
        // Lấy địa chỉ từ localStorage khi khởi tạo
        return localStorage.getItem('placeAddress') || "";
    });
    const [selectedLocation, setSelectedLocation] = useState(() => {
        // Lấy thông tin location từ localStorage
        const saved = localStorage.getItem('placeLocation');
        return saved ? JSON.parse(saved) : null;
    });
    const { setProgress } = useProgress();

    useEffect(() => {
        setProgress('45%');
    }, []);

    // Lưu địa chỉ vào localStorage khi có thay đổi
    useEffect(() => {
        localStorage.setItem('placeAddress', address);
    }, [address]);

    // Lưu location vào localStorage khi có thay đổi
    useEffect(() => {
        if (selectedLocation) {
            localStorage.setItem('placeLocation', JSON.stringify(selectedLocation));
        }
    }, [selectedLocation]);

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

    return (
        <div className="min-h-screen flex flex-col">
            <div className="flex-1 px-20 py-8">
                {/* Main content */}
                <div className="max-w-2xl mx-auto">
                    <h1 className="text-[32px] font-medium mb-2">
                        Chỗ ở của bạn nằm ở đâu?
                    </h1>
                    <p className="text-gray-600 mb-8">
                        Địa chỉ của bạn chỉ được chia sẻ với khách sau khi họ đặt phòng thành công.
                    </p>

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
            <div className="fixed bottom-0 left-0 right-0 border-t bg-white">
                <div className="max-w-screen-lg mx-auto px-20 py-4 flex justify-between items-center">
                    <Link to="/account/places/privacy-type" className="px-4 py-2 rounded-lg border border-gray-200 font-medium bg-white">
                        Quay lại
                    </Link>
                    <Link to="/account/places/floor-plan" className="px-6 py-3 rounded-lg bg-black text-white hover:bg-gray-800">
                        Tiếp theo
                    </Link>
                </div>
            </div>
        </div>
    );
} 
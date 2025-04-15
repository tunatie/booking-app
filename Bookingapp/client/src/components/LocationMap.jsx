import { useEffect, useState, useRef } from 'react';
import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icon
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Component để cập nhật view của map
function ChangeView({ center, zoom, mapRef }) {
    const map = useMap();
    if (mapRef) {
        mapRef.current = map;
    }
    map.setView(center, zoom);
    return null;
}

export default function LocationMap({ address, onLocationSelect, mapRef }) {
    const [position, setPosition] = useState([10.823140, 106.622594]); // Default to Ho Chi Minh City
    const [zoom, setZoom] = useState(13);
    const searchTimeout = useRef(null);

    // Hàm tìm kiếm địa chỉ với debounce
    const searchAddress = async (searchText) => {
        if (!searchText) return;
        
        try {
            const response = await fetch(
                `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchText)}&limit=1`
            );
            const data = await response.json();
            
            if (data && data.length > 0) {
                const { lat, lon } = data[0];
                const newPosition = [parseFloat(lat), parseFloat(lon)];
                setPosition(newPosition);
                setZoom(16); // Zoom in khi tìm thấy địa chỉ

                if (onLocationSelect) {
                    onLocationSelect({
                        lat: parseFloat(lat),
                        lng: parseFloat(lon),
                        address: data[0].display_name,
                        fromMap: true
                    });
                }
            }
        } catch (error) {
            console.error('Error searching address:', error);
        }
    };

    // Xử lý debounce khi address thay đổi
    useEffect(() => {
        if (searchTimeout.current) {
            clearTimeout(searchTimeout.current);
        }

        if (address) {
            searchTimeout.current = setTimeout(() => {
                searchAddress(address);
            }, 1000); // Đợi 1 giây sau khi người dùng ngừng gõ
        }

        return () => {
            if (searchTimeout.current) {
                clearTimeout(searchTimeout.current);
            }
        };
    }, [address]);

    return (
        <MapContainer
            center={position}
            zoom={zoom}
            style={{ height: '100%', width: '100%', borderRadius: '12px' }}
            zoomControl={false} // Tắt nút zoom mặc định
        >
            <ChangeView center={position} zoom={zoom} mapRef={mapRef} />
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker position={position} />
            {/* Thêm nút zoom vào góc phải dưới */}
            <div className="leaflet-bottom leaflet-right" style={{ margin: '20px' }}>
                <div className="flex flex-col gap-2">
                    <button 
                        onClick={() => setZoom(prev => Math.min(prev + 1, 18))}
                        className="w-8 h-8 bg-white rounded-sm shadow-md flex items-center justify-center hover:bg-gray-50"
                    >
                        <span className="text-xl font-bold">+</span>
                    </button>
                    <button 
                        onClick={() => setZoom(prev => Math.max(prev - 1, 1))}
                        className="w-8 h-8 bg-white rounded-sm shadow-md flex items-center justify-center hover:bg-gray-50"
                    >
                        <span className="text-xl font-bold">−</span>
                    </button>
                </div>
            </div>
        </MapContainer>
    );
} 
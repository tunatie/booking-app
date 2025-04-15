import React, { useState } from 'react';

const FilterModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const [rooms, setRooms] = useState({
    bedrooms: 0,
    beds: 0,
    bathrooms: 0
  });

  const [selectedAmenities, setSelectedAmenities] = useState([]);
  const [selectedAccommodationType, setSelectedAccommodationType] = useState(null);

  const handleIncrement = (type) => {
    setRooms(prev => ({
      ...prev,
      [type]: prev[type] + 1
    }));
  };

  const handleDecrement = (type) => {
    setRooms(prev => ({
      ...prev,
      [type]: Math.max(0, prev[type] - 1)
    }));
  };

  const getDisplayValue = (type) => {
    const value = rooms[type];
    return value === 0 ? "Bất kì" : `${value}+`;
  };

  const handleAmenityClick = (amenity) => {
    setSelectedAmenities(prev => {
      if (prev.includes(amenity)) {
        return prev.filter(a => a !== amenity);
      }
      return [...prev, amenity];
    });
  };

  const handleAccommodationTypeClick = (type) => {
    setSelectedAccommodationType(prev => prev === type ? null : type);
  };

  const handleReset = () => {
    setRooms({
      bedrooms: 0,
      beds: 0,
      bathrooms: 0
    });
    setSelectedAmenities([]);
    setSelectedAccommodationType(null);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-25 z-50 flex items-center justify-center">
      <div className="bg-white w-full max-w-2xl rounded-xl shadow-xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <button onClick={onClose} className="hover:border hover:border-gray-200 p-2 rounded-full">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <span className="font-semibold">Bộ lọc</span>
          <div className="w-4"></div> {/* Spacer for centering */}
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto flex-1">
          <div className="space-y-8">
            {/* Khoảng giá */}
            <div>
              <h3 className="text-xl font-semibold mb-4">Khoảng giá</h3>
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="block text-sm font-medium mb-2">Giá tối thiểu</label>
                  <input type="text" placeholder="₫" className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-black focus:border-transparent" />
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium mb-2">Giá tối đa</label>
                  <input type="text" placeholder="₫" className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-black focus:border-transparent" />
                </div>
              </div>
            </div>

            {/* Loại nơi ở */}
            <div>
              <h3 className="text-xl font-semibold mb-4">Loại nơi ở</h3>
              <div className="grid grid-cols-2 gap-4">
                <button 
                  onClick={() => handleAccommodationTypeClick('entire')}
                  className={`p-4 border rounded-xl text-left transition-colors ${
                    selectedAccommodationType === 'entire'
                      ? 'border-black bg-gray-200'
                      : 'border-gray-200 bg-white hover:border-gray-950'
                  }`}
                >
                  <div className="font-medium">Nguyên căn</div>
                  <div className="text-sm text-gray-500">Một nơi ở riêng tư</div>
                </button>
                <button 
                  onClick={() => handleAccommodationTypeClick('private')}
                  className={`p-4 border rounded-xl text-left transition-colors ${
                    selectedAccommodationType === 'private'
                      ? 'border-black bg-gray-200'
                      : 'border-gray-200 bg-white hover:border-gray-950'
                  }`}
                >
                  <div className="font-medium">Phòng riêng</div>
                  <div className="text-sm text-gray-500">Phòng riêng trong một nơi ở</div>
                </button>
                <button 
                  onClick={() => handleAccommodationTypeClick('shared')}
                  className={`p-4 border rounded-xl text-left transition-colors ${
                    selectedAccommodationType === 'shared'
                      ? 'border-black bg-gray-200'
                      : 'border-gray-200 bg-white hover:border-gray-950'
                  }`}
                >
                  <div className="font-medium">Phòng chung</div>
                  <div className="text-sm text-gray-500">Không gian chung trong một nơi ở</div>
                </button>
              </div>
            </div>

            {/* Phòng và phòng ngủ */}
            <div>
              <h3 className="text-xl font-semibold mb-4">Phòng và phòng ngủ</h3>
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <span>Phòng ngủ</span>
                  <div className="flex items-center gap-3">
                    <button 
                      onClick={() => handleDecrement('bedrooms')}
                      className="w-8 h-8 border rounded-full hover:border-gray-950 flex items-center justify-center"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12h-15" />
                      </svg>
                    </button>
                    <span className="min-w-[40px] text-center">{getDisplayValue('bedrooms')}</span>
                    <button 
                      onClick={() => handleIncrement('bedrooms')}
                      className="w-8 h-8 border rounded-full hover:border-gray-950 flex items-center justify-center"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                      </svg>
                    </button>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span>Giường</span>
                  <div className="flex items-center gap-3">
                    <button 
                      onClick={() => handleDecrement('beds')}
                      className="w-8 h-8 border rounded-full hover:border-gray-950 flex items-center justify-center"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12h-15" />
                      </svg>
                    </button>
                    <span className="min-w-[40px] text-center">{getDisplayValue('beds')}</span>
                    <button 
                      onClick={() => handleIncrement('beds')}
                      className="w-8 h-8 border rounded-full hover:border-gray-950 flex items-center justify-center"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                      </svg>
                    </button>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span>Phòng tắm</span>
                  <div className="flex items-center gap-3">
                    <button 
                      onClick={() => handleDecrement('bathrooms')}
                      className="w-8 h-8 border rounded-full hover:border-gray-950 flex items-center justify-center"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12h-15" />
                      </svg>
                    </button>
                    <span className="min-w-[40px] text-center">{getDisplayValue('bathrooms')}</span>
                    <button 
                      onClick={() => handleIncrement('bathrooms')}
                      className="w-8 h-8 border rounded-full hover:border-gray-950 flex items-center justify-center"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Tiện nghi */}
            <div>
              <h3 className="text-xl font-semibold mb-4">Tiện nghi</h3>
              <div className="grid grid-cols-2 gap-4">
                <button 
                  onClick={() => handleAmenityClick('wifi')}
                  className={`flex items-center gap-3 p-4 border rounded-2xl transition-colors ${
                    selectedAmenities.includes('wifi') 
                      ? 'border-black bg-gray-200' 
                      : 'border-gray-200 bg-white hover:border-gray-950'
                  }`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.288 15.038a5.25 5.25 0 017.424 0M5.106 11.856c3.807-3.808 9.98-3.808 13.788 0M1.924 8.674c5.565-5.565 14.587-5.565 20.152 0M12 12.75h.008v.008H12v-.008z" />
                  </svg>
                  <span>Wi-Fi</span>
                </button>
                <button 
                  onClick={() => handleAmenityClick('kitchen')}
                  className={`flex items-center gap-3 p-4 border rounded-2xl transition-colors ${
                    selectedAmenities.includes('kitchen') 
                      ? 'border-black bg-gray-200' 
                      : 'border-gray-200 bg-white hover:border-gray-950'
                  }`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.362 5.214A8.252 8.252 0 0112 21 8.25 8.25 0 016.038 7.048 8.287 8.287 0 009 9.6a8.983 8.983 0 013.361-6.867 8.21 8.21 0 003 2.48z" />
                  </svg>
                  <span>Bếp</span>
                </button>
                <button 
                  onClick={() => handleAmenityClick('washer')}
                  className={`flex items-center gap-3 p-4 border rounded-2xl transition-colors ${
                    selectedAmenities.includes('washer') 
                      ? 'border-black bg-gray-200' 
                      : 'border-gray-200 bg-white hover:border-gray-950'
                  }`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12c0-1.232-.046-2.453-.138-3.662a4.006 4.006 0 00-3.7-3.7 48.678 48.678 0 00-7.324 0 4.006 4.006 0 00-3.7 3.7c-.017.22-.032.441-.046.662M19.5 12l3-3m-3 3l-3-3m-12 3c0 1.232.046 2.453.138 3.662a4.006 4.006 0 003.7 3.7 48.656 48.656 0 007.324 0 4.006 4.006 0 003.7-3.7c.017-.22.032-.441.046-.662M4.5 12l3 3m-3-3l-3 3" />
                  </svg>
                  <span>Máy giặt</span>
                </button>
                <button 
                  onClick={() => handleAmenityClick('dryer')}
                  className={`flex items-center gap-3 p-4 border rounded-2xl transition-colors ${
                    selectedAmenities.includes('dryer') 
                      ? 'border-black bg-gray-200' 
                      : 'border-gray-200 bg-white hover:border-gray-950'
                  }`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
                  </svg>
                  <span>Máy sấy quần áo</span>
                </button>
                <button 
                  onClick={() => handleAmenityClick('ac')}
                  className={`flex items-center gap-3 p-4 border rounded-2xl transition-colors ${
                    selectedAmenities.includes('ac') 
                      ? 'border-black bg-gray-200' 
                      : 'border-gray-200 bg-white hover:border-gray-950'
                  }`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
                  </svg>
                  <span>Điều hòa nhiệt độ</span>
                </button>
                <button 
                  onClick={() => handleAmenityClick('heating')}
                  className={`flex items-center gap-3 p-4 border rounded-2xl transition-colors ${
                    selectedAmenities.includes('heating') 
                      ? 'border-black bg-gray-200' 
                      : 'border-gray-200 bg-white hover:border-gray-950'
                  }`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
                  </svg>
                  <span>Hệ thống sưởi</span>
                </button>
              </div>
              <button className="mt-4 text-black underline font-medium bg-white hover:opacity-70">
                Hiển thị thêm
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t">
          <button 
            onClick={handleReset} 
            className="underline font-medium hover:opacity-70 bg-white px-4 py-2 rounded-lg"
          >
            Xóa tất cả
          </button>
          <button className="bg-black text-white px-6 py-3 rounded-lg font-medium">
            Hiện 300+ chỗ ở
          </button>
        </div>
      </div>
    </div>
  );
};

export default FilterModal; 
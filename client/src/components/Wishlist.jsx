import React, { useState, useEffect } from 'react';

const Wishlist = () => {
  const [wishlists, setWishlists] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO: Fetch wishlists from API
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-semibold mb-6">Danh sách yêu thích</h1>

      {wishlists.length === 0 ? (
        <div className="text-center py-8">
          <div className="mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-16 h-16 mx-auto text-gray-400">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold mb-2">Tạo danh sách yêu thích đầu tiên của bạn</h2>
          <p className="text-gray-600">Khi bạn tìm thấy nơi bạn thích, hãy nhấp vào biểu tượng trái tim để lưu lại</p>
          <button className="mt-4 px-6 py-2 bg-rose-500 text-white rounded-lg hover:bg-rose-600 transition-colors">
            Bắt đầu tìm kiếm
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {wishlists.map((list) => (
            <div key={list.id} className="group relative">
              <div className="aspect-w-4 aspect-h-3 rounded-lg overflow-hidden">
                <img
                  src={list.coverImage}
                  alt={list.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                />
              </div>
              <div className="mt-2">
                <h3 className="font-medium">{list.name}</h3>
                <p className="text-gray-600 text-sm">{list.placesCount} địa điểm</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create New Wishlist Button */}
      <button className="fixed bottom-8 right-8 bg-rose-500 text-white rounded-full p-4 shadow-lg hover:bg-rose-600 transition-colors">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
        </svg>
      </button>
    </div>
  );
};

export default Wishlist; 
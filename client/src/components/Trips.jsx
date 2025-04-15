import React, { useState, useEffect } from 'react';

const Trips = () => {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('upcoming'); // upcoming, past, canceled

  useEffect(() => {
    // TODO: Fetch trips from API
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
      <h1 className="text-2xl font-semibold mb-6">Chuyến đi</h1>

      {/* Tabs */}
      <div className="flex space-x-8 border-b mb-6">
        <button
          className={`pb-4 px-2 ${
            activeTab === 'upcoming'
              ? 'border-b-2 border-black text-black'
              : 'text-gray-500'
          }`}
          onClick={() => setActiveTab('upcoming')}
        >
          Sắp tới
        </button>
        <button
          className={`pb-4 px-2 ${
            activeTab === 'past'
              ? 'border-b-2 border-black text-black'
              : 'text-gray-500'
          }`}
          onClick={() => setActiveTab('past')}
        >
          Đã đi qua
        </button>
        <button
          className={`pb-4 px-2 ${
            activeTab === 'canceled'
              ? 'border-b-2 border-black text-black'
              : 'text-gray-500'
          }`}
          onClick={() => setActiveTab('canceled')}
        >
          Đã hủy
        </button>
      </div>

      {trips.length === 0 ? (
        <div className="text-center py-8">
          <div className="mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-16 h-16 mx-auto text-gray-400">
              <path strokeLinecap="round" strokeLinejoin="round" d="M20.893 13.393l-1.135-1.135a2.252 2.252 0 01-.421-.585l-1.08-2.16a.414.414 0 00-.663-.107.827.827 0 01-.812.21l-1.273-.363a.89.89 0 00-.738 1.595l.587.39c.59.395.674 1.23.172 1.732l-.2.2c-.212.212-.33.498-.33.796v.41c0 .409-.11.809-.32 1.158l-1.315 2.191a2.11 2.11 0 01-1.81 1.025 1.055 1.055 0 01-1.055-1.055v-1.172c0-.92-.56-1.747-1.414-2.089l-.655-.261a2.25 2.25 0 01-1.383-2.46l.007-.042a2.25 2.25 0 01.29-.787l.09-.15a2.25 2.25 0 012.37-1.048l1.178.236a1.125 1.125 0 001.302-.795l.208-.73a1.125 1.125 0 00-.578-1.315l-.665-.332-.091.091a2.25 2.25 0 01-1.591.659h-.18c-.249 0-.487.1-.662.274a.931.931 0 01-1.458-1.137l1.411-2.353a2.25 2.25 0 00.286-.76m11.928 9.869A9 9 0 008.965 3.525m11.928 9.868A9 9 0 118.965 3.525" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold mb-2">Chưa có chuyến đi nào</h2>
          <p className="text-gray-600">Đến lúc phải sắp xếp một chuyến đi rồi!</p>
          <button className="mt-4 px-6 py-2 bg-rose-500 text-white rounded-lg hover:bg-rose-600 transition-colors">
            Bắt đầu tìm kiếm
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {trips.map((trip) => (
            <div key={trip.id} className="border rounded-lg overflow-hidden hover:shadow-md transition-shadow">
              <img
                src={trip.image}
                alt={trip.location}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h3 className="font-medium">{trip.location}</h3>
                <p className="text-gray-600 text-sm">{trip.dates}</p>
                <p className="text-gray-600 text-sm">{trip.status}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Trips; 
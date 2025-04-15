import { CalendarIcon, MoonIcon } from '@heroicons/react/24/outline';

export default function BookingDateDisplay({ checkIn, checkOut, nights }) {
    const formatDate = (date) => {
        return new Date(date).toLocaleDateString('vi-VN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    };

    return (
        <div className="flex items-center gap-2 text-gray-600">
            <div className="flex items-center gap-2">
                <CalendarIcon className="w-5 h-5 text-gray-900" />
                <div className="flex items-center gap-2">
                    <span className="font-medium">{formatDate(checkIn)}</span>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3" />
                    </svg>
                    <span className="font-medium">{formatDate(checkOut)}</span>
                </div>
            </div>
            <span className="mx-2 text-gray-400">·</span>
            <div className="flex items-center gap-1">
                <MoonIcon className="w-4 h-4 text-gray-900" />
                <span className="font-medium text-gray-900">{nights} đêm</span>
            </div>
        </div>
    );
} 
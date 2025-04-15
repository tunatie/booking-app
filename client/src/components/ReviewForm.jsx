import { useState } from 'react';
import RatingStars from './RatingStars';
import axios from 'axios';

export default function ReviewForm({ placeId }) {
    const [formData, setFormData] = useState({
        cleanliness: 5,
        accuracy: 5,
        communication: 5,
        location: 5,
        checkIn: 5,
        value: 5,
        comment: ''
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(`/api/places/${placeId}/reviews`, formData, {
                withCredentials: true
            });
            if (response.status === 201) {
                window.location.reload();
            }
        } catch (error) {
            alert(error.response?.data?.message || 'Something went wrong');
        }
    };

    const handleChange = (e) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Cleanliness</label>
                <RatingStars 
                    rating={formData.cleanliness} 
                    setRating={(value) => setFormData(prev => ({ ...prev, cleanliness: value }))} 
                />
            </div>

            <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Accuracy</label>
                <RatingStars 
                    rating={formData.accuracy} 
                    setRating={(value) => setFormData(prev => ({ ...prev, accuracy: value }))} 
                />
            </div>

            <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Communication</label>
                <RatingStars 
                    rating={formData.communication} 
                    setRating={(value) => setFormData(prev => ({ ...prev, communication: value }))} 
                />
            </div>

            <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Location</label>
                <RatingStars 
                    rating={formData.location} 
                    setRating={(value) => setFormData(prev => ({ ...prev, location: value }))} 
                />
            </div>

            <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Check-in</label>
                <RatingStars 
                    rating={formData.checkIn} 
                    setRating={(value) => setFormData(prev => ({ ...prev, checkIn: value }))} 
                />
            </div>

            <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Value</label>
                <RatingStars 
                    rating={formData.value} 
                    setRating={(value) => setFormData(prev => ({ ...prev, value: value }))} 
                />
            </div>

            <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Comment</label>
                <textarea
                    name="comment"
                    value={formData.comment}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    rows="4"
                    required
                />
            </div>

            <button
                type="submit"
                className="w-full px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
                Submit Review
            </button>
        </form>
    );
} 
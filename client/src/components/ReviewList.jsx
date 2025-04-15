import { useEffect, useState } from 'react';
import axios from 'axios';
import RatingStars from './RatingStars';

export default function ReviewList({ placeId }) {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchReviews = async () => {
            try {
                const response = await axios.get(`/api/places/${placeId}/reviews`);
                setReviews(response.data);
            } catch (error) {
                console.error('Error fetching reviews:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchReviews();
    }, [placeId]);

    if (loading) {
        return <div>Loading reviews...</div>;
    }

    if (reviews.length === 0) {
        return <div className="text-gray-500">No reviews yet</div>;
    }

    return (
        <div className="space-y-6">
            {reviews.map((review) => (
                <div key={review._id} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                            <img 
                                src={review.user.avatar || '/default-avatar.png'} 
                                alt={review.user.name}
                                className="w-8 h-8 rounded-full"
                            />
                            <span className="font-medium">{review.user.name}</span>
                        </div>
                        <div className="text-sm text-gray-500">
                            {new Date(review.createdAt).toLocaleDateString()}
                        </div>
                    </div>
                    
                    <div className="mb-2">
                        <RatingStars rating={review.rating} readOnly={true} />
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-2 text-sm">
                        <div>
                            <span className="text-gray-500">Cleanliness:</span>
                            <RatingStars rating={review.cleanliness} readOnly={true} />
                        </div>
                        <div>
                            <span className="text-gray-500">Accuracy:</span>
                            <RatingStars rating={review.accuracy} readOnly={true} />
                        </div>
                        <div>
                            <span className="text-gray-500">Communication:</span>
                            <RatingStars rating={review.communication} readOnly={true} />
                        </div>
                        <div>
                            <span className="text-gray-500">Location:</span>
                            <RatingStars rating={review.location} readOnly={true} />
                        </div>
                        <div>
                            <span className="text-gray-500">Check-in:</span>
                            <RatingStars rating={review.checkIn} readOnly={true} />
                        </div>
                        <div>
                            <span className="text-gray-500">Value:</span>
                            <RatingStars rating={review.value} readOnly={true} />
                        </div>
                    </div>

                    <p className="text-gray-700">{review.comment}</p>
                </div>
            ))}
        </div>
    );
} 
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import ReviewForm from '../components/ReviewForm';
import ReviewList from '../components/ReviewList';
import RatingStars from '../components/RatingStars';

export default function PlaceDetails() {
    const { id } = useParams();
    const [place, setPlace] = useState(null);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [placeResponse, userResponse] = await Promise.all([
                    axios.get(`/api/places/${id}`),
                    axios.get('/api/auth/profile', { withCredentials: true })
                ]);
                setPlace(placeResponse.data);
                setUser(userResponse.data);
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id]);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!place) {
        return <div>Place not found</div>;
    }

    return (
        <div className="max-w-4xl mx-auto p-4">
            <div className="mb-8">
                <h1 className="text-3xl font-bold mb-2">{place.title}</h1>
                <div className="flex items-center space-x-2 mb-4">
                    <RatingStars rating={place.averageRating} readOnly={true} />
                    <span className="text-gray-500">
                        ({place.totalReviews} {place.totalReviews === 1 ? 'review' : 'reviews'})
                    </span>
                </div>
                <img 
                    src={place.photos[0]} 
                    alt={place.title}
                    className="w-full h-96 object-cover rounded-lg"
                />
                <p className="mt-4 text-gray-700">{place.description}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                    <h2 className="text-2xl font-semibold mb-4">Reviews</h2>
                    <ReviewList placeId={id} />
                </div>

                {user && (
                    <div>
                        <h2 className="text-2xl font-semibold mb-4">Write a Review</h2>
                        <ReviewForm placeId={id} />
                    </div>
                )}
            </div>
        </div>
    );
} 
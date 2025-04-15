import { useState } from 'react';

export default function RatingStars({ rating, setRating, readOnly = false }) {
    const [hover, setHover] = useState(0);

    return (
        <div className="flex items-center">
            {[...Array(5)].map((star, index) => {
                const ratingValue = index + 1;
                return (
                    <button
                        key={index}
                        type="button"
                        className={`text-2xl ${!readOnly ? 'cursor-pointer' : 'cursor-default'} ${
                            ratingValue <= (hover || rating) ? 'text-yellow-400' : 'text-gray-300'
                        }`}
                        onClick={() => !readOnly && setRating(ratingValue)}
                        onMouseEnter={() => !readOnly && setHover(ratingValue)}
                        onMouseLeave={() => !readOnly && setHover(0)}
                    >
                        <span className="star">★</span>
                    </button>
                );
            })}
            {!readOnly && (
                <span className="ml-2 text-sm text-gray-500">
                    {rating} {rating === 1 ? 'star' : 'stars'}
                </span>
            )}
        </div>
    );
} 
import { UPLOADS_URL } from '../config';

export default function Image({ src, alt, className = '', ...props }) {
    // Nếu src bắt đầu bằng http hoặc https, đó là URL đầy đủ
    const imageUrl = src?.startsWith('http') 
        ? src 
        : `${UPLOADS_URL}/${src}`;

    return (
        <img
            src={imageUrl}
            alt={alt || 'Image'}
            className={`object-cover ${className}`}
            {...props}
        />
    );
} 
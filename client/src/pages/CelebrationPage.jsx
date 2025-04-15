import { useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { UserContext } from '../UserContext';

export default function CelebrationPage() {
    const { user } = useContext(UserContext);

    useEffect(() => {
        document.title = 'Chúc mừng bạn đã đăng mục cho thuê - Airbnb';
    }, []);

    return (
        <div className="fixed inset-0 flex">
            {/* Left side - Image */}
            <div className="w-1/2 relative z-10">
                <img 
                    src="/images/celebration-host.jpg" 
                    alt="Celebration" 
                    className="w-full h-full object-cover"
                />
            </div>

            {/* Right side - Content */}
            <div className="w-1/2 bg-black text-white flex flex-col justify-center px-24">
                <h1 className="text-[52px] font-medium mb-6">
                    Xin chúc mừng<br />
                    {user?.name}!
                </h1>
                
                <p className="text-lg mb-12">
                    Hoàn nghênh bạn đăng mục cho thuê – Lời chia vui từ Chủ nhà đến Chủ nhà. 
                    Cảm ơn bạn đã chia sẻ nhà mình và giúp tạo ra những trải nghiệm tuyệt vời cho các vị khách của chúng ta.
                </p>

                <div className="mb-12">
                    <img 
                        src="/images/TunaTiek-signature.png" 
                        alt="Signature" 
                        className="h-24 mb-2"
                    />
                    <p className="text-lg">
                        Tuấn Kiệt, Tổng giám đốc điều hành
                    </p>
                </div>

                <Link 
                    to="/account/hosting/listings"
                    className="inline-block bg-[#FF385C] text-white px-6 py-3 rounded-lg font-medium w-fit"
                >
                    Hoàn tất
                </Link>
            </div>
        </div>
    );
} 
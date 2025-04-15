import { useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useState } from "react";
import BookingWidget from "../BookingWidget";
import PlaceGallery from "../PlaceGallery";

export default function PlacePage() {
    const {id} = useParams();
    const [place,setPlace] = useState(null);
    const [showAllAmenities, setShowAllAmenities] = useState(false);

    useEffect(() => {
        if(!id) {
            return;
        }
        axios.get(`/places/${id}`).then(response => {
            setPlace(response.data);
        });
    },[id]);

    if(!place) return '';
    
    const amenities = [
        {
            title: "Tiện nghi chung",
            items: [
                { name: "Wi-Fi", icon: "M8.288 15.038a5.25 5.25 0 017.424 0M5.106 11.856c3.807-3.808 9.98-3.808 13.788 0M1.924 8.674c5.565-5.565 14.587-5.565 20.152 0M12.53 18.22l-.53.53-.53-.53a.75.75 0 011.06 0z" },
                { name: "TV", icon: "M6 20.25h12m-7.5-3v3m3-3v3m-10.125-3h17.25c.621 0 1.125-.504 1.125-1.125V4.875c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125z" },
                { name: "Bếp", icon: "M13.5 21v-7.5a.75.75 0 01.75-.75h3a.75.75 0 01.75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349m-16.5 11.65V9.35m0 0a3.001 3.001 0 003.75-.615A2.993 2.993 0 009.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 002.25 1.016c.896 0 1.7-.393 2.25-1.016a3.001 3.001 0 003.75.614m-16.5 0a3.004 3.004 0 01-.621-4.72L4.318 3.44A1.5 1.5 0 015.378 3h13.243a1.5 1.5 0 011.06.44l1.19 1.189a3 3 0 01-.621 4.72m-13.5 8.65h3.75a.75.75 0 00.75-.75V13.5a.75.75 0 00-.75-.75H6.75a.75.75 0 00-.75.75v3.75c0 .415.336.75.75.75z" },
                { name: "Máy giặt", icon: "M8.25 21v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21m0 0h4.5V3.545M12.75 21h7.5V10.75M2.25 21h1.5m18 0h-18M2.25 9l4.5-1.636M18.75 3l-1.5.545m0 6.205l3 1m1.5.5l-1.5-.5M6.75 7.364V3h-3v18m3-13.636l10.5-3.819" },
                { name: "Điều hòa", icon: "M21 10.5h.375c.621 0 1.125.504 1.125 1.125v2.25c0 .621-.504 1.125-1.125 1.125H21M4.5 10.5h6.75V15H4.5v-4.5zM3.75 18h15A2.25 2.25 0 0021 15.75v-6a2.25 2.25 0 00-2.25-2.25h-15A2.25 2.25 0 001.5 9.75v6A2.25 2.25 0 003.75 18z" }
            ]
        },
        {
            title: "Tiện nghi phòng ngủ và phòng tắm",
            items: [
                { name: "Khăn tắm", icon: "M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 00.75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 00-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0112 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 01-.673-.38m0 0A2.18 2.18 0 013 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 013.413-.387m7.5 0V5.25A2.25 2.25 0 0013.5 3h-3a2.25 2.25 0 00-2.25 2.25v.894m7.5 0a48.667 48.667 0 00-7.5 0M12 12.75h.008v.008H12v-.008z" },
                { name: "Dầu gội, dầu xả", icon: "M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23-.693L5 14.5m14.8.8l1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0112 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5" },
                { name: "Máy sấy tóc", icon: "M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" }
            ]
        }
    ];

    const reviews = [
        {
            id: 1,
            user: {
                name: "Mai Anh",
                avatar: "https://a0.muscache.com/im/pictures/user/User-369818078/original/4e49d71d-3404-44bf-a565-c0b96b34da5d.jpeg"
            },
            rating: 5,
            date: "tháng 3 năm 2024",
            content: "Căn hộ rất đẹp và sạch sẽ. Chủ nhà rất thân thiện và nhiệt tình. Vị trí thuận tiện, gần trung tâm."
        },
        {
            id: 2,
            user: {
                name: "Hoàng Nam",
                avatar: "https://a0.muscache.com/im/pictures/user/User-369818078/original/4e49d71d-3404-44bf-a565-c0b96b34da5d.jpeg"
            },
            rating: 4,
            date: "tháng 2 năm 2024",
            content: "Phòng ốc thoáng mát, view đẹp. Trang thiết bị đầy đủ. Chỉ có điều wifi hơi chậm."
        }
    ];
    
    // Thêm hàm để tạo Google Maps URL
    const getGoogleMapsUrl = (address) => {
        return `https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d125412.37141037365!2d106.62259486372392!3d10.823140940034454!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x317529292e8d3dd1%3A0xf15f5aad773c112b!2zVGjDoG5oIHBo4buRIEjhu5MgQ2jDrSBNaW5o!5e0!3m2!1svi!2s!4v1648032644317!5m2!1svi!2s`;
    };

    return (
        <div className="max-w-6xl mx-auto px-8">
            <h1 className="text-2xl font-semibold mt-4 mb-4">{place.title}</h1>
            <div className="flex gap-2 items-center mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
                </svg>
                <span className="font-medium">4.9</span>
                <span className="text-gray-500">·</span>
                <span className="underline font-medium">128 đánh giá</span>
                <span className="text-gray-500">·</span>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 18.75h-9m9 0a3 3 0 013 3h-15a3 3 0 013-3m9 0v-3.375c0-.621-.503-1.125-1.125-1.125h-.871M7.5 18.75v-3.375c0-.621.504-1.125 1.125-1.125h.872m5.007 0H9.497m5.007 0a7.454 7.454 0 01-.982-3.172M9.497 14.25a7.454 7.454 0 00.981-3.172M5.25 4.236c-.982.143-1.954.317-2.916.52A6.003 6.003 0 007.73 9.728M5.25 4.236V4.5c0 2.108.966 3.99 2.48 5.228M5.25 4.236V2.721C7.456 2.41 9.71 2.25 12 2.25c2.291 0 4.545.16 6.75.47v1.516M7.73 9.728a6.726 6.726 0 002.748 1.35m8.272-6.842V4.5c0 2.108-.966 3.99-2.48 5.228m2.48-5.492a46.32 46.32 0 012.916.52 6.003 6.003 0 01-5.395 4.972m0 0a6.726 6.726 0 01-2.749 1.35m0 0a6.772 6.772 0 01-3.044 0" />
                </svg>
                <span className="underline font-medium">Chủ nhà siêu cấp</span>
                <span className="text-gray-500">·</span>
                <a className="underline font-medium" target="_blank" href={'https://maps.google.com/?q='+place.address}>
                    {place.address}
                </a>
            </div>
            
            <PlaceGallery place={place}/>
            
            <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr] gap-8 mt-8">
                <div>
                    <div className="flex justify-between items-start">
                        <div>
                            <h2 className="text-2xl font-semibold">Toàn bộ căn hộ. Chủ nhà Airbnb</h2>
                            <div className="flex gap-4 mt-2 text-gray-500">
                                <span>{place.maxGuests} khách</span>
                                <span>·</span>
                                <span>2 phòng ngủ</span>
                                <span>·</span>
                                <span>2 giường</span>
                                <span>·</span>
                                <span>1 phòng tắm</span>
                            </div>
                        </div>
                        <div className="rounded-full overflow-hidden w-14 h-14">
                            <img className="w-full h-full object-cover" src="https://a0.muscache.com/im/pictures/user/User-369818078/original/4e49d71d-3404-44bf-a565-c0b96b34da5d.jpeg" alt="Host" />
                        </div>
                    </div>

                    <div className="border-b my-8"></div>

                    <div className="flex gap-4 mb-8">
                        <div className="p-4">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 21v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21m0 0h4.5V3.545M12.75 21h7.5V10.75M2.25 21h1.5m18 0h-18M2.25 9l4.5-1.636M18.75 3l-1.5.545m0 6.205l3 1m1.5.5l-1.5-.5M6.75 7.364V3h-3v18m3-13.636l10.5-3.819" />
                            </svg>
                        </div>
                        <div>
                            <h3 className="font-semibold mb-2">Tự nhận phòng</h3>
                            <p className="text-gray-500">Tự nhận phòng bằng khóa thông minh.</p>
                        </div>
                    </div>

                    <div className="flex gap-4 mb-8">
                        <div className="p-4">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" />
                            </svg>
                        </div>
                        <div>
                            <h3 className="font-semibold mb-2">Trải nghiệm nhận phòng tuyệt vời</h3>
                            <p className="text-gray-500">95% khách gần đây đã xếp hạng 5 sao cho quy trình nhận phòng.</p>
                        </div>
                    </div>

                    <div className="border-b my-8"></div>

                    <div className="mb-8">
                        <h2 className="font-semibold text-2xl mb-4">Giới thiệu về chỗ ở này</h2>
                        <p className="leading-6 text-gray-700">{place.description}</p>
                    </div>

                    <div className="border-b my-8"></div>

                    <div className="mb-8">
                        <h2 className="font-semibold text-2xl mb-6">Nơi bạn sẽ ngủ nghỉ</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="border rounded-xl p-4">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 mb-2">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5m8.25 3v6.75m0 0l-3-3m3 3l3-3M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
                                </svg>
                                <h3 className="font-medium mb-2">Phòng ngủ 1</h3>
                                <p className="text-gray-500">1 giường đôi</p>
                            </div>
                            <div className="border rounded-xl p-4">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 mb-2">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5m8.25 3v6.75m0 0l-3-3m3 3l3-3M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
                                </svg>
                                <h3 className="font-medium mb-2">Phòng ngủ 2</h3>
                                <p className="text-gray-500">1 giường đơn</p>
                            </div>
                        </div>
                    </div>

                    <div className="mb-8">
                        <h2 className="font-semibold text-2xl mb-6">Hình ảnh phòng</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-4">
                                <img 
                                    src="/bedroom1.jpg" 
                                    alt="Bedroom 1"
                                    className="w-full h-48 object-cover rounded-lg"
                                />
                                <h3 className="font-medium">Phòng ngủ chính</h3>
                                <ul className="text-gray-500 space-y-2">
                                    <li>• Giường đôi cỡ lớn</li>
                                    <li>• Smart TV 43 inch</li>
                                    <li>• Điều hòa</li>
                                    <li>• Tủ quần áo</li>
                                </ul>
                            </div>
                            <div className="space-y-4">
                                <img 
                                    src="/bathroom.jpg" 
                                    alt="Bathroom"
                                    className="w-full h-48 object-cover rounded-lg"
                                />
                                <h3 className="font-medium">Phòng tắm</h3>
                                <ul className="text-gray-500 space-y-2">
                                    <li>• Bồn tắm đứng</li>
                                    <li>• Máy nước nóng</li>
                                    <li>• Đầy đủ đồ vệ sinh</li>
                                    <li>• Khăn tắm</li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    <div className="border-b my-8"></div>

                    <div className="mb-8">
                        <h2 className="font-semibold text-2xl mb-6">Tiện nghi</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {amenities.slice(0, showAllAmenities ? amenities.length : 2).map((category, index) => (
                                <div key={index}>
                                    <h3 className="font-medium mb-4">{category.title}</h3>
                                    <div className="space-y-4">
                                        {category.items.map((item, itemIndex) => (
                                            <div key={itemIndex} className="flex gap-4 items-center">
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d={item.icon} />
                                                </svg>
                                                <span>{item.name}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                        <button 
                            onClick={() => setShowAllAmenities(!showAllAmenities)}
                            className="mt-4 px-6 py-2 border border-black rounded-lg hover:bg-gray-100"
                        >
                            {showAllAmenities ? 'Ẩn bớt' : 'Hiển thị tất cả tiện nghi'}
                        </button>
                    </div>

                    <div className="border-b my-8"></div>

                    <div className="mb-8">
                        <h2 className="font-semibold text-2xl mb-6">Đánh giá</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {reviews.map(review => (
                                <div key={review.id} className="space-y-4">
                                    <div className="flex items-center gap-4">
                                        <img src={review.user.avatar} alt={review.user.name} className="w-12 h-12 rounded-full object-cover" />
                                        <div>
                                            <h3 className="font-medium">{review.user.name}</h3>
                                            <p className="text-gray-500 text-sm">{review.date}</p>
                                        </div>
                                    </div>
                                    <p className="text-gray-700">{review.content}</p>
                                </div>
                            ))}
                        </div>
                        <button className="mt-6 px-6 py-2 border border-black rounded-lg hover:bg-gray-100">
                            Hiển thị tất cả đánh giá
                        </button>
                    </div>

                    <div className="border-b my-8"></div>

                    <div>
                        <h2 className="font-semibold text-2xl mb-4">Nơi bạn sẽ đến</h2>
                        <div className="w-full h-[300px] rounded-xl overflow-hidden border border-gray-200 mt-4">
                            <iframe
                                src={getGoogleMapsUrl(place.address)}
                                width="100%"
                                height="100%"
                                style={{ border: 0 }}
                                allowFullScreen=""
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                            ></iframe>
                        </div>
                    </div>

                    <div className="border-b my-8"></div>

                    <div className="mb-8">
                        <h2 className="font-semibold text-2xl mb-6">Nội quy nhà</h2>
                        <div className="space-y-4">
                            <div className="flex items-center gap-4">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <div>
                                    <p className="font-medium">Nhận phòng: {place.checkIn}</p>
                                    <p className="font-medium">Trả phòng: {place.checkOut}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                                </svg>
                                <p className="font-medium">Tối đa {place.maxGuests} khách</p>
                            </div>
                            <div className="flex items-center gap-4">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6.633 10.5c.806 0 1.533-.446 2.031-1.08a9.041 9.041 0 012.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 00.322-1.672V3a.75.75 0 01.75-.75A2.25 2.25 0 0116.5 4.5c0 1.152-.26 2.243-.723 3.218-.266.558.107 1.282.725 1.282h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 01-2.649 7.521c-.388.482-.987.729-1.605.729H13.48c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 00-1.423-.23H5.904M14.25 9h2.25M5.904 18.75c.083.205.173.405.27.602.197.4-.078.898-.523.898h-.908c-.889 0-1.713-.518-1.972-1.368a12 12 0 01-.521-3.507c0-1.553.295-3.036.831-4.398C3.387 10.203 4.167 9.75 5 9.75h1.053c.472 0 .745.556.5.96a8.958 8.958 0 00-1.302 4.665c0 1.194.232 2.333.654 3.375z" />
                                </svg>
                                <p className="font-medium">Không hút thuốc</p>
                            </div>
                            <div className="flex items-center gap-4">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.182 15.182a4.5 4.5 0 01-6.364 0M21 12a9 9 0 11-18 0 9 9 0 0118 0zM9.75 9.75c0 .414-.168.75-.375.75S9 10.164 9 9.75 9.168 9 9.375 9s.375.336.375.75zm-.375 0h.008v.015h-.008V9.75zm5.625 0c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75zm-.375 0h.008v.015h-.008V9.75z" />
                                </svg>
                                <p className="font-medium">Không thú cưng</p>
                            </div>
                        </div>
                    </div>

                    <div className="border-b my-8"></div>

                    <div className="mb-8">
                        <h2 className="font-semibold text-2xl mb-6">Chủ nhà của bạn</h2>
                        <div className="flex items-start gap-6">
                            <img src={place.owner.avatar} 
                                alt={place.owner.name} 
                                className="w-20 h-20 rounded-full object-cover" 
                            />
                            <div>
                                <h3 className="text-xl font-medium mb-2">{place.owner.name}</h3>
                                <div className="flex gap-4 text-gray-500 text-sm mb-4">
                                    <div className="flex items-center gap-2">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                                        </svg>
                                        <span>Đã tham gia vào {new Date(place.owner.createdAt).toLocaleDateString('vi-VN', { month: 'long', year: 'numeric' })}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
                                        </svg>
                                        <span>{place.owner.reviewCount} đánh giá</span>
                                    </div>
                                </div>
                                <div className="space-y-4 text-gray-700">
                                    <p>Tỉ lệ phản hồi: {place.owner.responseRate}%</p>
                                    <p>Thời gian phản hồi: {place.owner.responseTime}</p>
                                    <button className="px-6 py-2 border border-black rounded-lg hover:bg-gray-100 mt-4">
                                        Liên hệ với chủ nhà
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="border-b my-8"></div>

                    <div className="mb-8">
                        <h2 className="font-semibold text-2xl mb-6">Chính sách hủy phòng</h2>
                        <div className="bg-gray-50 p-6 rounded-xl">
                            <div className="flex items-start gap-4">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 flex-shrink-0">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" />
                                </svg>
                                <div>
                                    <h3 className="font-medium text-lg mb-2">Chính sách hủy linh hoạt</h3>
                                    <p className="text-gray-600 mb-4">Hủy miễn phí trước 48 giờ.</p>
                                    <button className="text-black underline font-medium">
                                        Tìm hiểu thêm
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="border-b my-8"></div>
                </div>
                <div>
                    <BookingWidget place={place}/>
                </div>
            </div>
        </div>
    );
}
import { Link, useNavigate } from "react-router-dom";
import { getNextPage } from "../utils/pageOrder";
import HeaderActions from "../components/HeaderActions";
import axios from "../utils/axios";  // Use configured axios instance
import { useEffect } from "react";

export default function OverviewPage() {
    const navigate = useNavigate();

    useEffect(() => {
        // Kiểm tra xem có phòng nào đang tạo không
        axios.get('/places-form-data')
            .then(({data}) => {
                if (data && data._id) {
                    console.log('Continuing with existing draft place');
                } else {
                    // Tạo mới nếu chưa có
                    createNewDraftPlace();
                }
            })
            .catch(error => {
                console.error('Error checking for draft place:', error);
                createNewDraftPlace();
            });
    }, []);

    async function createNewDraftPlace() {
        try {
            console.log('Creating new draft place');
            await axios.put('/places-form-data', { 
                title: '',
                draft: true,
                photos: []
            });
        } catch (error) {
            console.error('Error creating draft place:', error);
        }
    }

    async function handleNext() {
        // Xóa dữ liệu cũ khi bắt đầu tạo mới
        const keysToKeep = ['user', 'token'];
        Object.keys(localStorage).forEach(key => {
            if (!keysToKeep.includes(key)) {
                localStorage.removeItem(key);
            }
        });

        // Xóa dữ liệu trên server
        try {
            await axios.delete('/places-form-data');
        } catch (error) {
            console.error('Error clearing server data:', error);
        }

        navigate('/account/hosting/structure');  // Điều hướng trực tiếp đến trang structure
    }

    return (
        <div>
            <HeaderActions />
            
            <div className="mt-32 mb-24">
                <div className="w-full max-w-[1080px] mx-auto px-8">
                    <div className="grid grid-cols-2 gap-12">
                        <div>
                            <h1 className="text-[38px] leading-[44px] font-medium tracking-tight">
                                Bắt đầu trên TTK<br />
                                thật dễ dàng
                            </h1>
                        </div>

                        <div className="space-y-8">
                            <div className="flex items-start gap-5">
                                <div className="flex-1">
                                    <div className="flex items-start gap-3">
                                        <div className="text-lg">1</div>
                                        <div>
                                            <h2 className="text-lg font-medium mb-1">Chia sẻ thông tin về chỗ ở của bạn cho chúng tôi</h2>
                                            <p className="text-[#717171] text-sm leading-5">Chia sẻ một số thông tin cơ bản, như vị trí của nhà/phòng cho thuê và số lượng khách có thể ở tại đó.</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="w-[80px] h-[80px] flex-shrink-0">
                                    <img src="/images/overview-1.png" alt="" className="w-full h-full object-contain" />
                                </div>
                            </div>

                            <div className="flex items-start gap-5">
                                <div className="flex-1">
                                    <div className="flex items-start gap-3">
                                        <div className="text-lg">2</div>
                                        <div>
                                            <h2 className="text-lg font-medium mb-1">Làm cho nhà/phòng cho thuê trở nên nổi bật</h2>
                                            <p className="text-[#717171] text-sm leading-5">Thêm từ 5 ảnh trở lên cùng với tiêu đề và nội dung mô tả – chúng tôi sẽ giúp bạn thực hiện.</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="w-[80px] h-[80px] flex-shrink-0">
                                    <img src="/images/overview-2.png" alt="" className="w-full h-full object-contain" />
                                </div>
                            </div>

                            <div className="flex items-start gap-5">
                                <div className="flex-1">
                                    <div className="flex items-start gap-3">
                                        <div className="text-lg">3</div>
                                        <div>
                                            <h2 className="text-lg font-medium mb-1">Hoàn thiện và đăng mục cho thuê</h2>
                                            <p className="text-[#717171] text-sm leading-5">Chọn giá khởi điểm, xác minh một vài thông tin, sau đó đăng mục cho thuê của bạn.</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="w-[80px] h-[80px] flex-shrink-0">
                                    <img src="/images/overview-3.png" alt="" className="w-full h-full object-contain" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="fixed bottom-0 left-0 right-0 bg-white border-t">
                <div className="max-w-[1080px] mx-auto px-8 py-3 flex justify-end">
                    <button
                        onClick={handleNext}
                        className="min-w-[120px] px-6 py-2.5 rounded-lg text-base font-semibold bg-[#FF385C] text-white hover:bg-[#D70466]"
                    >
                        Bắt đầu
                    </button>
                </div>
            </div>
        </div>
    );
} 
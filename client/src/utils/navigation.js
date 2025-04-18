import { pageOrder } from './pageOrder';

export function getNextRoute(currentPage) {
    const currentIndex = pageOrder.indexOf(currentPage);
    if (currentIndex === -1 || currentIndex === pageOrder.length - 1) return null;
    return `/account/hosting/${pageOrder[currentIndex + 1]}`;
}

export function getPreviousRoute(currentPage) {
    const currentIndex = pageOrder.indexOf(currentPage);
    if (currentIndex <= 0) return null;
    return `/account/hosting/${pageOrder[currentIndex - 1]}`;
}

export function getFallbackRoute(currentPage) {
    const currentIndex = pageOrder.indexOf(currentPage);
    if (currentIndex === -1) return '/account/hosting/overview';
    return `/account/hosting/${pageOrder[Math.max(0, currentIndex - 1)]}`;
}

// Mapping of page names to their display titles
export const pageTitles = {
    'overview': 'Tổng quan về nhà/phòng cho thuê của bạn',
    'structure': 'Chia sẻ một số thông tin cơ bản về chỗ ở của bạn',
    'privacy-type': 'Khách sẽ đặt loại chỗ ở nào?',
    'location': 'Chỗ ở của bạn nằm ở đâu?',
    'floor-plan': 'Chia sẻ một số thông tin về chỗ ở của bạn',
    'stand-out': 'Hãy cho khách biết chỗ ở của bạn có gì đặc biệt',
    'amenities': 'Cho khách biết chỗ ở của bạn có những tiện nghi gì',
    'photos': 'Thêm một số ảnh về chỗ ở của bạn',
    'title': 'Đặt tiêu đề cho chỗ ở của bạn',
    'description': 'Tạo phần mô tả',
    'finish': 'Hoàn thiện và đăng',
    'booking-settings': 'Thiết lập đặt phòng',
    'guest-type': 'Chọn loại khách phù hợp',
    'price': 'Bây giờ, hãy đặt giá tiền',
    'discount': 'Thêm ưu đãi cho khách',
    'security': 'Thiết lập bảo mật',
    'receipt': 'Xem lại và đăng',
    'celebration': 'Chúc mừng bạn!'
}; 
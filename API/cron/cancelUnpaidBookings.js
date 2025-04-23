const cron = require('node-cron');
const Booking = require('../models/booking.model');

// Chạy mỗi giờ
cron.schedule('0 * * * *', async () => {
    try {
        console.log('Running auto cancel unpaid bookings job...');
        
        const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
        
        // Tìm các booking chưa thanh toán và đã tạo hơn 24h
        const unpaidBookings = await Booking.find({
            status: 'awaiting_payment',
            createdAt: { $lt: twentyFourHoursAgo }
        });

        console.log(`Found ${unpaidBookings.length} unpaid bookings to cancel`);

        // Hủy từng booking
        for (const booking of unpaidBookings) {
            booking.status = 'cancelled';
            booking.cancelReason = 'Tự động hủy do không thanh toán trong 24h';
            await booking.save();

            // TODO: Gửi email thông báo cho khách
        }

        console.log('Auto cancel job completed');

    } catch (error) {
        console.error('Auto cancel job error:', error);
    }
}); 
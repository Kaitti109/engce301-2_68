// services/booking.service.js
const BookingDB = require('../database/booking.db');

class BookingService {
    static async createBooking(bookingData) {
        // 1. ตรวจสอบระยะเวลาจอง (ห้ามเกิน 3 ชั่วโมง)
        const start = new Date(bookingData.start_time);
        const end = new Date(bookingData.end_time);
        const durationHours = (end - start) / (1000 * 60 * 60);

        if (durationHours > 3) {
            throw new Error('จองได้ครั้งละไม่เกิน 3 ชั่วโมง');
        }

        if (durationHours <= 0) {
            throw new Error('เวลาสิ้นสุดต้องมากกว่าเวลาเริ่ม');
        }

        // 2. ตรวจสอบการจองล่วงหน้า (ห้ามเกิน 30 วัน)
        const now = new Date();
        const daysAhead = (start - now) / (1000 * 60 * 60 * 24);
        if (daysAhead > 30) {
            throw new Error('จองล่วงหน้าได้ไม่เกิน 30 วัน');
        }

        // 3. ตรวจสอบว่าห้องว่างในช่วงเวลานั้นหรือไม่ (Overlap Check)
        const isAvailable = await BookingDB.checkRoomAvailability(
            bookingData.room_id,
            bookingData.start_time,
            bookingData.end_time
        );

        if (!isAvailable) {
            throw new Error('ห้องประชุมถูกจองแล้วในช่วงเวลาดังกล่าว');
        }

        // 4. บันทึกลงฐานข้อมูล
        return await BookingDB.create({
            ...bookingData,
            status: 'pending' // สถานะเริ่มต้นเป็นรอดำเนินการ
        });
    }

    static async cancelBooking(id) {
        // ตรวจสอบว่ามีข้อมูลการจองนี้อยู่จริง
        const booking = await BookingDB.findById(id);
        if (!booking) {
            throw new Error('ไม่พบข้อมูลการจอง');
        }
        return await BookingDB.updateStatus(id, 'cancelled');
    }
}

module.exports = BookingService;
// controllers/booking.controller.js
const BookingService = require('../services/booking.service');

class BookingController {
    /**
     * สร้างการจองใหม่ (POST /api/bookings)
     */
    static async createBooking(req, res) {
        try {
            // 1. รับข้อมูลจาก Request Body
            const { room_id, start_time, end_time, purpose } = req.body;
            
            // สมมติ user_id จากระบบ Auth (ในงานจริงจะได้จาก Middleware)
            const user_id = 1; 

            // 2. Validate ข้อมูลเบื้องต้น (ห้ามค่าว่าง)
            if (!room_id || !start_time || !end_time || !purpose) {
                return res.status(400).json({ 
                    success: false, 
                    message: "กรุณากรอกข้อมูลให้ครบถ้วน (room_id, start_time, end_time, purpose)" 
                });
            }

            // 3. ส่งต่อให้ Service Layer จัดการ Business Logic
            const newBooking = await BookingService.createBooking({
                user_id,
                room_id,
                start_time,
                end_time,
                purpose
            });

            // 4. ส่งผลลัพธ์กลับไปยัง Client
            return res.status(201).json({
                success: true,
                message: "สร้างการจองสำเร็จ",
                data: newBooking
            });

        } catch (error) {
            // 5. การจัดการ Error (เช่น กรณีจองซ้อน หรือจองเกิน 3 ชม.)
            return res.status(400).json({
                success: false,
                message: error.message || "เกิดข้อผิดพลาดในการจอง"
            });
        }
    }

    /**
     * ยกเลิกการจอง (DELETE /api/bookings/:id)
     */
    static async cancelBooking(req, res) {
        try {
            const bookingId = req.params.id;

            await BookingService.cancelBooking(bookingId);

            return res.status(200).json({
                success: true,
                message: "ยกเลิกการจองสำเร็จ"
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: "ไม่สามารถยกเลิกการจองได้: " + error.message
            });
        }
    }
}

module.exports = BookingController;
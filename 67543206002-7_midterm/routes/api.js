// routes/api.js
const express = require('express');
const router = express.Router();

// นำเข้า Controller จากโฟลเดอร์ controllers
const BookingController = require('../controllers/booking.controller');
const RoomController = require('../controllers/room.controller');

// นำเข้า Middleware สำหรับตรวจสอบสิทธิ์ (ถ้ามี)
// const authMiddleware = require('../middleware/auth');

/**
 * ROUTES สำหรับ ROOMS
 */
// GET /api/rooms - ดึงรายการห้องทั้งหมด (พร้อม Filtering)
router.get('/rooms', RoomController.getAllRooms);

/**
 * ROUTES สำหรับ BOOKINGS
 */
// POST /api/bookings - สร้างการจองใหม่ (ต้องผ่านการ Validation ใน Layer ถัดไป)
// หมายเหตุ: ใส่ authMiddleware เพื่อตรวจสอบว่าใครเป็นคนจอง
router.post('/bookings', BookingController.createBooking);

// DELETE /api/bookings/:id - ยกเลิกการจอง
router.delete('/bookings/:id', BookingController.cancelBooking);

module.exports = router;
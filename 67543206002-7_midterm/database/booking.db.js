// database/booking.db.js
// สมมติว่ามีไฟล์ connection.js สำหรับเชื่อมต่อ DB
const db = require('../config/database'); 

class BookingDatabase {
    static async create(data) {
        const sql = `
            INSERT INTO bookings 
            (user_id, room_id, start_time, end_time, purpose, status)
            VALUES (?, ?, ?, ?, ?, ?)
        `;
        const values = [data.user_id, data.room_id, data.start_time, data.end_time, data.purpose, data.status];
        
        // คืนค่า ID ที่เพิ่ง insert และข้อมูลการจอง
        const [result] = await db.execute(sql, values);
        return { id: result.insertId, ...data };
    }

    static async checkRoomAvailability(room_id, start, end) {
        // SQL สำหรับเช็คว่าเวลาที่จองใหม่ มีการซ้อนทับกับรายการที่อนุมัติแล้วหรือไม่
        const sql = `
            SELECT * FROM bookings
            WHERE room_id = ? 
            AND status != 'cancelled'
            AND (
                (start_time < ? AND end_time > ?) -- เช็คการซ้อนทับของเวลา
            )
        `;
        const [rows] = await db.execute(sql, [room_id, end, start]);
        return rows.length === 0; // ถ้า length เป็น 0 แสดงว่าว่าง
    }

    static async findById(id) {
        const [rows] = await db.execute('SELECT * FROM bookings WHERE id = ?', [id]);
        return rows[0];
    }

    static async updateStatus(id, status) {
        const sql = 'UPDATE bookings SET status = ? WHERE id = ?';
        return await db.execute(sql, [status, id]);
    }
}

module.exports = BookingDatabase;
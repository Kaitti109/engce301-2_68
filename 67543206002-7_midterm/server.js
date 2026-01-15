const express = require('express');
const app = express();
const PORT = 3000;

// ... ส่วนที่เรียกใช้ Middleware และ Routes ...

// ⚠️ สำคัญมาก: ต้องมีคำสั่งนี้ที่ท้ายไฟล์ server.js
app.listen(PORT, () => {
    console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
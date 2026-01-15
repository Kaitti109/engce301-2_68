// ข้อมูลห้องประชุมจำลอง
const rooms = [
    { id: 1, name: "ห้องประชุม วิศวะ 1", capacity: 15 },
    { id: 2, name: "ห้องสัมมนา A", capacity: 40 },
    { id: 3, name: "ห้องกลุ่มย่อย B302", capacity: 6 }
];

// ใช้ Date.now() เป็น ID จำลองเพื่อให้ลบได้ถูกต้อง
let myBookings = [
    { id: 101, date: '2026-01-14', room: 'ห้องประชุม วิศวะ 1', time: '10:00 - 12:00', status: 'Approved' }
];

let selectedRoom = null;

function searchRooms() {
    const tbody = document.getElementById('roomTableBody');
    tbody.innerHTML = '';
    rooms.forEach(room => {
        tbody.innerHTML += `
            <tr>
                <td><strong>${room.name}</strong></td>
                <td>${room.capacity} ที่นั่ง</td>
                <td><button class="btn btn-book" onclick="openModal(${room.id})">เลือกห้อง</button></td>
            </tr>
        `;
    });
    document.getElementById('resultsSection').classList.remove('hidden');
}

function openModal(id) {
    selectedRoom = rooms.find(r => r.id === id);
    document.getElementById('modalTitle').innerText = `จอง ${selectedRoom.name}`;
    document.getElementById('bookingModal').style.display = 'flex';
}

function closeModal() {
    document.getElementById('bookingModal').style.display = 'none';
}

function confirmBooking() {
    const purpose = document.getElementById('purpose').value;
    const attendees = document.getElementById('attendees').value;

    if(!purpose || !attendees) return alert("กรุณากรอกข้อมูลให้ครบ");

    const date = document.getElementById('searchDate').value || '2026-01-15';
    const start = document.getElementById('startTime').value || '09:00';
    const end = document.getElementById('endTime').value || '12:00';

    myBookings.push({
        id: Date.now(), // สร้าง ID แบบสุ่มสำหรับรายการใหม่
        date: date,
        room: selectedRoom.name,
        time: `${start} - ${end}`,
        status: 'Pending'
    });

    alert("✅ บันทึกข้อมูลสำเร็จ!");
    renderHistory();
    closeModal();
}

// --- ฟังก์ชันสำหรับลบการจอง ---
function deleteBooking(id) {
    if (confirm("คุณแน่ใจหรือไม่ว่าต้องการยกเลิกการจองนี้?")) {
        // กรองเอาเฉพาะรายการที่ ID ไม่ตรงกับตัวที่ต้องการลบ
        myBookings = myBookings.filter(booking => booking.id !== id);
        
        // อัปเดตตารางประวัติทันที
        renderHistory();
        alert("🗑️ ยกเลิกการจองเรียบร้อยแล้ว");
    }
}

function renderHistory() {
    const tbody = document.getElementById('historyTableBody');
    tbody.innerHTML = '';
    
    if (myBookings.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" style="text-align:center;">ไม่มีประวัติการจอง</td></tr>';
        return;
    }

    myBookings.forEach(item => {
        const badgeClass = item.status === 'Approved' ? 'badge-approved' : 'badge-pending';
        tbody.innerHTML += `
            <tr>
                <td>${item.date}</td>
                <td>${item.room}</td>
                <td>${item.time}</td>
                <td><span class="badge ${badgeClass}">${item.status}</span></td>
                <td>
                    <button class="btn btn-delete" onclick="deleteBooking(${item.id})">ยกเลิก</button>
                </td>
            </tr>
        `;
    });
}

window.onload = renderHistory;
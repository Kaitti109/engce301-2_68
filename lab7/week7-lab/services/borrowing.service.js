const BorrowingDB = require("../database/borrowings.db");
const BookDB = require("../database/books.db");
const MemberDB = require("../database/members.db");

class BorrowingService {
  // ===== BORROW BOOK =====
  static async borrowBook(borrowData) {
    try {
      const { book_id, member_id } = borrowData;

      // TODO: 1. ตรวจสอบว่า book มีอยู่จริงและมีเล่มว่าง
      const book = await BookDB.findById(book_id);
      if (!book) {
        throw new Error("Book not found");
      }
      if (book.available_copies < 1) {
        throw new Error("No available copies for this book");
      }

      // TODO: 2. ตรวจสอบว่า member มีอยู่จริงและ status = 'active'
      const member = await MemberDB.findById(member_id);
      if (!member) {
        throw new Error("Member not found");
      }
      if (member.status !== "active") {
        throw new Error("Member is not active");
      }

      // TODO: 3. ตรวจสอบว่า member ยืมไม่เกิน 3 เล่ม
      const activeBorrowings = await BorrowingDB.countActiveBorrowingsByMember(
        member_id
      );
      if (activeBorrowings >= 3) {
        throw new Error("Member has reached the borrowing limit of 3 books");
      }

      // TODO: 4. คำนวณ due_date (14 วันจากวันนี้)
      const borrowDate = new Date();
      const dueDate = new Date();
      // เติมโค้ดคำนวณ due_date
      dueDate.setDate(borrowDate.getDate() + 14);

      // TODO: 5. สร้าง borrowing record
      const borrowing = await BorrowingDB.create({
        book_id,
        member_id,
        borrow_date: borrowDate.toISOString(),
        due_date: dueDate.toISOString(),
        status: "borrowed",
      });

      // TODO: 6. ลด available_copies
      await BookDB.decreaseAvailableCopies(book_id);

      return borrowing;
    } catch (error) {
      throw error;
    }
  }

  // ===== RETURN BOOK =====
  static async returnBook(borrowingId) {
    try {
      // TODO: 1. ดึงข้อมูล borrowing
      const borrowing = await BorrowingDB.findById(borrowingId);
      if (!borrowing) {
        throw new Error("Borrowing record not found");
      }

      // TODO: 2. ตรวจสอบว่ายังไม่คืน
      if (borrowing.status === "returned") {
        throw new Error("Book has already been returned");
      }

      // TODO: 3. บันทึก return_date และเปลี่ยน status
      const returnDate = new Date().toISOString();
      await BorrowingDB.updateReturn(borrowingId, {
        return_date: returnDate,
        status: "returned",
      });

      // TODO: 4. เพิ่ม available_copies
      await BookDB.increaseAvailableCopies(borrowing.book_id);

      // TODO: 5. คำนวณค่าปรับ (ถ้าเกิน due_date)
      // ค่าปรับ = 20 บาท/วัน
      const dueDate = new Date(borrowing.due_date);
      const actualReturnDate = new Date(returnDate);
      let fine = 0;
      if (actualReturnDate > dueDate) {
        const diffTime = Math.abs(actualReturnDate - dueDate);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        fine = diffDays * 20; // 20 บาท/วัน
      }

      return { borrowing, fine };
    } catch (error) {
      throw error;
    }
  }

  // TODO: เขียน getOverdueBorrowings
  static async getOverdueBorrowings() {
    // เขียนโค้ดตรงนี้
    try {
      const overdueBorrowings = await BorrowingDB.findOverdueBorrowings();
      return overdueBorrowings;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = BorrowingService;

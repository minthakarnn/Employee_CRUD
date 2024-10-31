window.addEventListener('turbo:load', () => {
  document.addEventListener('submit', (event) => {
    if (event.target && event.target.classList.contains('create_success')) {
      event.preventDefault(); // หยุดการส่งฟอร์มทันที

      Swal.fire({
        title: "Good job!",
        text: "Add new employee success",
        icon: "success",
        timer: 2000, // ตั้งเวลาให้แสดง SweetAlert เป็นเวลา 2 วินาที
        showConfirmButton: false // ไม่แสดงปุ่มยืนยัน
      }).then(() => {
        // ใช้ setTimeout เพื่อหน่วงเวลาในการส่งฟอร์ม
        setTimeout(() => {
          event.target.submit(); // ส่งฟอร์มหลังจาก SweetAlert แสดงเสร็จ
        }, 1000); // หน่วงเวลา 2 วินาที
      });
    }
  });
});
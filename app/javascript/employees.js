// document.addEventListener("turbo:load", () => {
//     fetchEmployeeData(); // เรียกใช้ฟังก์ชันเพื่อดึงข้อมูลพนักงาน

//     function fetchEmployeeData() {
//         const employeeDataElement = document.getElementById("employee-data");
//         if (!employeeDataElement) {
//             return; // ออกจากฟังก์ชันถ้าไม่พบองค์ประกอบ
//         }

//         const url = employeeDataElement.dataset.employeesUrl; // ดึง URL
//         fetch(url)
//             .then(response => {
//                 if (!response.ok) throw new Error('Network response was not ok');
//                 return response.json();
//             })
//             .then(data => renderEmployeeTable(data)) // แสดงข้อมูลในตาราง
//             .catch(error => console.error('Error fetching employee data:', error));
//     }

//     function renderEmployeeTable(employees) {
//     const tableBody = document.querySelector("#employee-table tbody");
//     tableBody.innerHTML = ''; // เคลียร์ข้อมูลเก่าก่อน

//     if (employees.length === 0) {
//         const row = tableBody.insertRow();
//         const cell = row.insertCell(0);
//         cell.colSpan = 4; // ปรับ colspan ให้ครอบคลุมทุกคอลัมน์
//         cell.className = "text-center";
//         cell.textContent = "No employees found"; // แสดงข้อความถ้าไม่มีข้อมูล
//         return;
//     }

//     employees.forEach((employee, index) => {
//         const row = tableBody.insertRow();
//         const uniqueHobbies = [...new Set(employee.hobbies)]; // ลบ hobbies ที่ซ้ำ

//         row.innerHTML = `
//             <td class="text-center">${index + 1}</td>
//             <td class="text-center">${employee.employee_name}</td>
//             <td class="text-center">${uniqueHobbies.join(", ")}</td>
//             <td class="text-center">
//                 <button class="btn-success" onclick="showEmployee(${employee.id})">Show</button>
//                 <button class="btn-primary" onclick="editEmployee(${employee.id})">Edit</button>
//                 <button class="btn-danger" onclick="deleteEmployee(${employee.id})">Delete</button>
//             </td>
//         `;
//     });
// }

//     // ฟังก์ชันจัดการปุ่ม
//     window.showEmployee = function(id) {
//         console.log("Showing employee with ID:", id);
//         window.location.href = `/employees/${id}`; // นำทางไปยังหน้ารายละเอียดพนักงาน
//     };

//     window.editEmployee = function(id) {
//         console.log("Editing employee with ID:", id);
//         window.location.href = `/employees/${id}/edit`; // นำทางไปยังหน้าการแก้ไข
//     };

//     window.deleteEmployee = function(id) {
//         console.log("Deleting employee with ID:", id);
//         if (confirm("Are you sure you want to delete this employee?")) {
//             fetch(`/employees/${id}`, {
//                 method: 'DELETE',
//                 headers: {
//                     'X-CSRF-Token': document.querySelector('meta[name="csrf-token"]').getAttribute('content')
//                 }
//             })
//             .then(response => {
//                 if (response.ok) {
//                     console.log("Employee deleted successfully");
//                     fetchEmployeeData(); // ดึงข้อมูลใหม่
//                 } else {
//                     console.error("Error deleting employee");
//                 }
//             })
//             .catch(error => console.error('Error:', error));
//         }
//     };
// });
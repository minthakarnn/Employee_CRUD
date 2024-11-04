document.addEventListener("DOMContentLoaded", function() {
  console.log("DOM fully loaded and parsed");
  
  const employeeDataElement = document.getElementById('employee-data');
  console.log("Employee Data Element:", employeeDataElement); // แสดงว่า element นี้ถูกโหลดหรือไม่

  if (employeeDataElement) {
    const url = employeeDataElement.getAttribute('data-employees-url');
    console.log("URL found:", url);
    
    fetch(url)
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        const tbody = document.querySelector("#employee-table tbody");
        tbody.innerHTML = ''; // ล้างตารางก่อน
        data.forEach((employee, index) => {
          const row = document.createElement("tr");
          row.innerHTML = `
            <td class="text-center">${index + 1}</td>
            <td class="text-center">${employee.employee_name}</td>
            <td class="text-center">${Array.isArray(employee.hobbies) ? employee.hobbies.join(", ") : employee.hobbies}</td>
            <td class="text-center"><a href="/employees/${employee.id}" class="btn-success border-0 rounded-pill shadow px-3 py-2">Show</a></td>
            <td class="text-center"><a href="/employees/${employee.id}/edit" class="btn-primary border-0 rounded-pill shadow px-3 py-2">Edit</a></td>
            <td class="text-center"><a data-confirm="Are you sure?" rel="nofollow" data-method="delete" href="/employees/${employee.id}" class="btn-danger border-0 rounded-pill shadow px-3 py-2">Delete</a></td>
          `;
          tbody.appendChild(row);
        });
      })
      .catch(error => console.error("Error loading data:", error));
  } else {
    console.error("Element with ID 'employee-data' not found.");
  }
});
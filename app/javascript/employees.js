document.addEventListener("DOMContentLoaded", function() {
    const employeesUrl = document.querySelector("#employee-table").dataset.employeesUrl;
    console.log("Fetching data from:", employeesUrl);

    fetch(employeesUrl)
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
    console.log("Fetched data:", data);
    const tbody = document.querySelector("#employee-table tbody");
    data.forEach((employee, index) => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td class="text-center">${index + 1}</td>
            <td class="text-center">${employee.employee_name}</td>
            <td class="text-center">${Array.isArray(employee.hobbies) ? employee.hobbies.join(", ") : employee.hobbies || "No hobbies"}</td>
            <td class="text-center"><a href="/employees/${employee.id}" class="btn-success border-0 rounded-pill shadow px-3 py-2">Show</a></td>
            <td class="text-center"><a href="/employees/${employee.id}/edit" class="btn-primary border-0 rounded-pill shadow px-3 py-2">Edit</a></td>
            <td class="text-center"><a data-confirm="Are you sure?" rel="nofollow" data-method="delete" href="/employees/${employee.id}" class="btn-danger border-0 rounded-pill shadow px-3 py-2">Delete</a></td>
        `;
        tbody.appendChild(row);
    });
})
      .catch(error => console.error("Error loading data:", error));
  });
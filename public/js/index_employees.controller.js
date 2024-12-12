angular.module('myApp', [])
  .config(['$httpProvider', function($httpProvider) {
    $httpProvider.defaults.headers.common['X-CSRF-Token'] =
      document.querySelector('meta[name="csrf-token"]').getAttribute('content');
  }])
  .controller('EmployeeController', function($scope, $http, $window) {
    const employeeDataElement = document.getElementById("employee-data");
    const url = employeeDataElement ? employeeDataElement.dataset.employeesUrl : '';
    
    $scope.isLoading = true;
    $http.get(url).then(function(response) {
      $scope.employees = response.data.map(function(employee) {
        if (typeof employee.hobbies === 'string') {
          // กรณีที่ hobbies เป็นสตริง ให้แยกค่าสตริงออกเป็นอาเรย์
          employee.hobbies = employee.hobbies.replace(/[\[\]"]+/g, '').split(', ');
        }
        return employee;
      });
      $scope.isLoading = false;
    }).catch(function(error) {
      console.error("Error loading data:", error);
      $scope.isLoading = false;
    });

    $scope.addEmployee = function() {
      if (confirm("Do you want to add a new employee?")) {
        window.location.href = "/employees/new";
      }
    };

    $scope.showEmployee = function(id) {
      console.log("Showing employee with ID:", id);
      window.location.href = `/employees/${id}`;
    };

    $scope.editEmployee = function(id) {
      console.log("Editing employee with ID:", id);
      window.location.href = `/employees/${id}/edit`;
    };
    $scope.viewAllEmployees = function() {
      window.location.href = "/employees";
    };
    $scope.dashboard = function() {
      window.location.href = "/dashboard";
    };

    $scope.deleteEmployee = function(id) {
      if (confirm("Are you sure you want to delete this employee?")) {
        $http.delete(`/employees/${id}`, {
          headers: {
            'X-CSRF-Token': document.querySelector('meta[name="csrf-token"]').getAttribute('content')
          }
        }).then(function(response) {
          console.log("Employee deleted successfully");
          $scope.employees = $scope.employees.filter(employee => employee.id !== id);
        }).catch(function(error) {
          console.error("Error deleting employee:", error);
          window.location.reload();
        });
      }
    };
    $scope.employees = [];
    $scope.currentPage = 1; // หน้าปัจจุบัน
    $scope.pageSize = 10;    // จำนวนรายการต่อหน้า
    $scope.changePage = function(direction) {
      if (direction === 'prev' && $scope.currentPage > 1) {
        $scope.currentPage--;
      } else if (direction === 'next' && $scope.currentPage < $scope.totalPages()) {
        $scope.currentPage++;
      }
    };
    $scope.paginateEmployees = function() {
      const start = ($scope.currentPage - 1) * $scope.pageSize;
      return $scope.employees.slice(start, start + $scope.pageSize);
    };

    $scope.totalPages = function() {
      return Math.ceil($scope.employees.length / $scope.pageSize);
    };

    $scope.logout = function() {
      $http.delete('/logout', { 
        headers: { 
          'X-CSRF-Token': document.querySelector('meta[name="csrf-token"]').getAttribute('content') 
        } 
      }).then(function(response) {
        console.log('Logged out successfully', response);
        location.reload();  
      }).catch(function(error) {
        console.error('Error logging out:', error);
        window.location.href = '/sessions/new';
      });
    };
  })
  .controller('EmployeeShowController', function($scope, $http) {
    console.log("EmployeeShowController Loaded");
    $scope.errors = [];
    $scope.employee = {};

    const employeeDataElement = document.getElementById("employee-data");
    const url = employeeDataElement ? employeeDataElement.dataset.employeesUrl : '';

    if (url) {
      $http.get(url, { headers: { 'Accept': 'application/json' } })
        .then(function(response) {
          console.log("Employee data:", response.data);
          $scope.employee = response.data;
          if (typeof $scope.employee.hobbies === 'string') {
            $scope.employee.hobbies = JSON.parse($scope.employee.hobbies);
          }
        })
        .catch(function(error) {
          $scope.errors.push("Error fetching employee data.");
          console.error("Error fetching employee data:", error);
        });
    } else {
      $scope.errors.push("Employee ID not provided.");
    }

    $scope.editEmployee = function(id) {
      window.location.href = `/employees/${id}/edit`;
    };

    $scope.deleteEmployee = function(id) {
      if (confirm("Are you sure you want to delete this employee?")) {
        $http.delete(`/employees/${id}`, {
          headers: {
            'Content-Type': 'application/json',
            'X-CSRF-Token': document.querySelector('meta[name="csrf-token"]').getAttribute('content')
          }
        }).then(function(response) {
          alert("Employee deleted successfully.");
          $scope.viewAllEmployees();
        }).catch(function(error) {
          window.location.href = '/employees/';
          return
        });
      }
    };

    $scope.viewAllEmployees = function() {
      window.location.href = "/employees";
    };
  })
  .controller('EmployeeFormController', function($scope, $http) {
    $scope.employee = {
      employee_name: '',
      gender: '',
      hobbies: [],
      career: ''
    };
    $scope.errors = [];

    $scope.toggleHobby = function(hobby) {
      const index = $scope.employee.hobbies.indexOf(hobby);
      if (index > -1) {
        $scope.employee.hobbies.splice(index, 1);
      } else {
        $scope.employee.hobbies.push(hobby);
      }
    };

    $scope.isSubmitting = false;

    $scope.saveEmployee = function() {
      $scope.errors = [];

      // Validation
      if (!$scope.employee.employee_name.trim()) {
        $scope.errors.push('Employee name is required.');
      }
      if (!$scope.employee.gender) {
        $scope.errors.push('Gender is required.');
      }
      if (!$scope.employee.career.trim()) {
        $scope.errors.push('Career is required.');
      }

      // หากมีข้อผิดพลาด ให้หยุดการทำงาน
      if ($scope.errors.length > 0) {
        return;
      }

      // ป้องกันการส่งซ้ำ
      if ($scope.isSubmitting) return;
      $scope.isSubmitting = true;

      // ส่งข้อมูลไปยังเซิร์ฟเวอร์
      $http.post('/employees', $scope.employee)
        .then(function(response) {
          window.location.href = "/employees";
        })
        .catch(function(error) {
          console.error('Error saving employee:', error);
          if (error.status === 500) {
            $scope.errors = ['Server error occurred. Please try again later.'];
          } else {
            $scope.errors = error.data.errors || ['An unexpected error occurred.'];
          }
        })
        .finally(function() {
          $scope.isSubmitting = false; // ปลดล็อกปุ่มส่ง
        });
    };
})
  .controller('EmployeeEditFormController', function($scope, $http) {
    $scope.employee = { hobbies: [] };
    $scope.errors = [];

    const pathSegments = window.location.pathname.split('/');
    const employeeId = pathSegments[pathSegments.length - 2];

    console.log("Employee ID from URL: ", employeeId);

    if (employeeId) {
      $http.get(`/employees/${employeeId}.json`).then(function(response) {
        console.log("Employee data fetched:", response.data);
        let data = response.data;

        data.hobbies = typeof data.hobbies === 'string' 
          ? JSON.parse(data.hobbies) 
          : data.hobbies || [];

        $scope.employee = data;
      }).catch(function(error) {
        console.error("Error loading employee data:", error);
        $scope.errors.push("Error loading employee data.");
      });
    } else {
      console.error("Employee ID not found in URL.");
      $scope.errors.push("Employee ID not found in URL.");
    }

    $scope.toggleHobby = function(hobby) {
  const index = $scope.employee.hobbies.indexOf(hobby);
  if (index > -1) {
    $scope.employee.hobbies.splice(index, 1);
  } else {
    $scope.employee.hobbies.push(hobby);
  }
  // จัดเรียง hobbies ใหม่
  $scope.employee.hobbies.sort((a, b) => {
    const order = ["Reading", "Photography", "Travelling"];
    return order.indexOf(a) - order.indexOf(b);
  });
};

    $scope.updateEmployee = function() {
      const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');
      console.log("CSRF Token:", csrfToken);

      $http.put('/employees/' + employeeId, { employee: $scope.employee }, {
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-Token': csrfToken
        }
      }).then(function(response) {
        console.log("Employee updated successfully:", response.data);
      }).catch(function(error) {
        console.error("Error updating employee:", error);
        window.location.href = '/employees/';
      });
    };
  })
.controller('DashboardController', function($scope,$http) {
  
      // ฟังก์ชัน initialize สำหรับโหลดข้อมูล
     $scope.initialize = function() {
  // ตรวจสอบว่าค่ามีการส่งจาก Rails หรือไม่
  if (typeof totalEmployees !== 'undefined' && typeof newEmployees !== 'undefined' && typeof employeeGrowthData !== 'undefined') {
    $scope.totalEmployees = totalEmployees;
    $scope.newEmployees = newEmployees;
    $scope.employeeGrowthData = employeeGrowthData;

    // เตรียมข้อมูลสำหรับกราฟ
    $scope.months = Object.keys($scope.employeeGrowthData);
    $scope.growthData = Object.values($scope.employeeGrowthData);

    // สร้างกราฟ
    $scope.createChart();
  } else {
    console.error("Data is not correctly passed from Rails");
  }
};

      // ฟังก์ชันในการสร้างกราฟ
      $scope.createChart = function() {
        var ctx = document.getElementById('myChart').getContext('2d');
        var myChart = new Chart(ctx, {
          type: 'line',  // หรือ 'line', 'pie', ฯลฯ
          data: {
            labels: $scope.months, // แท็กสำหรับแกน X
            datasets: [{
              label: 'Employee count',
              data: $scope.growthData, // ข้อมูลสำหรับแกน Y
              backgroundColor: 'rgba(54, 162, 235, 0.6)', // สีของกราฟ
              borderColor: 'rgba(54, 162, 235, 1)', // สีของขอบกราฟ
              borderWidth: 1
            }]
          },
          options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            y: {
              beginAtZero: true // Makes sure the y-axis starts at zero
            }
          },
        }
        });
      };

      $scope.viewAllEmployees = function() {
      window.location.href = "/employees";
    };
    $scope.dashboard = function() {
      window.location.href = "/dashboard";
    };
    $scope.logout = function() {
      $http.delete('/logout', { 
        headers: { 
          'X-CSRF-Token': document.querySelector('meta[name="csrf-token"]').getAttribute('content') 
        } 
      }).then(function(response) {
        console.log('Logged out successfully', response);
        location.reload();  
      }).catch(function(error) {
        console.error('Error logging out:', error);
        window.location.href = '/sessions/new';
      });
    };
    });


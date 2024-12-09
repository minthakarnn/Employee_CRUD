angular.module('myApp', [])
  .config(['$httpProvider', function($httpProvider) {
    $httpProvider.defaults.headers.common['X-CSRF-Token'] =
      document.querySelector('meta[name="csrf-token"]').getAttribute('content');
  }])
  .controller('EmployeeController', function($scope, $http, $window) {
    const employeeDataElement = document.getElementById("employee-data");
    const url = employeeDataElement ? employeeDataElement.dataset.employeesUrl : '';
    
    $http.get(url).then(function(response) {
      $scope.employees = response.data;
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
      hobbies: []
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

    $scope.saveEmployee = function() {
      $http.post('/employees', $scope.employee)
        .then(function(response) {
          window.location.href = "/employees";
        })
        .catch(function(error) {
          console.error('Error saving employee:', error);
          $scope.errors = error.data.errors || ['An unexpected error occurred.'];
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
      var idx = $scope.employee.hobbies.indexOf(hobby);
      if (idx > -1) {
        $scope.employee.hobbies.splice(idx, 1);
      } else {
        $scope.employee.hobbies.push(hobby);
      }
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
  // app/javascript/controllers/dashboard_controller.js


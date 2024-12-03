angular.module('myApp', [])
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
angular.module('myApp', []).controller('EmployeeEditFormController', function($scope, $http) {
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
  });
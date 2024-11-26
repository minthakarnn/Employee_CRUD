  angular.module('myApp', []).controller('EmployeeFormController', function($scope, $http) {
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
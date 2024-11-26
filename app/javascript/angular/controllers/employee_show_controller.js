// angular.module('myApp', []).controller('EmployeeShowController', function($scope, $http) {
//     console.log("EmployeeShowController Loaded");
//     $scope.errors = [];
//     $scope.employee = {};

//     const employeeDataElement = document.getElementById("employee-data");
//     const url = employeeDataElement ? employeeDataElement.dataset.employeesUrl : '';

//     if (url) {
//       $http.get(url, { headers: { 'Accept': 'application/json' } })
//         .then(function(response) {
//           console.log("Employee data:", response.data);
//           $scope.employee = response.data;
//           if (typeof $scope.employee.hobbies === 'string') {
//             $scope.employee.hobbies = JSON.parse($scope.employee.hobbies);
//           }
//         })
//         .catch(function(error) {
//           $scope.errors.push("Error fetching employee data.");
//           console.error("Error fetching employee data:", error);
//         });
//     } else {
//       $scope.errors.push("Employee ID not provided.");
//     }

//     $scope.editEmployee = function(id) {
//       window.location.href = `/employees/${id}/edit`;
//     };

//     $scope.deleteEmployee = function(id) {
//       if (confirm("Are you sure you want to delete this employee?")) {
//         $http.delete(`/employees/${id}`, {
//           headers: {
//             'Content-Type': 'application/json',
//             'X-CSRF-Token': document.querySelector('meta[name="csrf-token"]').getAttribute('content')
//           }
//         }).then(function(response) {
//           alert("Employee deleted successfully.");
//           $scope.viewAllEmployees();
//         }).catch(function(error) {
//           window.location.href = '/employees/';
//           return
//         });
//       }
//     };

//     $scope.viewAllEmployees = function() {
//       window.location.href = "/employees";
//     };
//   })
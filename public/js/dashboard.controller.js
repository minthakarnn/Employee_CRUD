// app/javascript/dashboard_controller.js
angular.module('dashboardApp', [])
  .controller('DashboardController', function($scope, $http) {
    // ดึงข้อมูลจาก API ที่เราสร้างไว้ใน Rails
    $http.get('/api/dashboard')
      .then(function(response) {
        $scope.totalEmployees = response.data.total_employees;
        $scope.newEmployees = response.data.new_employees;
        $scope.employeeGrowth = response.data.employee_growth;

        // เรียกใช้ฟังก์ชั่นในการแสดงกราฟ
        $scope.createChart();
      });

    // ฟังก์ชั่นในการสร้างกราฟ
    $scope.createChart = function() {
      const ctx = document.getElementById('myChart').getContext('2d');
      const employeeGrowthData = $scope.employeeGrowth;
      const months = Object.keys(employeeGrowthData);
      const growthData = Object.values(employeeGrowthData);

      new Chart(ctx, {
        type: 'bar',
        data: {
          labels: months,
          datasets: [{
            label: 'Employee Growth',
            data: growthData,
            backgroundColor: 'rgba(54, 162, 235, 0.6)',
            borderColor: 'rgba(54, 162, 235, 1)',
            borderWidth: 1
          }]
        },
        options: {
          scales: {
            y: {
              beginAtZero: true
            }
          }
        });
      };
    };
  });
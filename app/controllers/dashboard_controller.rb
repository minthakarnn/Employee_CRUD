class DashboardController < ApplicationController
  def index
    @total_employees = Employee.count
    @new_employees = Employee.where(created_at: Time.current.beginning_of_month..Time.current.end_of_month).count
    @employee_growth = Employee.group_by_month(:created_at, format: "%B %Y").count
  end
end
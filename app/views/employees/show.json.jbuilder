json.id @employee.id
json.employee_name @employee.employee_name
json.hobbies @employee.hobbies.split(", ") if @employee.hobbies.present?
json.created_at @employee.created_at
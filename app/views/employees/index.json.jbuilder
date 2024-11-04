json.array! @employees do |employee|
  json.id employee.id
  json.employee_name employee.employee_name
  json.hobbies employee.hobbies.present? ? employee.hobbies.split(", ") : [] # แปลงเป็น Array
  json.created_at employee.created_at
end
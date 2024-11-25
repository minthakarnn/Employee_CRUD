class Employee < ApplicationRecord
  before_create :check_existing_employee

  def check_existing_employee
    if Employee.exists?(employee_name: self.employee_name)
      errors.add(:employee_name, 'already exists')
      throw(:abort)
    end
  end
  private

  def remove_duplicate_hobbies
    # ตรวจสอบว่า hobbies เป็น array หรือไม่ ถ้าไม่ให้แยกค่า
    if hobbies.is_a?(Array)
      self.hobbies = hobbies.uniq
    else
      self.hobbies = hobbies.split(',').map(&:strip).uniq.join(',')
    end
  end
end
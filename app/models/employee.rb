class Employee < ApplicationRecord
  before_create :check_existing_employee
  before_save :sanitize_hobbies

  enum career: { Tech: "Tech", Influencer: "Influencer", Vtuber: "Vtuber" }

  private

  # ตรวจสอบชื่อซ้ำ
  def check_existing_employee
    if Employee.exists?(employee_name: self.employee_name)
      errors.add(:employee_name, 'already exists')
      throw(:abort)
    end
  end

  # จัดการ hobbies ให้สะอาด
  def sanitize_hobbies
    if hobbies.is_a?(String)
      begin
        # กรณี hobbies เป็น JSON String
        self.hobbies = JSON.parse(hobbies)
      rescue JSON::ParserError
        # กรณีเป็น String ธรรมดา แยกด้วย ','
        self.hobbies = hobbies.split(',').map(&:strip)
      end
    end

    # ลบค่าซ้ำและจัดเรียง
    self.hobbies = hobbies.map(&:strip).uniq.sort_by(&:downcase) if hobbies.is_a?(Array)
  end
end
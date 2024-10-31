class UserSession < ApplicationRecord
  belongs_to :user
  # คุณสามารถเพิ่ม validations หรือ methods อื่น ๆ ที่จำเป็น
end
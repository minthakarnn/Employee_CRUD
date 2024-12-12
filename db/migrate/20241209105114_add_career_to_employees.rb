class AddCareerToEmployees < ActiveRecord::Migration[7.2]
  def change
    add_column :employees, :career, :string
  end
end

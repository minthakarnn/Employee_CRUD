class EmployeesController < ApplicationController
  before_action :require_login, :set_current_user_session, :set_employee_params, only: %i[show edit update destroy]
  
  def index
    @employees = Employee.all
  end

  def new
    @employee = Employee.new
  end

  def create
    session_params = params.permit(:email, :password)
    @user = User.find_by(email: session_params[:email])
    if @user && @user.authenticate(session_params[:password])
      session[:user_id] = @user.id
      redirect_to employees_path # เปลี่ยนเส้นทางไปที่หน้า employee#index
    else
      flash[:notice] = "Login is invalid!"
      redirect_to new_session_path
    end
  end

  def show; end

  def edit; end

  def update
    if @employee.update(employee_params)
      flash[:errors] = 'Employee Updated Successfully'
      redirect_to employee_path(@employee)
    else
      flash[:errors] = @employee.errors.full_messages
      redirect_to edit_employee_path
    end
  end

  def destroy
    if @employee.delete
      flash[:errors] = 'Employee Deleted Successfully'
      redirect_to employees_path
    else
      flash[:errors] = @employee.errors.full_messages
      redirect_to employee_path(@employee)
    end
  end

  private
  def require_login
    unless session[:user_id] # ตรวจสอบว่ามี user ใน session หรือไม่
      flash[:alert] = "Please log in to access this page"
      redirect_to new_session_path # หากไม่มี session ให้ redirect ไปหน้า login
    end
  end

  def set_employee_params
    @employee = Employee.find(params[:id])
  end

  def employee_params
    params.require(:employee).permit(:employee_name, :gender, { hobbies: [] })
  end

  # กำหนดค่า session ของผู้ใช้ที่เข้าสู่ระบบ
  def set_current_user_session
    @current_user_session = current_user_session
  end
end
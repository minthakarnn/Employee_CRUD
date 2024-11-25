class EmployeesController < ApplicationController
  before_action :require_login
  before_action :set_current_user_session
  before_action :set_employee, only: %i[show edit update destroy]


  def index
    @employees = Employee.all
    respond_to do |format|
      format.html
      format.json
    end
  end

  def new
    @employee = Employee.new
  end

  def create
  @employee = Employee.new(employee_params)
  if @employee.save
    render json: @employee, status: :created
  else
    render json: { errors: @employee.errors.full_messages }, status: :unprocessable_entity
  end
end

  def show
    respond_to do |format|
      format.html
      format.json { render json: @employee }
    end
  end

  def edit; end

  def update
  if @employee.update(employee_params)
    respond_to do |format|
      format.html { redirect_to employee_path(@employee), notice: 'Employee updated successfully.' } # ชี้ไปยัง URL ที่ถูกต้อง
      format.json { render json: @employee, status: :ok } # ตอบกลับ JSON ในรูปแบบที่ AngularJS รอรับ
    end
  else
    respond_to do |format|
      format.html { render :edit }
      format.json { render json: @employee.errors, status: :unprocessable_entity }
    end
  end
end

def destroy
  @employee = Employee.find(params[:id])
  @employee.destroy
  respond_to do |format|
    format.html { redirect_to employees_path, notice: "Employee was successfully deleted." }
    format.json { head :no_content }
  end
end
  private

  def require_login
    unless session[:user_id]
      flash[:alert] = 'Please log in to access this page.'
      redirect_to new_session_path
    end
  end

def set_employee
  @employee = Employee.find(params[:id]) unless params[:id] == 'new'
end

  def employee_params
    hobbies = params[:employee][:hobbies]
    params[:employee][:hobbies] = JSON.parse(hobbies) rescue [] if hobbies.is_a?(String)
    params.require(:employee).permit(:employee_name, :gender, hobbies: [])
  end

  def set_current_user_session
    @current_user_session = current_user_session
  end
end
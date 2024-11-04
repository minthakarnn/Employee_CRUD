class EmployeesController < ApplicationController
  before_action :require_login, :set_current_user_session, :set_employee_params, only: %i[show edit update destroy]

  def index
    @employees = Employee.all
    respond_to do |format|
      format.html # index.html.erb
      format.json { render json: @employees.as_json(include: []) } # ส่งข้อมูล JSON
    end
  end

  def new
    @employee = Employee.new
  end

  def create
    @employee = Employee.new(employee_params)
    if @employee.save
      redirect_to employees_path
    else
      flash[:errors] = @employee.errors.full_messages
      render :new
    end
  end

  def show; end

  def edit; end

  def update
    if @employee.update(employee_params)
      redirect_to employee_path(@employee)
    else
      flash[:errors] = @employee.errors.full_messages
      render :edit
    end
  end

  def destroy
    @employee.destroy
    redirect_to employees_path
  end

  private

  def require_login
    unless session[:user_id]
      flash[:alert] = "Please log in to access this page"
      redirect_to new_session_path
    end
  end

  def set_employee_params
    @employee = Employee.find(params[:id])
  end

  def employee_params
    params.require(:employee).permit(:employee_name, :hobbies)
  end

  def set_current_user_session
    @current_user_session = current_user_session
  end
end
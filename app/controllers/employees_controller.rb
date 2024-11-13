class EmployeesController < ApplicationController
  before_action :require_login, :set_current_user_session, :set_employee_params, only: %i[show edit update destroy]

  def index
    @employees = Employee.all

    respond_to do |format|
      format.html # index.html.erb
      format.json # index.json.jbuilder
    end
  end

  def new
    @employee = Employee.new
  end

  def create
    @employee = Employee.new(employee_params)
    if @employee.save
      respond_to do |format|
        format.html { redirect_to @employee }
        format.json { render :show, status: :created } # ใช้ show.json.jbuilder
      end
    else
      respond_to do |format|
        format.html { render :new }
        format.json { render json: @employee.errors, status: :unprocessable_entity }
      end
    end
  end

  def show
    @employee = Employee.find(params[:id])
    respond_to do |format|
      format.html # show.html.erb
      format.json # จะทำให้ Rails เรียก show.json.jbuilder
    end
  end

  def edit; end

def update
  @employee = Employee.find(params[:id])
  if @employee.update(employee_params)
    respond_to do |format|
      format.html { redirect_to @employee, notice: 'Employee was successfully updated.' }
      format.json { render :show, status: :ok } # ใช้ show.json.jbuilder
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
    if @employee.destroy
      head :no_content
    else
      render json: { error: 'Failed to delete employee' }, status: :unprocessable_entity
    end
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
    params.require(:employee).permit(:employee_name, :gender, hobbies: [])
  end

  def set_current_user_session
    @current_user_session = current_user_session
  end
end
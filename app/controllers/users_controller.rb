class UsersController < ApplicationController
	skip_before_action :require_login, only: [:new, :create]
  def show
	  @user = User.find(params[:id]) # ตรวจสอบให้แน่ใจว่ามีการส่ง params[:id] ที่ถูกต้อง
	end

  def index
  end

  def new
    @user = User.new
  end

  def create
    @user = User.new(user_params)
    if @user.save
      session[:user_id] = @user.id
      redirect_to employees_path, notice: "Welcome to the Employee Management System!"
    else
      render :new
    end
  end

  private

  def user_params
    params.require(:user).permit(:username, :password, :password_confirmation)
  end
end
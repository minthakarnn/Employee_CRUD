class SessionsController < ApplicationController
  skip_before_action :require_login, only: [:create, :new]

  def show
    @user_session = UserSession.find_by(id: params[:id])
    if @user_session.nil?
      flash[:alert] = "Session not found."
      redirect_to new_session_path # หรือหน้าอื่นที่เหมาะสม
    end
  end

  def new
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

  def destroy
    session[:user_id] = nil
    flash[:notice] = "You have been signed out!"
    redirect_to new_session_path # กำหนดให้ไปหน้า login
  end
end
class ApplicationController < ActionController::Base
  before_action :require_login
  helper_method :current_user, :current_user_session

  def require_login
    # ถ้าไม่ได้ล็อกอิน และกำลังเข้าถึงหน้าอื่นที่ไม่ใช่หน้า index ของ employees
    if !session[:user_id] && controller_name != 'employees' && action_name != 'index'
      redirect_to new_session_path
    end
  end

  def current_user
    @current_user ||= User.find_by(id: session[:user_id]) if session[:user_id]
  end

  def current_user_session
    @current_user_session ||= UserSession.find_by(user_id: session[:user_id]) if session[:user_id]
  end
end
# app/controllers/application_controller.rb
class ApplicationController < ActionController::Base
  before_action :require_login
  helper_method :current_user, :current_user_session

  def require_login
    redirect_to new_session_path unless session.include?(:user_id)
  end

  def current_user
    @current_user ||= User.find_by(id: session[:user_id]) if session[:user_id]
  end

  def current_user_session
    @current_user_session ||= UserSession.find_by(user_id: session[:user_id]) if session[:user_id]
  end
end
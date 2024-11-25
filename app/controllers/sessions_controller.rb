class SessionsController < ApplicationController
  skip_before_action :require_login, only: [:create, :new]

  def show
    # This action might be unnecessary in typical login/logout scenarios.
    @user_session = UserSession.find_by(id: params[:id])
    if @user_session.nil?
      flash[:alert] = "Session not found."
      redirect_to new_session_path
    end
  end

  def new
    # Display login form
  end

  def create
    session_params = params.permit(:email, :password)
    @user = User.find_by(email: session_params[:email])
    if @user && @user.authenticate(session_params[:password])
      session[:user_id] = @user.id
      redirect_to employees_path # Redirect to employee index after successful login
    else
      flash[:notice] = "Login is invalid!" # Inform the user about the failure
      render :new
    end
  end

  def destroy
    reset_session # Clear session data
    redirect_to root_path, notice: 'Logged out successfully.' # Redirect to login page after logout
  end
end
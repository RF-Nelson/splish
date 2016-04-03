class ApplicationController < ActionController::Base
  protect_from_forgery with: :exception

  helper_method :current_user, :signed_in?

  def current_user
    current_user ||= Guest.find_by_session_token(session[:session_token])
  end

  def sign_in(user)
    session[:session_token] = user.reset_session_token!
  end

  def sign_out(user)
    session[:session_token] = nil
    user.reset_session_token!
  end

  def signed_in?
    !!current_user
  end

  def ensure_signed_in
    redirect_to new_session_url unless signed_in?
  end
end

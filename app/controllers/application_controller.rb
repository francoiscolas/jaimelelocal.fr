class ApplicationController < ActionController::Base

  before_action :redirect_to_landing

  protect_from_forgery with: :exception

  protected

  def redirect_to_landing
    redirect_to landing_path unless session[:skip_landing] == true
  end

end

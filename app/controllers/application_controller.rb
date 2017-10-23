class ApplicationController < ActionController::Base

  before_action :redirect_to_landing

  protect_from_forgery with: :exception

  protected

  def after_sign_in_path_for(resource)
    if session.delete :wants_to_create_farm
      new_user_farm_path
    else
      super
    end
  end

  def redirect_to_landing
    redirect_to landing_path unless session[:skip_landing] == true
  end

end

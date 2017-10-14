class ApplicationController < ActionController::Base

  protect_from_forgery with: :exception

  protected

  def after_sign_in_path_for(resource)
    if session.delete :wants_to_create_farm
      new_user_farm_path
    else
      super
    end
  end

end

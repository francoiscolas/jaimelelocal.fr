class Account::RegistrationsController < Devise::RegistrationsController

  before_action :authenticate_scope!, only: [:edit, :update, :destroy]
  before_action :configure_permitted_parameters

  protected

    def update_resource(resource, params)
      if params.has_key?(:password)
        resource.update_with_password(params)
      else
        resource.update_without_password(params)
      end
    end

    def after_update_path_for(resource)
      request.path
    end

    def configure_permitted_parameters
      devise_parameter_sanitizer.permit(:sign_up, keys: [
        :name
      ])
      devise_parameter_sanitizer.permit(:account_update, keys: [
        :name,
        :show_email,
        :url,
        :bio
      ])
    end

end

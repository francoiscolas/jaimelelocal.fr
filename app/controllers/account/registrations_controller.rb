class Account::RegistrationsController < Devise::RegistrationsController

  before_action :authenticate_scope!, only: [:edit, :update, :destroy, :profile]
  before_action :configure_create_params, only: [:create]
  before_action :configure_update_params, only: [:update]

  # GET /account/profile (edit_user_profile_path)
  def profile
    render :profile
  end

  def update
    super do
      render :profile if !resource.errors.blank?
      break
    end
  end

  protected

    def update_resource(resource, params)
      updated  = false

      if params.has_key?(:password)
        updated = resource.update_with_password(params)
      else
        updated = resource.update_without_password(params)
      end
      return updated
    end

    def configure_create_params
      devise_parameter_sanitizer.permit(:sign_up, keys: [
        :name
      ])
    end

    def configure_update_params
      devise_parameter_sanitizer.permit(:account_update, keys: [
        :name,
        :show_email,
        :url,
        :bio
      ])
    end

end

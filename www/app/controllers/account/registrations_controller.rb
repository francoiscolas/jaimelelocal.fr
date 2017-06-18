class Account::RegistrationsController < Devise::RegistrationsController

  before_action :authenticate_scope!, only: [:edit, :update, :destroy, :profile]
  before_action :configure_account_update_params, only: [:update]

  # GET /account (user_root_path)
  def show
    render :show
  end

  # GET /account/profile (edit_user_profile_path)
  def profile
    render :profile
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

    def configure_account_update_params
      devise_parameter_sanitizer.permit(:account_update, keys: [
        :name,
        :show_email,
        :url,
        :bio
      ])
    end

end

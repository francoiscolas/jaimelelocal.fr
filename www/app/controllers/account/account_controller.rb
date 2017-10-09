class Account::AccountController < ApplicationController

  before_action :authenticate_user!

  protected

    def require_farm!
      if !current_user.farm
        redirect_to new_user_farm_path
      end
    end

end

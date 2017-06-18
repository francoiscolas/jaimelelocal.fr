class Account::PlacesController < Account::AccountController

  before_filter :require_farm!

  # GET /account/farm/places/new (new_user_farm_place_path)
  def new
    @place = current_user.farm.places.build
    render :new
  end

end

class Account::PlacesController < Account::AccountController

  before_filter :require_farm!

  # GET /account/farm/places/new (new_user_farm_place_path)
  def new
    @place = current_user.farm.places.build
  end

  # POST /account/farm/places (user_farm_places)
  def create
    @place = current_user.farm.places.build(place_params)

    if @place.save
      redirect_to user_farm_path
    else
      render :new
    end
  end

  # GET /account/farm/places/:id/edit (edit_user_farm_place)
  def edit
    @place = current_user.farm.places.find(params[:id])
  end

  # PUT /account/farm/places/:id (user_farm_place)
  def update
    @place = current_user.farm.places.find(params[:id])

    if @place.update_attributes(place_params)
      redirect_to user_farm_path
    else
      render :edit
    end
  end

  # POST /account/farm/places/destroy (destroy_user_farm_places)
  def destroy
    Place.destroy_all(:farm_id => current_user.farm.id, :id => params[:ids])
    redirect_to user_farm_path
  end

  private

  def place_params
    params.require(:place).permit!
  end

end

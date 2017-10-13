class RootController < ApplicationController

  def home
    params.permit! # FIXME need to enhance this

    @query = params[:q]

    if params.key? :l
      @location = Geocoder.search(params[:l]).first
    else
      if session[:user_location]
        @location_name = session[:user_location]['name']
        @location_coordinates = session[:user_location]['coordinates']
      else
        @location = request.location
        @location = Geocoder.search('78.221.215.68').first
        if location_is_valid? @location
          session[:user_location] = {
            'name' => @location.city,
            'coordinates' => @location.coordinates
          }
        end
      end
    end
    if location_is_valid? @location
      @location_name = @location.city
      @location_coordinates = @location.coordinates
    end

    @distance = params[:d].to_i
    @distance = 20 if @distance == 0

    if @location_coordinates
      ids = Place.near(@location_coordinates, @distance).order('distance').select('id').map(&:farm_id)
      @farms = Farm.where(:id => ids)
    else
      @farms = Farm.order(:updated_at)
    end
    @farms = @farms.distinct.joins(:products => :product_name)
      .where("product_names.name LIKE ?", "%#{@query}%") if @query
    @farms = @farms.page(params[:p]).per_page(10)
  end

  # GET autocomplete_products
  def autocomplete_products
    render :json => ProductName
        .where("LOWER(name) LIKE LOWER(?)", "%#{params[:term]}%")
        .limit(10)
        .pluck(:name)
  end

  # GET farm_path
  def farm
    @farm = Farm.find_by_url(params[:url]) or
      raise ActionController::RoutingError, 'Not Found'
  end

  private

  def location_is_valid? location
    logger.debug location
    location && location.coordinates != [0.0, 0.0]
  end

end

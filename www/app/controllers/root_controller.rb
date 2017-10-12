class RootController < ApplicationController

  def index
    params.permit! # FIXME need to enhance this

    @query    = params[:q]

    @location = params[:l].present? ? Geocoder.search(params[:l]).first : request.location
    @location = nil if @location && (@location.latitude == 0.0 || @location.longitude == 0.0)

    @distance = params[:d].to_i
    @distance = 20 if @distance == 0

    if @location
      ids = Place.near(@location.coordinates, @distance).order('distance').select('id').map(&:farm_id)
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

end

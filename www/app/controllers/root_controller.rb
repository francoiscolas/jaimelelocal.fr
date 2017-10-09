class RootController < ApplicationController

  def index
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
    @farm = Farm.find_by_url(params[:farmurl]) or
      raise ActionController::RoutingError, 'Not Found'
  end

end

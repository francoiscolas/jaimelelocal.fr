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

end

class RootController < ApplicationController

  skip_before_action :redirect_to_landing, only: [:landing, :skip_landing]
  skip_before_action :verify_authenticity_token, only: :sendmail

  def landing
    render layout: false
  end

  def skip_landing
    session[:skip_landing] = true
    redirect_to root_path
  end

  def home
    params.permit! # FIXME need to enhance this

    @query = params[:q]

    if params.key? :l
      @location = Geocoder.search(params[:l]).first
    elsif false
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

    #if @location_coordinates
    #  ids = Place.near(@location_coordinates, @distance).order('distance').select('id').map(&:farm_id)
    #  @farms = Farm.where(:id => ids)
    #else
      @farms = Farm.order(:updated_at)
    #end
    @farms = @farms.page(params[:p]).per_page(10)
  end

  # GET farm_path
  def farm
    @farm = Farm.find_by_url(params[:farm_url]) or
      raise ActionController::RoutingError, 'Not Found'
    @is_owner = false
  end

  def subscribe
    @farm = Farm.find_by_url(params[:farm_url]) or
      raise ActionController::RoutingError, 'Not Found'
    if user_signed_in?
      @farm.subscribtions.create(user_id: current_user.id)
      @farm.subscribtions.where(email: current_user.email).destroy_all
      redirect_to farm_path(@farm)
    else
      store_location_for(:user, farm_path(@farm))
      redirect_to new_user_session_path
    end
  end

  def unsubscribe
    @farm = Farm.find_by_url(params[:farm_url]) or
      raise ActionController::RoutingError, 'Not Found'
    if user_signed_in?
      @farm.subscribtions.where(user_id: current_user.id).destroy_all
      redirect_to farm_path(@farm)
    else
      store_location_for(:user, farm_path(@farm))
      redirect_to new_user_session_path
    end
  end

  def sendmail
    @farm = Farm.find_by_url(params[:farm_url]) or
      raise ActionController::RoutingError, 'Not Found'

    subject = params[:contact][:subject]
    subject.prepend("/ ") if !subject.blank?

    ApplicationMailer.mailto(
      to: @farm.email,
      from: "#{params[:contact][:name]} <#{params[:contact][:email]}>",
      subject: "Jaimelelocal.fr / Contact #{subject}",
      body: params[:contact][:msg]
    ).deliver
    ApplicationMailer.mailto(
      to: params[:contact][:email],
      from: "#{params[:contact][:name]} <#{params[:contact][:email]}>",
      subject: "Jaimelelocal.fr / Contact #{subject}",
      body: params[:contact][:msg]
    ).deliver

    redirect_to farm_path(@farm), notice: t('.sent')
  end

  private

  def location_is_valid? location
    location && location.coordinates != [0.0, 0.0]
  end

end

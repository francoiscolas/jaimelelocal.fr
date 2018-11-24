class RootController < ApplicationController

  skip_before_action :verify_authenticity_token, only: :sendmail

  def home
    params.permit! # FIXME need to enhance this

    @query   = params[:q]
    @autoLoc = false

    if params.key? :l
      @location = Geocoder.search(params[:l]).first
    else
      if session[:user_location]
        @autoLoc = true
        @locName = session[:user_location]['name']
        @locCoor = session[:user_location]['coordinates']
      else
        if Rails.env.development?
          @location = Geocoder.search('78.221.215.68').first
        else
          @location = request.location
        end

        if location_is_valid? @location
          @autoLoc = true
          session[:user_location] = {
            'name' => @location.city,
            'coordinates' => @location.coordinates
          }
        end
      end
    end
    if location_is_valid? @location
      @locName = @location.city
      @locCoor = @location.coordinates
    end

    @distance = params[:d].to_i
    @distance = 20 if @distance == 0

    if @locCoor
      @farms = Farm.near(@locCoor, @distance)
      if @autoLoc and @farms.count(:all) == 0
        @locName = nil
        @locCoor = nil
        @farms = Farm
      end
    else
      @farms = Farm
    end
    @farms = @farms.left_outer_joins(:categories)
      .where('LOWER(farm_categories.name) LIKE LOWER(?)
              OR LOWER(shortdesc) LIKE LOWER(?)
              OR LOWER(page_content) LIKE LOWER(?)',
              "%#{@query}%", "%#{@query}%", "%#{@query}%")
  end

  # GET autocomplete_q
  def autocomplete_q
    render :json => FarmCategory.where("LOWER(name) LIKE LOWER(?)", "%#{params[:term]}%").limit(10).pluck(:name)
  end

  def i_am_farmer
    store_location_for(:user, new_user_farm_path)
  end

  def farmers
    params[:q] ||= 'a'
    @q = params[:q][0].downcase
    @farms = Farm.where("LOWER(name) LIKE ?", "#{@q}%")
  end

  def contact_post
    subject = params[:contact][:subject]
    subject = "Pas de sujet" if subject.blank?

    ApplicationMailer.mailto(
      to: [ApplicationMailer.default[:from], params[:contact][:email]],
      from: "#{params[:contact][:name]} <#{params[:contact][:email]}>",
      subject: "Jaimelelocal.fr / Contact / #{subject}",
      body: params[:contact][:msg]
    ).deliver_later
    flash[:notice] = "Merci pour votre message, une copie vous a été envoyé."
    render :contact
  end

  # GET farm_path
  def farm
    @farm = Farm.find_by_url(params[:farm_url]) or
      raise ActionController::RoutingError, 'Not Found'
    @is_owner = false
    @subscribtion = @farm.subscribtions.new
  end

  def subscribe
    @farm = Farm.find_by_url(params[:farm_url]) or
      raise ActionController::RoutingError, 'Not Found'

    s = @farm.subscribtions.create(email: params[:subscribtion][:email])
    SubscriberMailer.with(subscribtion: s)
      .confirm_subscribtion_email.deliver_later
    redirect_to farm_path(@farm)

#    if user_signed_in?
#      @farm.subscribtions.create(user_id: current_user.id)
#      @farm.subscribtions.where(email: current_user.email).destroy_all
#      redirect_to farm_path(@farm)
#    else
#      store_location_for(:user, farm_path(@farm))
#      redirect_to new_user_session_path
#    end
  end

  def unsubscribe
    @farm = Farm.find_by_url(params[:farm_url]) or
      raise ActionController::RoutingError, 'Not Found'

    Subscribtion.where(
      farm_id: @farm.id,
      token: params[:token]
    ).delete_all

#    if user_signed_in?
#      @farm.subscribtions.where(user_id: current_user.id).destroy_all
#      redirect_to farm_path(@farm)
#    else
#      store_location_for(:user, farm_path(@farm))
#      redirect_to new_user_session_path
#    end
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
    location and location.coordinates != [0.0, 0.0]
  end

end

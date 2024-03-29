class Account::FarmsController < Account::AccountController

  prepend_before_action :wants_to_create_farm, only: :new

  before_action :require_farm!, except: [:new, :create]
  before_action :require_no_farm!, only: [:new, :create]

  # GET /account/farm/new (new_user_farm_path)
  def new
    @farm = current_user.build_farm
    @farm.email = current_user.email
    render :new
  end

  # POST /account/farm (user_farm_path)
  def create
    @farm = current_user.create_farm(farm_params)

    if @farm.save
      flash[:notice] = t('.created')
      redirect_to user_farm_path
    else
      render :new
    end
  end

  # GET /account/farm (user_farm_path)
  def show
    @farm = current_user.farm
    @is_owner = true
    render :'root/farm'
  end

  # POST /account/farm (user_farm_path)
  def update_page
    @farm = current_user.farm

    if params[:farm].blank? || params[:farm][:page_header].present?
      @farm.page_header = (params[:farm]) ? params[:farm][:page_header] : nil
      if @farm.save
        flash[:notice] = t('.updated')
      else
        flash[:alert] = @farm.errors[:page_header][0]
      end
    else
      if @farm.update(farm_params)
        flash[:notice] = t('.updated')
      end
    end
    redirect_to user_farm_path
  end

  # GET /account/farm/edit (edit_user_farm_path)
  def edit
    @farm = current_user.farm
    render :edit
  end

  # PATCH /account/farm/edit (edit_user_farm_path)
  def update
    @farm = current_user.farm

    logger.debug farm_params
    if @farm.update(farm_params)
      flash[:notice] = t('.updated')
    end
    render :edit
  end

  # DELETE /account/farm (user_farm_path)
  def destroy
    @farm = current_user.farm

    if @farm.destroy
      redirect_to user_path
    end
  end

  private

    def wants_to_create_farm
      store_location_for(:user, new_user_farm_path)
    end

    def require_no_farm!
      if current_user.farm
        redirect_to user_farm_path
      end
    end

    def farm_params
      params.require(:farm)
        .permit!.reverse_merge(category_ids: [])
    end

end

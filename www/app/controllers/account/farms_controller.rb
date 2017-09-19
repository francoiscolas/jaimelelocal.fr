class Account::FarmsController < Account::AccountController

  before_filter :require_farm!, except: [:new, :create]
  before_filter :require_no_farm!, only: [:new, :create]

  # GET /account/farm/new (new_user_farm_path)
  def new
    @farm = current_user.build_farm
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
    render :show
  end

  # GET /account/farm/edit (edit_user_farm_path)
  def edit
    @farm = current_user.farm
    render :edit
  end

  # PUT /account/farm (user_farm_path)
  def update
    @farm = current_user.farm

    if @farm.update(farm_params)
      flash[:notice] = t('.updated')
    end
    render :edit
  end

  # DELETE /account/farm (user_farm_path)
  def destroy
    @farm = current_user.farm

    if @farm.destroy
      redirect_to user_root_path
    end
  end

  private

    def require_no_farm!
      if current_user.farm
        redirect_to user_farm_path
      end
    end

    def farm_params
      params.require(:farm).permit!
    end

end
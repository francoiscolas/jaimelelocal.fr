class Account::ProductsController < Account::AccountController

  before_action :require_farm!

  # GET new_user_farm_product
  def new
    @product = current_user.farm.products.build
  end

  # POST user_farm_products
  def create
    @product = current_user.farm.products.build(product_params)

    if @product.save
      redirect_to user_farm_path
    else
      render :new
    end
  end

  # GET edit_user_farm_product
  def edit
    @product = current_user.farm.products.find(params[:id])
  end

  # PUT user_farm_product
  def update
    @product = current_user.farm.products.find(params[:id])

#    params[:product][:properties] ||= []

    if @product.update_attributes(product_params)
      redirect_to user_farm_path
    else
      render 'edit'
    end 
  end

  # POST destroy_user_farm_products
  def destroy
    Product.destroy_all(:farm_id => current_user.farm.id, :id => params[:ids])
    redirect_to user_farm_path
  end

  private

  def product_params
    params.require(:product).permit!
  end

end


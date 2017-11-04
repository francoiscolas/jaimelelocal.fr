class AddDescriptionToFarms < ActiveRecord::Migration[5.0]
  def change
    add_column :farms, :description, :string
  end
end

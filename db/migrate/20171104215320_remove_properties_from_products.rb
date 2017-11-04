class RemovePropertiesFromProducts < ActiveRecord::Migration[5.0]
  def change
    remove_column :products, :properties
    add_column    :products, :available, :boolean, default: true
  end
end

class CreateFarmCategories < ActiveRecord::Migration[5.2]
  def change
    create_table :farm_categories do |t|
      t.string :name
      t.index  :name, unique: true
    end
  end
end

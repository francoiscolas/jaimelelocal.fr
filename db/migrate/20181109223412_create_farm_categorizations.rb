class CreateFarmCategorizations < ActiveRecord::Migration[5.2]
  def change
    create_join_table :farms, :farm_categories, table_name: :farm_categorizations do |t|
      t.index [:farm_id, :farm_category_id]
      t.index [:farm_category_id, :farm_id]
    end
  end
end

class CreateFarmCategorizations < ActiveRecord::Migration[5.2]
  def change
    create_table :farm_categorizations do |t|
      t.belongs_to :farm, index: true
      t.belongs_to :farm_category, index: true
    end
  end
end

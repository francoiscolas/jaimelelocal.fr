class CreateProducts < ActiveRecord::Migration[5.0]
  def change
    create_table :products do |t|
      t.belongs_to :farm
      t.belongs_to :product_name

      t.text    :description, :null => true
      t.decimal :price,       :null => false, :precision => 8, :scale => 2
      t.integer :price_unit,  :null => false
      t.integer :properties,  :null => false, :default => 0

      t.timestamps
    end
  end
end

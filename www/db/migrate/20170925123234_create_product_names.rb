class CreateProductNames < ActiveRecord::Migration[5.0]
  def change
    create_table :product_names do |t|
      t.string  :name,         :null => false
      t.boolean :was_reviewed, :null => false, :default => false

      t.timestamps
    end
    add_index :product_names, :name, :unique => true
  end
end

class CreatePlaces < ActiveRecord::Migration[5.0]
  def change
    create_table :places do |t|
      t.belongs_to :farm

      t.string  :name
      t.text    :description
      t.text    :address
      t.float   :lat
      t.float   :lng

      t.timestamps
    end
  end
end

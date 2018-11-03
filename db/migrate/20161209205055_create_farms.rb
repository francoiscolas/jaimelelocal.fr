class CreateFarms < ActiveRecord::Migration[5.0]
  def change
    create_table :farms do |t|
      t.belongs_to :user, index: true

      t.string      :name
      t.string      :url
      t.string      :website
      t.string      :phone
      t.text        :address
      t.float       :lat
      t.float       :lng
      t.attachment  :page_header
      t.json        :page_content

      t.timestamps
    end
    add_index :farms, :name, unique: true
    add_index :farms, :url, unique: true
  end
end

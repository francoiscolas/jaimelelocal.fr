class CreateFarms < ActiveRecord::Migration[5.0]
  def change
    create_table :farms do |t|
      t.belongs_to :user, index: true

      t.string      :name
      t.string      :url
      t.string      :shortdesc
      t.string      :email
      t.string      :phone
      t.string      :website
      t.text        :address
      t.float       :lat
      t.float       :lng
      t.attachment  :page_header
      t.json        :page_content

      t.timestamps
    end
    add_index :farms, :name, unique: true
    add_index :farms, :url, unique: true
    add_index :farms, :shortdesc
    add_index :farms, :page_content
  end
end

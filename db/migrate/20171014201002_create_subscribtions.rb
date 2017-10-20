class CreateSubscribtions < ActiveRecord::Migration[5.0]
  def change
    create_table :subscribtions do |t|
      t.belongs_to  :farm
      t.belongs_to  :user, null: true

      t.timestamp
    end
  end
end

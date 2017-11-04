class CreateSubscribtions < ActiveRecord::Migration[5.0]
  def change
    create_table :subscribtions do |t|
      t.belongs_to  :farm
      t.belongs_to  :user,  null: true # null if email
      t.string      :email, null: true # null if user
      t.timestamp
    end
  end
end

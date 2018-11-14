class CreateSubscribtions < ActiveRecord::Migration[5.0]
  def change
    create_table :subscribtions do |t|
      t.belongs_to  :farm
      t.belongs_to  :user,  null: true # null if email
      t.string      :email, null: true # null if user
      t.string      :token
      t.timestamp
    end
    add_index :subscribtions, [:farm_id, :user_id], unique: true
    add_index :subscribtions, :token, unique: true
  end
end

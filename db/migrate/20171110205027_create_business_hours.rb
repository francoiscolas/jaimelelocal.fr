class CreateBusinessHours < ActiveRecord::Migration[5.0]
  def change
    create_table :business_hours do |t|
      t.belongs_to  :farm, index: true
      t.integer     :day_of_week
      t.boolean     :activated
      t.time        :opens_at
      t.time        :closes_at
    end
  end
end

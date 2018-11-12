class FarmCategory < ApplicationRecord
  has_many :farm_categorizations, dependent: :destroy
  has_many :farms, through: :farm_categorizations
end

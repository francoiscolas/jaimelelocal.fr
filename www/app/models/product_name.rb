class ProductName < ApplicationRecord

  #
  # Associations
  has_many :products

  #
  # Validations
  validates :name, :presence => true, :length => {:maximum => 128}, :uniqueness => {:case_sensitive => false}

end

# encoding: UTF-8

class Product < ApplicationRecord

  UNITS = [
    ["le kilo",  1],
    ["le litre", 2],
    ["pièce",    3]
  ]

  #
  # Associations
  belongs_to :farm
  belongs_to :product_name

  #
  # Validations
  validates :product_name_id, presence: true
  validates :price,           presence: true, numericality: true
  validates :price_unit,      presence: true, inclusion: {in: 1..UNITS.length}

  #
  # Accessors

  def name
    return (product_name) ? product_name.name : nil 
  end 

  def name=(value)
    if value.nil?
      write_attribute(:product_name_id, nil)
    else
      value = value.strip.gsub(/ +/, ' ')

      product_name = ProductName.find_or_create_by(name: value)
      write_attribute(:product_name_id, product_name.id)
    end
  end

  def description=(value)
    super((value.is_a?(String)) ? value.strip : value)
  end

  #
  # Methods

  def price_with_unit
    return sprintf('%.2f', price).gsub('.', '€') + ' ' + UNITS[price_unit - 1][0]
  end

end

class Place < ApplicationRecord

  belongs_to :farm

  validates :name, :presence => true, :length => { :maximum => 64 }
  validates :address, :presence => true, :length => { :maximum => 128 }

  geocoded_by :address, :latitude => :lat, :longitude => :lng

  def description=(value)
    super((value.is_a?(String)) ? value.strip : value)
  end

  def address=(value)
    super((value.is_a?(String)) ? value.strip : value)
  end

end

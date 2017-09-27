class Farm < ApplicationRecord

  #
  # Associations

  belongs_to :user
  has_many :places, -> { order 'name' }, :dependent => :destroy
  has_many :products, -> { includes('product_name').order('product_names.name ASC') }, :dependent => :destroy

  #
  # Validations

  validates :name, presence: true, uniqueness: true, length: { minimum: 3 }
  validates :url, presence: true, uniqueness: true, length: { minimum: 3 }
  validates :address, presence: true
  validates :farmer, presence: true, length: { minimum: 7 }
  validates :phone, presence: true, format: { with: /\A([0-9]{2} ){4}[0-9]{2}\Z/ }

  #
  # Accessors

  def name=(value)
    super((value.is_a?(String)) ? value.strip : value)
  end

  def phone=(value)
    if value.is_a?(String)
      value = value.strip
      value = value.gsub(/^\+33/, '0') if value.start_with?('+33')
      value = value.delete('^0-9')
      value = value.gsub(/(.{2})(?=.)/, '\1 \2')
    end 
    super(value)
  end 

end

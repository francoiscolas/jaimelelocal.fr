class Farm < ApplicationRecord

  def to_param
    url
  end

  has_attached_file :banner,
    url:         '/system/:hash.:extension',
    hash_secret: 'menchtf4svrty2ue9zp5wjf456xbqoad5',
    default_url: 'default-farm-banner.jpg'

  #
  # Associations

  belongs_to :user
  has_many :places, -> { order 'name' }, :dependent => :destroy
  has_many :products, -> { includes('product_name').order('product_names.name ASC') }, :dependent => :destroy
  has_many :subscribtions, dependent: :destroy
  has_many :subscribers, through: :subscribtions, source: :user

  #
  # Validations

  validates :name, presence: true, uniqueness: true, length: { minimum: 3 }
  validates :url, presence: true, uniqueness: true, length: { minimum: 3 }
  validates :address, presence: true
  validates :farmer, presence: true, length: { minimum: 7 }
  validates :phone, presence: true, format: { with: /\A([0-9]{2} ){4}[0-9]{2}\Z/ }
  validates :banner, attachment_content_type: { content_type: /image/ }
  validates :banner, attachment_size: { in: 0..500.kilobytes }

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

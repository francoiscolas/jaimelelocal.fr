class Farm < ApplicationRecord

  DESCRIPTION_MAX_LENGTH = 100

  geocoded_by :address, :latitude => :lat, :longitude => :lng

  has_attached_file :page_header,
    url:         '/system/:hash.:extension',
    hash_secret: 'menchtf4svrty2ue9zp5wjf456xbqoad5',
    default_url: 'default-farm-banner.jpg'

  #
  # Associations

  belongs_to :user

  has_many :subscribtions, dependent: :destroy
  has_many :subscribers, through: :subscribtions, source: :user

  has_many :business_hours, dependent: :destroy
  accepts_nested_attributes_for :business_hours, allow_destroy: true

  #
  # Validations

  validates :name, presence: true, uniqueness: true, length: { minimum: 3 }
  validates :url, presence: true, uniqueness: true, length: { minimum: 3 }
  validates :address, presence: true
  validates :phone, presence: true, format: { with: /\A([0-9]{2} ){4}[0-9]{2}\Z/ }
  validates :page_header, attachment_content_type: { content_type: /image/ }
  validates :page_header, attachment_size: { in: 0..500.kilobytes }

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

  #
  # Methods

#  def ensure_business_hours
#    if business_hours.empty?
#      business_hours.build(day_of_week: 0)
#      (1..5).each do |i|
#        business_hours.build(day_of_week: i, activated: true, opens_at: '09:00', closes_at: '19:00')
#      end
#      business_hours.build(day_of_week: 6)
#    end
#    business_hours
#  end

  def to_param
    url
  end

end

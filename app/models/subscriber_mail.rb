class SubscriberMail
  extend ActiveModel::Naming
  include ActiveModel::Validations
  include ActiveModel::Conversion

  attr_accessor :subject, :body

  validates_presence_of :subject
  validates_presence_of :body

  def self.prepend_subject_with(farm)
    "#{farm.name} - "
  end

  def initialize(attributes = {})
    attributes.each do |name, value|
      send("#{name}=", value)
    end
  end

  def persisted?
    false
  end
end

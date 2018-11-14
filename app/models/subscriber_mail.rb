class SubscriberMail
  extend ActiveModel::Naming
  include ActiveModel::Validations
  include ActiveModel::Conversion

  attr_accessor :subject, :body

  validates_presence_of :subject
  validate :body_is_present?

  def initialize(attributes = {})
    attributes.each do |name, value|
      send("#{name}=", value)
    end
  end

  def persisted?
    false
  end

  protected

  def body_is_present?
    if body.blank? or body == '<p><br></p>'
      errors.add(:body, I18n.t('.activemodel.errors.models.subscriber_mail.attributes.body.blank'))
    end
  end
end

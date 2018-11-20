class User < ApplicationRecord
  #
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable and :omniauthable
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :trackable, :validatable

  after_create :send_welcome_email

  #
  # Associations
  has_one :farm, dependent: :destroy
  has_many :subscribtions, dependent: :destroy

  #
  # Validations
  validates :name, presence: true

  def subscribed_to?(farm)
    subscribtions.where(farm_id: farm.id).exists?
  end

  protected

  def send_welcome_email
    UserMailer.with(user: self).welcome_email.deliver_later
  end
end

class User < ApplicationRecord
  #
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable and :omniauthable
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :trackable, :validatable

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
end

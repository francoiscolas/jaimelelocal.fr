class Subscribtion < ApplicationRecord

  belongs_to :farm
  belongs_to :user

  def get_email
    return (user) ? user.email : email
  end

end

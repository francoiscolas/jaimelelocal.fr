class Subscribtion < ApplicationRecord

  belongs_to :farm
  belongs_to :user

  validate do |s|
    if s.email
      if Subscribtion.where(email: s.email).exists? or
          Subscribtion.joins(:user).where('users.email': s.email).exists?
        s.errors[:email] << "Email already registered."
      end
    else
      if Subscribtion.where(user_id: s.user_id, farm_id: s.farm_id).exists?
        s.errors[:email] << "User already registered."
      end
    end
  end

  def get_email
    return (user) ? user.email : email
  end

end

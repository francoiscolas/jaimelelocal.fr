class BusinessHour < ApplicationRecord

  belongs_to :farm

  validates :day_of_week, inclusion: { in: 0..6 }
  validates :opens_at, uniqueness: { scope: [:place_id, :day_of_week] }

  validate :opens_before_closes

  default_scope { order(day_of_week: :asc, opens_at: :asc) }

  protected

  def opens_before_closes
    if activated && opens_at && closes_at && opens_at >= closes_at
      errors.add(:closes_at, I18n.t('errors.opens_before_closes'))
    end
  end

end

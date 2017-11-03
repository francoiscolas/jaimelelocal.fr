class Account::SubscribtionsController < Account::AccountController

  before_action :require_farm!

  def index
    @farm = current_user.farm
  end

  def mailto
    current_user.farm.subscribers.each do |user|
      ApplicationMailer.mailto(
        reply_to: current_user.email,
        to: user.email,
        content_type: 'text/plain',
        subject: params['subject'],
        body: params['body']
      ).deliver_later
    end
    redirect_to user_farm_subscribtions_path, flash: {notice: t('.sent')}
  end

  def destroy
    Subscribtion.destroy_all(farm_id: current_user.farm.id, id: params[:ids])
    redirect_to user_farm_subscribtions_path
  end

end

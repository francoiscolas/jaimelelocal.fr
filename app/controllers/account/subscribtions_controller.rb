class Account::SubscribtionsController < Account::AccountController

  before_action :require_farm!

  def index
    @farm = current_user.farm
    @mail = SubscriberMail.new
  end

  def sendmail
    @farm = current_user.farm
    @mail = SubscriberMail.new(mail_params)
    if @mail.valid?
      current_user.farm.subscribers.each do |user|
        ApplicationMailer.mailto(
          reply_to: current_user.email,
          to: user.email,
          content_type: 'text/html; charset=utf-8',
          subject: SubscriberMail.prepend_subject_with(@farm) + @mail.subject,
          body: @mail.body
        ).deliver_later
      end
      redirect_to user_farm_subscribtions_path, flash: {notice: t('.sent')}
    else
      logger.debug @mail.errors.keys
      render :index
    end
  end

  def destroy
    Subscribtion.destroy_all(farm_id: current_user.farm.id, id: params[:ids])
    redirect_to user_farm_subscribtions_path
  end

  private

  def mail_params
    params.require(:mail).permit!
  end

end

class Account::SubscribtionsController < Account::AccountController

  before_action :require_farm!

  def index
    @farm = current_user.farm
    @mail = SubscriberMail.new
  end

  def create
    @farm = current_user.farm
    @emails = params['emails'].scan(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i)
    if @emails.count > 0
      @emails.each do |email|
        @farm.subscribtions.create(email: email)
      end
      redirect_to user_farm_subscribtions_path, flash: {notice: t('.added', count: @emails.count)}
    else
      redirect_to user_farm_subscribtions_path, flash: {alert: t('.blank')}
    end
  end

  def sendmail
    @farm = current_user.farm
    @mail = SubscriberMail.new(mail_params)
    if @mail.valid?
      current_user.farm.subscribtions.each do |s|
        ApplicationMailer.mailto(
          reply_to: current_user.email,
          to: s.get_email,
          content_type: 'text/html; charset=utf-8',
          subject: SubscriberMail.prepend_subject_with(@farm) + @mail.subject,
          body: @mail.body
        ).deliver_later
      end
      redirect_to user_farm_subscribtions_path, flash: {notice: t('.sent')}
    else
      render :index
    end
  end

  def destroy
    Subscribtion.destroy_all(farm_id: current_user.farm.id, id: params[:ids])
    redirect_to user_farm_subscribtions_path, flash: {notice: t('.destroyed')}
  end

  private

  def mail_params
    params.require(:mail).permit!
  end

end

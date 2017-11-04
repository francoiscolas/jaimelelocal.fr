class Account::SubscribtionsController < Account::AccountController

  before_action :require_farm!

  def index
    @farm = current_user.farm
    @mail = SubscriberMail.new
  end

  def create
    count = 0
    emails = params['emails'].scan(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i)
    emails.each do |email|
      count += 1 if current_user.farm.subscribtions.create(email: email).persisted?
    end
    redirect_to user_farm_subscribtions_path,
      flash: (count > 0) ? {notice: t('.added', count: count)} : {alert: t('.blank')}
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

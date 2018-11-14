class SubscriberMailer < ApplicationMailer

  def confirm_subscribtion_email
    @subscribtion = params[:subscribtion]
    mail(to: @subscribtion.email,
         subject: "jllocal.fr / #{@subscribtion.farm.name} / Inscription")
  end

end

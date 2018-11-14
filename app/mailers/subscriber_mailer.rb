class SubscriberMailer < ApplicationMailer

  def confirm_subscribtion_email
    @subscribtion = params[:subscribtion]
    @farm         = @subscribtion.farm
    mail(to: @subscribtion.email,
         subject: "Inscription à #{@farm.name}")
  end

  def newsletter_email
    @subscribtion = params[:subscribtion]
    @farm         = @subscribtion.farm
    @subject      = params[:subject]
    @body         = params[:body]

    mail(to: @subscribtion.get_email,
         reply_to: @farm.email,
         subject: "#{@farm.name} / #{@subject}")
  end

end

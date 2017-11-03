class ApplicationMailer < ActionMailer::Base
  default from: 'francois@jaimelelocal.fr'
  layout 'mailer'

  def mailto(params)
    mail(params)
  end

end

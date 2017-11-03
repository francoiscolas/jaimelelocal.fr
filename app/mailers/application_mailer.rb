class ApplicationMailer < ActionMailer::Base
  default from: 'Jaimelelocal.fr <francois@jaimelelocal.fr>'
  layout 'mailer'

  def mailto(params)
    mail(params)
  end

end

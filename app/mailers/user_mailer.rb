class UserMailer < ApplicationMailer

  def welcome_email
    @user = params[:user]
    mail(to: @user.email,
         subject: "Bienvenue sur Jaimelelocal.fr")
  end

end

require 'test_helper'

class UserMailerTest < ActionMailer::TestCase

  test "welcome_email" do
    user  = User.new(email: 'someone@somewhere.com')
    email = UserMailer.with(user: user).welcome_email
 
    assert_emails 1 do
      email.deliver_now
    end
    assert_equal ['francois@jaimelelocal.fr'], email.from
    assert_equal ['someone@somewhere.com'], email.to
    assert_equal 'Bienvenue sur Jaimelelocal.fr', email.subject
  end

end

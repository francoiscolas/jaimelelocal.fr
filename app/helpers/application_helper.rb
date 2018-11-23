module ApplicationHelper

  def menu_box_item(name, url)
    content_tag(:li, class: 'menu-item') do
      if url_for == url
        link_to name, url, class: 'active'
      else
        link_to name, url
      end
    end
  end

  def user_has_farm?
    current_user && current_user.farm && current_user.farm.persisted?
  end

  def text_logo
    '<span class="logo"><b>jaimelelocal</b>.fr</span>'.html_safe
  end

  def address_to_bloc(address)
    address.gsub(/, /, '<br/>').html_safe
  end

  def google_maps(args)
    "<script src=\"https://maps.googleapis.com/maps/api/js?key=" \
    "#{Rails.application.credentials.google_api_key!}#{args}\">" \
    "</script>".html_safe
  end

end

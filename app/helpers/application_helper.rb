module ApplicationHelper

  def menu_box_item(name, url)
    if url_for == url
      content_tag(:li, class: 'is-active') do
        link_to name
      end
    else
      content_tag(:li) do
        link_to name, url
      end
    end
  end

  def user_has_farm?
    current_user && current_user.farm && current_user.farm.persisted?
  end

end

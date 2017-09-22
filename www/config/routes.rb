Rails.application.routes.draw do

  # Root
  root to: 'root#index'

  # Account
  devise_for :users, :skip => [:registrations, :sessions, :passwords]
  devise_scope :user do
    # Registrations
    get    '/signup',           to: 'account/registrations#new',     as: :new_user_registration
    post   '/account',          to: 'account/registrations#create',  as: :user_registration
    get    '/account',          to: redirect('/account/profile'),    as: :user_root
    get    '/account/edit',     to: 'account/registrations#edit',    as: :edit_user_registration
    get    '/account/profile',  to: 'account/registrations#profile', as: :edit_user_profile
    patch  '/account',          to: 'account/registrations#update'
    put    '/account',          to: 'account/registrations#update'
    get    '/account/cancel',   to: 'account/registrations#cancel',  as: :cancel_user_registration
    delete '/account',          to: 'account/registrations#destroy'

    # Sessions
    get    '/login',  to: 'devise/sessions#new',     as: :new_user_session
    post   '/login',  to: 'devise/sessions#create',  as: :user_session
    delete '/logout', to: 'devise/sessions#destroy', as: :destroy_user_session

    # Passwords
    get   '/account/password/new',  to: 'devise/passwords#new',    as: :new_user_password
    post  '/account/password',      to: 'devise/passwords#create', as: :user_password
    get   '/account/password/edit', to: 'devise/passwords#edit',   as: :edit_user_password
    patch '/account/password',      to: 'devise/passwords#update'
    put   '/account/password',      to: 'devise/passwords#update'
  end

  # Farm account
  scope '/account', :module => 'account', as: :user do
    resource :farm do
      resources :places, except: [:show, :destroy] do
        post '/destroy', to: 'places#destroy', on: :collection, as: :destroy
      end
#      resources :products, :except => [:index, :show, :destroy] do
#        post '/destroy' => 'products#destroy',           :on => :collection, as: :destroy
#      end
    end
  end

end

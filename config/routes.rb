Rails.application.routes.draw do

  # Root
  root to: 'root#home'

  # Autocomplete
  get '/autocomplete/q', :to => 'root#autocomplete_q'

  # Account
  devise_for :users, :skip => [:registrations, :sessions, :passwords]
  devise_scope :user do
    # Registrations
    get    '/je-suis-producteur',     to: 'account/registrations#i_am_farmer',    as: :i_am_farmer
    get    '/inscription',            to: 'account/registrations#new',            as: :new_user_registration
    post   '/mon-compte',             to: 'account/registrations#create',         as: :user_registration
    get    '/mon-compte',             to: redirect('/mon-compte/modifier'),       as: :user
    get    '/mon-compte/modifier',    to: 'account/registrations#edit',           as: :edit_user_registration
    patch  '/mon-compte',             to: 'account/registrations#update'
    get    '/mon-compte/cancel',      to: 'account/registrations#cancel',         as: :cancel_user_registration
    delete '/mon-compte',             to: 'account/registrations#destroy'

    # Sessions
    get    '/connexion',   to: 'devise/sessions#new',     as: :new_user_session
    post   '/connexion',   to: 'devise/sessions#create',  as: :user_session
    delete '/deconnexion', to: 'devise/sessions#destroy', as: :destroy_user_session

    # Passwords
    get   '/mon-mot-de-passe/nouveau',  to: 'devise/passwords#new',    as: :new_user_password
    post  '/mon-mot-de-passe',          to: 'devise/passwords#create', as: :user_password
    get   '/mon-mot-de-passe/modifier', to: 'devise/passwords#edit',   as: :edit_user_password
    patch '/mon-mot-de-passe',          to: 'devise/passwords#update'
    put   '/mon-mot-de-passe',          to: 'devise/passwords#update'
  end

  # Farm account
  scope '/mon-compte', :module => 'account', as: :user do
    resource :farm, path: 'ma-ferme', path_names: {new: 'enregistrement', edit: 'parametres'}, except: :update do
      resources :products, path: 'produits', path_names: {new: 'nouveau', edit: ''}, :except => [:index, :show, :destroy] do
        post '/destroy', to: 'products#destroy', on: :collection, as: :destroy
      end
      resources :subscribtions, path: 'abonnements', except: [:new, :show, :edit, :update, :destroy] do
        post '/sendmail', to: 'subscribtions#sendmail', on: :collection
        post '/destroy',  to: 'subscribtions#destroy',  on: :collection
      end
      patch '/parametres', to: 'farms#update', as: nil
      patch '/',           to: 'farms#update_page'
    end
  end

  # Public farm page
  get     '/:farm_url',                     to: 'root#farm',        as: :farm
  post    '/:farm_url/subscribtion',        to: 'root#subscribe',   as: :farm_subscribtion
  get     '/:farm_url/unsubscribe/:token',  to: 'root#unsubscribe', as: :farm_unsubscribe
#  delete  '/:farm_url/subscribtion',  to: 'root#unsubscribe'
  post    '/:farm_url/sendmail',            to: 'root#sendmail'

end

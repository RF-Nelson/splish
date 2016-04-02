Rails.application.routes.draw do
  # root to: 'root#root'
  root to: 'home#index'

  namespace :api, defaults: { format: :json } do
    resources :events
  end

  resources :guests, only: [:new, :create, :show]
  resource :session, only: [:new, :create, :destroy]
end

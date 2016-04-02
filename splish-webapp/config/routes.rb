Rails.application.routes.draw do
  # root to: 'root#root'
  root to: 'home#index'

  namespace :api, defaults: { format: :json } do
    resources :events do
    end
  end

  resources :guests, only: [:new, :create, :show]
  resource :session, only: [:new, :create, :destroy]
end

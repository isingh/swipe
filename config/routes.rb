Swipe::Application.routes.draw do
  resource :user_cards, only: [:create]

  devise_for :users

  root to: 'homepage#index'
  match '/cards', to: 'homepage#cards'
end

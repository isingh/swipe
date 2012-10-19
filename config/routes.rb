Swipe::Application.routes.draw do
  devise_for :users

  root to: 'homepage#index'
  match '/cards', to: 'homepage#cards'
end

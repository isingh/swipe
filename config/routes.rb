Swipe::Application.routes.draw do
  devise_for :users

  root to: 'homepage#index'
  match '/newcard', to: 'homepage#newcard'
end

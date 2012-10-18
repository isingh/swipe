Swipe::Application.routes.draw do
  root to: 'homepage#index'
  match '/newcard', to: 'homepage#newcard'
end

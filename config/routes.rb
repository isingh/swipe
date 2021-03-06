Swipe::Application.routes.draw do
  resource :user_cards, only: [:create]
  match '/user_cards/:id/add_transaction', to: 'user_cards#add_transaction', via: [:post]
  match '/users/transactions', to: 'users#transactions'
  match 'get_offers/text_message/:offerwall_code', to: 'get_offers#text_message'

  devise_for :users

  root to: 'homepage#index'
  match '/cards', to: 'homepage#cards'
  match '/card_spring/callback', to: 'card_spring#callback', via: [:post]
  match '/offerwall', to: 'offerwall#offerwall'
  match '/retailers', to: 'retailers#retailers'
  match '/pitch', to: 'pitch#pitch'
end

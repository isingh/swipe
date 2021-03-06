require 'card_spring'

class UserCardsController < ApplicationController
  before_filter :authenticate_user!

  def create
    user_card = current_user.user_cards.build
    user_card.token = params[:token]
    user_card.last4 = params[:last4]
    user_card.brand = params[:brand]
    user_card.brand_string = params[:brand_string]
    user_card.expiration = params[:expiration]
    success  = user_card.save

    current_user.card_spring_uid = params[:user_id] if params[:user_id].present?
    success &= current_user.save
    render json: {success: success, all_cards: current_user.user_cards}.to_json
  end

  def add_transaction
    render json: {success: false} unless params[:amount].present?
    card = UserCard.find(params[:id])
    CardSpring::Transaction.fake_transaction(card.token, CardSpring::Business::ALL_ACTIVE.first.first, params[:amount])

    render json: {success: true}
  end
end

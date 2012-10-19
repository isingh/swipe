class UserCardsController < ApplicationController
  before_filter :authenticate_user!

  def show
    render json: current_user.user_cards.to_json
  end

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
    render json: {success: success}.to_json
  end
end

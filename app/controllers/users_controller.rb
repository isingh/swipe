class UsersController < ApplicationController
  def transactions
    render json: current_user.transactions.includes(:user_card).to_json(:include => :user_card)
  end
end

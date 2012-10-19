class CardSpringController < ApplicationController
  def callback
    Rails.logger.info("Getting a callback with #{params}")
    begin
      user = User.where(card_spring_uid: params[:user_id]).first
      user.record_card_transaction(params) if user
    rescue
    end
    render nothing: true
  end
end

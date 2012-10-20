class GetOffersController < ApplicationController
  def text_message
    @all_offers = []
    transaction = Transaction.find_by_offerwall_code(params[:offerwall_code])

    @error = "No such transaction" unless transaction

    Rails.logger.info("@@@@@@@@@@@@@@@@@@@@@@#{@error}")
    return if @error


    @time_to_expiry = Time.now.utc - transaction.purchase_date_time
    @time_to_expiry = 24.hours - @time_to_expiry

    @all_offers = AdvertiserOffer.all
    Rails.logger.info(@all_offers)
  end
end

class GetOffersController < ApplicationController
  def text_message
    transaction = Transaction.find_by_offerwall_code(params[:offerwall_code])

    @time_to_expiry = Time.now.utc - transaction.purchase_date_time
    @time_to_expiry = 24.hours - @time_to_expiry
  end
end

class CardSpringController < ApplicationController
  def callback
    Rails.logger.info(params.inspect)
    render nothing: true
  end
end

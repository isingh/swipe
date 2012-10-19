class RetailersController < ActionController::Base
  protect_from_forgery

  def retailers
    respond_to do |f|
      f.html { render :layout => 'application' }
    end
  end
end

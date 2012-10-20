require 'communicator'
require 'url_shortener'

class Transaction < ActiveRecord::Base
  belongs_to :user
  belongs_to :user_card

  attr_accessible :user, :user_card

  delegate :last4, :brand, :brand_string, :expiration, :to => :user_card

  def send_offerwall_invite
    self.offerwall_code = UUIDTools::UUID.random_create.to_s.gsub('-','') unless offerwall_code
    url = "http://swipeit.herokuapp.com/get_offers/text_message/#{offerwall_code}"
    url = UrlShortener::Client.new(UrlShortener::Authorize.new('ipsingh', 'R_189580fc7a806655bad0079e3b8068b0')).shorten(url).shortUrl

    messages = [
        "Tapjoy Rewards - You just made a purchase at #{cs_business_name} that qualifies for discounts!",
        " Redeem at #{url}"
    ]

    messages.each do |msg|
      Communicator.send_message(
          '(415) 413 4641',
          user.phone_number,
          msg
      )
    end
  end
end

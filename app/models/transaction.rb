require 'communicator'
require 'googl'

class Transaction < ActiveRecord::Base
  belongs_to :user
  belongs_to :user_card

  attr_accessible :user, :user_card

  delegate :last4, :brand, :brand_string, :expiration, :to => :user_card

  def send_offerwall_invite
    self.offerwall_code = UUIDTools::UUID.random_create.to_s.gsub('-','') unless offerwall_code
    url = "http://swipeit.herokuapp.com/get_offers/text_message/#{offerwall_code}"

    Communicator.send_message(
        '(415) 413 4641',
        user.phone_number,
        "You just spent #{amount} #{currency} at #{cs_business_name}. You are eligible for an offer. Visit #{Googl.shorten(url).short_url}"
    )
  end
end

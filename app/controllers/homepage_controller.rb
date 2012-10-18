require 'uuidtools'
require 'card_spring'

class HomepageController < ApplicationController
  before_filter :authenticate_user!

  def index
  end

  def newcard
    timestamp = Time.now.utc.to_i
    token = security_token

    new_card_info = {
      publisher_id:     CARD_SPRING_APP_ID,
      security_token:   token,
      timestamp:        timestamp,
      hmac:             CardSpring.sign_card_registration(token, timestamp, current_user.card_spring_uid),
      test_mode:        CARD_SPRING_TEST_MODE
    }
    new_card_info[:user_id] = current_user.card_spring_uid if current_user.card_spring_uid
    gon.new_card_info = new_card_info
  end

  private

  def security_token
    UUIDTools::UUID.random_create.to_s.gsub('-','')
  end
end

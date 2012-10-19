require 'downloader'

module CardSpring
  class << self
    def get_auth_tokens
      [CARD_SPRING_APP_ID, CARD_SPRING_SECRET]
    end

    def sign_card_registration(random_token, timestamp, user_id = nil)
      sign_string = "#{random_token}:#{timestamp}:#{user_id}"
      OpenSSL::HMAC.hexdigest('sha1', CARD_SPRING_SECRET, sign_string)
    end
  end

  autoload :Business, 'card_spring/business'
  autoload :App, 'card_spring/app'
  autoload :Transaction, 'card_spring/transaction'
end

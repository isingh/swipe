require 'downloader'

module CardSpring
  class << self
    def get_auth_tokens
      [CARD_SPRING_APP_ID, CARD_SPRING_SECRET]
    end

    def sign_card_registration(random_token, timestamp, user_id)
      sign_string = "#{random_token}:#{timestamp}"
      sign_string += ":#{user_id}" if user_id

      OpenSSL::HMAC.hexdigest(OpenSSL::Digest::Digest.new('sha1'), CARD_SPRING_SECRET, sign_string)
    end
  end

  autoload :Business, 'card_spring/business'
end

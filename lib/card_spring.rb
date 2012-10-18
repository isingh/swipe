require 'downloader'

module CardSpring
  class << self
    def get_auth_tokens
      [CARD_SPRING_APP_ID, CARD_SPRING_SECRET]
    end
  end

  autoload :Business, 'card_spring/business'
end

require 'downloader'

module CardSpring
  class Transaction
    def self.fake_transaction(token, business_id, event_type = 'authorization', amount = 100)
      url = "#{CARD_SPRING_API_URL}/v1/transactions"

      data = {
        card_token:     token,
        event_type:     event_type,
        amount:         amount,
        business_id:    business_id,
      }
      begin
        Downloader.post(url, CardSpring.get_auth_tokens, data)
      end
    end
  end
end

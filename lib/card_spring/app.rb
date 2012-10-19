module CardSpring
  class App
    attr_accessor :id, :business_Id, :auto_connect, :notification, :redemption

    def self.create_tracking_app(min_purchase = 0)
      url = "#{CARD_SPRING_API_URL}/v1//apps"
      data = {
        execution_mode: 'realtime',
        auto_connect: 'all',
        notification: {
          type: 'authorization_events',
          min_purchase: min_purchase,
          count: 0
        }
      }
      Downloader.post(url, CardSpring.get_auth_tokens, data)
    end

    def from_json(business_attributes)
      [:id, :business_Id, :auto_connect, :notification, :redemption].each do |attr|
        self.send("#{attr}=", business_attributes[attr.to_s]) if business_attributes[attr.to_s].present?
      end
    end
  end
end

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

    def self.list_all
      url = "#{CARD_SPRING_API_URL}/v1/apps"
      all_apps = JSON::parse(Downloader.get(url, CardSpring.get_auth_tokens))

      apps = []
      if all_apps && all_apps["items"]
        all_apps["items"].each do |app_attr|
          app = self.new
          app.from_json(app_attr)
          apps << app
        end
      end
      apps
    end

    def self.delete(app_id)
      url = "#{CARD_SPRING_API_URL}/v1/apps/#{app_id}"
      Downloader.delete(url, CardSpring.get_auth_tokens)
      true
    end

    def from_json(app_attributes)
      [:id, :business_Id, :auto_connect, :notification, :redemption].each do |attr|
        self.send("#{attr}=", app_attributes[attr.to_s]) if app_attributes[attr.to_s].present?
      end
    end
  end
end

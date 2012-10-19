require 'downloader'

module CardSpring
  class Business
    attr_accessor :id, :name, :phone, :email, :redemption_capabilities, :notification_capabilities

    def self.find(business_id = nil)
      url = "#{CARD_SPRING_API_URL}/v1/businesses"
      url += "/#{business_id}" if business_id
      businesses = []
      begin
        all_businesses = JSON::parse(Downloader.get(url, CardSpring.get_auth_tokens))
        if business_id
          business = self.new
          business.from_json(all_businesses)
          return business
        end

        if all_businesses && all_businesses["items"].present?
          all_businesses["items"].each do |business_details|
            business = self.new
            business.from_json(business_details)
            businesses << business
          end
        end
      rescue
      end

      businesses
    end

    def self.active_connections
      url = "#{CARD_SPRING_API_URL}/v1/businesses"
      begin
        all_businesses = JSON.parse(Downloader.get(url, CardSpring.get_auth_tokens))
      rescue
      end
    end

    def from_json(business_attributes)
      [:id, :name, :phone, :email, :redemption_capabilities, :notification_capabilities].each do |attr|
        self.send("#{attr}=", business_attributes[attr.to_s]) if business_attributes[attr.to_s].present?
      end
    end
  end
end

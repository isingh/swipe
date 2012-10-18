require 'downloader'

module CardSpring
  class Business
    attr_accessor :id, :name, :phone, :email, :redemption_capabilities, :notification_capabilities

    def self.find
      url = "#{CARD_SPRING_API_URL}/v1/businesses"
      businesses = []
      begin
        all_businesses = JSON::parse(Downloader.get(url, CardSpring.get_auth_tokens))

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

    def from_json(business_attributes)
      [:id, :name, :phone, :email, :redemption_capabilities, :notification_capabilities].each do |attr|
        self.send("#{attr}=", business_attributes[attr.to_s]) if business_attributes[attr.to_s].present?
      end
    end
  end
end

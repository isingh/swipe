class Downloader
  def self.get(url, auth = nil, params = {}, options = {})
    url_conn = Faraday.new(url: url)
    url_conn.basic_auth(auth[0], auth[1]) if auth
    response = url_conn.get do |req|
      req.params = params
      req.options = options
    end
    response ? response.body : nil
  end
end

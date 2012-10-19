class Downloader
  def self.get(url, auth = nil, params = {}, options = {})
    url_conn = get_connection(url, auth)
    response = url_conn.get do |req|
      req.params = params
      req.options = options
    end
    response ? response.body : nil
  end

  def self.post(url, auth = nil, data = {}, options = {})
    url_conn = get_connection(url, auth)
    response = url_conn.post do |req|
      req.body = data
      req.options = options
    end
    response ? response.body : nil
  end

  def self.delete(url, auth)
    get_connection(url, auth).delete
  end

  private

  def self.get_connection(url, auth = nil)
    url_conn = Faraday.new(url: url)
    url_conn.basic_auth(auth[0], auth[1]) if auth
    url_conn
  end
end

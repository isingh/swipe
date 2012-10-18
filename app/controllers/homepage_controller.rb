class HomepageController < ApplicationController
  before_filter :authenticate_user!

  def index
  end

  def newcard
  end
end

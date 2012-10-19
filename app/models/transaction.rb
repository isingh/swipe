class Transaction < ActiveRecord::Base
  belongs_to :user
  belongs_to :user_card

  attr_accessible :user, :user_card
end

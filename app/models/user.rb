require 'card_spring'

class User < ActiveRecord::Base
  # Include default devise modules. Others available are:
  # :token_authenticatable, :confirmable,
  # :lockable, :timeoutable and :omniauthable
  devise :database_authenticatable, :registerable, :token_authenticatable,
         :recoverable, :rememberable, :trackable, :validatable

  # Setup accessible (or protected) attributes for your model
  attr_accessible :email, :password, :password_confirmation, :remember_me,
                  :token, :last4, :brand, :brand_string, :expiration, :first_name,
                  :last_name, :phone_number

  has_many :cards, class_name: :UserCard
  has_many :transactions

  def record_card_transaction(params)
    card = self.cards.where(params[:card_token]).first
    return unless card

    transaction = Transaction.new
    transaction.user_card           = card
    transaction.user                = self
    transaction.cs_business_id      = params[:business_id]
    transaction.cs_business_name    = CardSpring::Business::ALL_ACTIVE[params[:business_id]]
    transaction.currency            = params[:currency]
    transaction.amount              = params[:amount]
    transaction.purchase_date_time  = params[:purchase_date_time]
    transaction.event_type          = params[:event_type]
    transaction.cs_transaction_id   = params[:transaction_id]
    transaction.save
  end
end

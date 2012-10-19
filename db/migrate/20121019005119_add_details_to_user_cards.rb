class AddDetailsToUserCards < ActiveRecord::Migration
  def change
    add_column :user_cards, :last4, :string
    add_column :user_cards, :brand, :string
    add_column :user_cards, :brand_string, :string
    add_column :user_cards, :expiration, :string
  end
end

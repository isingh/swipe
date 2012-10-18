class AddCardSpringUserIdToUser < ActiveRecord::Migration
  def change
    add_column :users, :card_spring_uid, :string
  end
end

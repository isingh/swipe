class CreateUserCards < ActiveRecord::Migration
  def change
    create_table :user_cards do |t|
      t.integer :user_id
      t.string :token
      t.timestamps
    end
  end
end

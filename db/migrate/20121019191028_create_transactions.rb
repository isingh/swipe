class CreateTransactions < ActiveRecord::Migration
  def change
    create_table :transactions do |t|
      t.integer :user_card_id
      t.integer :user_id
      t.string :cs_business_id
      t.string :cs_business_name
      t.string :currency
      t.string :amount
      t.datetime :purchase_date_time
      t.string :event_type
      t.string :cs_transaction_id
      t.timestamps
    end
  end
end

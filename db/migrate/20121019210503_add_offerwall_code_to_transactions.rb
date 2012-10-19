class AddOfferwallCodeToTransactions < ActiveRecord::Migration
  def change
    add_column :transactions, :offerwall_code, :string
  end
end

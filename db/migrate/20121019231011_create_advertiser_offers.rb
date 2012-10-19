class CreateAdvertiserOffers < ActiveRecord::Migration
  def change
    create_table :advertiser_offers do |t|
      t.string :name
      t.string :description
      t.string :url
      t.timestamps
    end
  end
end

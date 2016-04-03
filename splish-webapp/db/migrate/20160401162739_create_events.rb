class CreateEvents < ActiveRecord::Migration
  def change
    create_table :events do |t|
      t.integer :owner_id, null: false
      t.string :title, null: false
      t.text :description, null: false
      t.datetime :start_date
      t.datetime :end_date
      t.string  :location, null: false

      t.timestamps null: false
    end
  end
end

class CreateGuests < ActiveRecord::Migration
  def change
    create_table :guests do |t|
      t.string :email, null: false
      t.string :first_name, null: false
      t.string :last_name, null: false
      t.string :password_digest, null: false
      t.string :session_token, null: false

      t.timestamps null: false
    end

    add_index :guests, :email, unique: true
    add_index :guests, :session_token, unique: true
  end
end

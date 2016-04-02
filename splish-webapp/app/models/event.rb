class Event < ActiveRecord::Base
  validates :owner_id, :location, :title, :description, :start_date, :end_date, presence: true

  belongs_to( :guest,
    class_name: "Guest",
    foreign_key: :owner_id,
    primary_key: :id
  )
end

class Event < ActiveRecord::Base
  validates :owner_id, :location, :title, :description, presence: true

  has_and_belongs_to_many :guests

end

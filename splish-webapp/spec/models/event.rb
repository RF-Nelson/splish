require 'rails_helper'

RSpec.describe Event, type: :model do

  describe 'create an event' do
    it 'saves a valid Event object' do
      e = Event.create!(
        owner_id: 1,
        title: "Title",
        description: "Descrip",
        start_date: Time.now,
        end_date: Time.now,
        location: "Awesomeville"
      )

      expect(e.save).to be true
    end
  end

  describe 'Event validations' do

    it 'should ensure a non-blank title on signup' do
      u = Event.new(
        owner_id: 1,
        title: nil,
        description: "Descrip",
        start_date: Time.now,
        end_date: Time.now,
        location: "Awesomeville"
      )
      expect(u.save).to be false
    end

    it 'should ensure a non-blank description on signup' do
      u = Event.new(
        owner_id: 1,
        title: "Title",
        description: nil,
        start_date: Time.now,
        end_date: Time.now,
        location: "Awesomeville"
      )
      expect(u.save).to be false
    end

    it 'should ensure a non-blank start date on signup' do
      u = Event.new(
        owner_id: 1,
        title: "Title",
        description: "Descrip",
        start_date: nil,
        end_date: Time.now,
        location: "Awesomeville"
      )
      expect(u.save).to be false
    end

    it 'should ensure a non-blank end date on signup' do
      u = Event.new(
        owner_id: 1,
        title: "Title",
        description: "Descrip",
        start_date: Time.now,
        end_date: nil,
        location: "Awesomeville"
      )
      expect(u.save).to be false
    end

    it 'should ensure a non-blank location on signup' do
      u = Event.new(
        owner_id: 1,
        title: "Title",
        description: "Descrip",
        start_date: Time.now,
        end_date: Time.now,
        location: nil
      )
      expect(u.save).to be false
    end
  end
end

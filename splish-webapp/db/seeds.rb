import 'faker'

# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rake db:seed (or created alongside the db with db:setup).
#
# Examples:
#
#   cities = City.create([{ name: 'Chicago' }, { name: 'Copenhagen' }])
#   Mayor.create(name: 'Emanuel', city: cities.first)

50.times do
  Guest.create!([{
    email: Faker::Internet.email,
    first_name: Faker::Name.first_name,
    last_name: Faker::Name.last_name,
    password_digest: "needTextToPassValidation"
  }])
end

50.times do

  # Create an array that will be sampled. The value returned will be the
  # length of the event; I've weighted the odds so more short events
  # are seeded than long events. The number represents the number of nights
  # (e.g. an event spanning two days would be represented as a length of 1)
  # Also, there is a 1 in 5 chance the dates will be nil, which is "TBD"
  if (1..5).to_a.sample == 1
    start_date = nil
    end_date = nil
  else
    started_already = [true, false].sample
    sample_array = (0..300).to_a

    if started_already
      start_date = sample_array.sample.days.ago
    else
      start_date = sample_array.sample.days.from_now
    end

    weighted_array = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,2,2,2,2,2,2,2,2,2,3,3,3,3]
    event_length = weighted_array.sample
    hour_offset = weighted_array.sample + 2
    end_date = start_date + event_length.days - hour_offset.hours
    start_date = start_date - hour_offset.hours
  end

  Event.create([{
    owner_id: (0..30).to_a.sample,
    title: Faker::Hipster.sentence(3, true, 2),
    description: Faker::Hipster.paragraph(2, true),
    start_date: start_date,
    end_date: end_date,
    location: Faker::Address.city + ', ' + Faker::Address.state
  }])
end

300.times do
  user_id = (1..50).to_a.sample
  event_id = (1..50).to_a.sample
  event = Event.find_by_id(event_id)
  guest = Guest.find_by_id(user_id)
  guest.events.push(event) if guest.events.include?(event) == false
  event.guests.push(guest) if event.guests.include?(guest) == false
end

guest = Guest.new(email: "johnsmith@example.com", first_name: "John", last_name: "Smith", password: "testtest")
guest.save

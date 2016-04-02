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
  started_already = [true, false].sample
  sample_array = (0..300).to_a

  if started_already
    start_date = sample_array.sample.days.ago
  else
    start_date = sample_array.sample.days.from_now
  end
  # Create an array that will be sampled. The value returned will be the 
  # length of the event; I've weighted the odds so more short events
  # are seeded than long events. The number represents the number of nights
  # (e.g. an event spanning two days would be represented as a length of 1)
  event_length = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,2,2,2,2,2,2,2,2,2,3,3,3,3,4,5,6,7].sample
  end_date = start_date + event_length.days

  Event.create([{
    owner_id: (0..30).to_a.sample,
    title: Faker::Hipster.sentence(3, true, 2),
    description: Faker::Hipster.paragraph(2, true, 2),
    start_date: start_date,
    end_date: end_date,
    location: Faker::Address.city + ', ' + Faker::Address.state
  }])
end

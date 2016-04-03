require 'rails_helper'

RSpec.describe Guest, type: :model do

  describe 'creates user' do
    it 'saves a user' do
      u = Guest.create!(
        email: "example@example.com",
        first_name: "John",
        last_name: "Smith",
        password: "needTextToPassValidation"
      )

      expect(u.save).to be true
    end
  end

  describe 'User validations' do

    it 'should ensure a non-blank email on signup' do
      u = Guest.new(
        email: '',
        first_name: Faker::Name.first_name,
        last_name: Faker::Name.last_name,
        password: "needTextToPassValidation"
      )
      expect(u.save).to be false
    end

    it 'should ensure a password at least six characters long' do
      u = Guest.new(
        email: Faker::Internet.email,
        first_name: Faker::Name.first_name,
        last_name: Faker::Name.last_name,
        password: "n"
      )
      expect(u.save).to be false
    end


    it 'should ensure a unique email on signup' do
      fakeEmail = "test@test.com"

      Guest.create(
        email: fakeEmail,
        first_name: "John",
        last_name: "Smith",
        password: "needTextToPassValidation"
      )

      user = Guest.new(
        email: fakeEmail,
        first_name: "John",
        last_name: "Smith",
        password: "needTextToPassValidation"
      )
      user.save
      expect(user.errors.full_messages[0]).to eq("Email has already been taken")
    end
  end


end

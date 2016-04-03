require 'spec_helper'

feature "the signup process" do

  scenario "has a new user page" do
    visit "/"
    expect(page).to have_content "Sign Up"
  end

  it "signs user in and shows the user's email on header after sign up" do
    visit new_guest_url
    fill_in 'E-mail', :with => "testname"
    fill_in 'Password', :with => "password"
    fill_in 'First Name', :with => "John"
    fill_in 'Last Name', :with => "Smith"
    click_on "Sign Up"
    expect(page).to have_content "John"
  end

end

feature "logging in" do

  before(:each) do
    visit new_guest_url
    fill_in 'E-mail', :with => "testname"
    fill_in 'Password', :with => "password"
    fill_in 'First Name', :with => "John"
    fill_in 'Last Name', :with => "Smith"
    click_on "Sign Up"
    click_on "Sign Out"
  end

  it "works after a user signs out" do
    visit '/'
    fill_in 'E-mail', :with => "testname"
    fill_in 'Password', :with => "password"
    click_on "Sign In"
    expect(page).to have_content "John"
  end

end

feature "logging out" do

  it "logs out a user" do
    visit new_guest_url
    fill_in 'E-mail', :with => "testname"
    fill_in 'Password', :with => "password"
    fill_in 'First Name', :with => "John"
    fill_in 'Last Name', :with => "Smith"
    click_on "Sign Up"
    click_on "Sign Out"
    expect(page).to have_content "Sign Up"
    expect(page).not_to have_content "John"
  end

end

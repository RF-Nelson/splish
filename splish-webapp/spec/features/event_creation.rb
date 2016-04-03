require 'spec_helper'

feature "the event creation process" do
  before(:each) do
    visit new_guest_url
    fill_in 'E-mail', :with => "testname"
    fill_in 'Password', :with => "password"
    fill_in 'First Name', :with => "John"
    fill_in 'Last Name', :with => "Smith"
    click_on "Sign Up"
    click_on "Create an Event"
  end

  scenario "shows the user the event creation modal" do
    visit "/"
    expect(page).to have_content "Create New Event"
  end

  it "allows the user to create an event" do
    visit '/'
    fill_in 'title', :with => "testname"
    fill_in 'description', :with => "description"
    fill_in 'Location', :with => "NEW YAWK"
    fill_in 'start_date', :with => Time.now
    fill_in 'end_date', :with => Time.now
    click_on "Create New Event"
    expect(page).to have_content "testname"
    expect(page).to have_content "description"
  end

end
#
# feature "logging in" do
#   it "works after a user signs out" do
#     visit '/'
#     fill_in 'E-mail', :with => "testname"
#     fill_in 'Password', :with => "password"
#     click_on "Sign In"
#     expect(page).to have_content "John"
#   end
#
# end
#
# feature "logging out" do
#
#   it "logs out a user" do
#     visit new_guest_url
#     fill_in 'E-mail', :with => "testname"
#     fill_in 'Password', :with => "password"
#     fill_in 'First Name', :with => "John"
#     fill_in 'Last Name', :with => "Smith"
#     click_on "Sign Up"
#     click_on "Sign Out"
#     expect(page).to have_content "Sign Up"
#     expect(page).not_to have_content "John"
#   end
#
# end

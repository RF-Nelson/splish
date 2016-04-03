require 'spec_helper'
require 'rails_helper'

feature "the event creation process" do

  scenario "does NOT show a non-logged-in user the event creation button" do
    visit "/"
    el = first('#blabla')
    button = first('#event-button')
    el.should be nil
  end

  scenario "shows a logged-in user the event creation button" do
    visit new_guest_url
    fill_in 'E-mail', :with => "testname"
    fill_in 'Password', :with => "password"
    fill_in 'First Name', :with => "John"
    fill_in 'Last Name', :with => "Smith"
    click_on "Sign Up"
    visit "/"
    expect(page).to have_content "Create an Event"
  end



  it "allows the user to create an event" do
    visit new_guest_url
    fill_in 'E-mail', :with => "testname"
    fill_in 'Password', :with => "password"
    fill_in 'First Name', :with => "John"
    fill_in 'Last Name', :with => "Smith"
    click_on "Sign Up"
    visit '/'
    find('#event-button').click
    assert_modal_visible
    fill_in 'title', :with => "testname"
    fill_in 'description', :with => "description"
    fill_in 'Location', :with => "NEW YAWK"
    fill_in 'start_date', :with => Time.now
    fill_in 'end_date', :with => Time.now
    click_on "Create New Event"
    visit '/'
    expect(page).to have_content "testname"
    expect(page).to have_content "description"
  end

end

def modal_wrapper_id
  '#modal-form'
end

def assert_modal_visible
  wait_until { page.find(modal_wrapper_id).visible? }
  # rescue Capybara::TimeoutError
    # flunk 'Expected modal to be visible.'
end

json.extract!(event,
  :id, :title, :description, :start_date, :end_date, :owner_id, :location)

json.guests event.guests do |guest|
  json.extract!(guest, :id, :first_name, :last_name, :email)
end

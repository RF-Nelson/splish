json.array!(@events) do |event|
  json.partial!('events', event: event)
end

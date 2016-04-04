class Api::EventsController < ApplicationController

  def index
    @events = Event.all
    render :index
  end

  def show
    @event = Event.find(params[:id])
    render :show
  end

  def new
    @event = Event.new
    render :new
  end

  def create
    data = JSON.parse(params.flatten()[0])
    data = (data["data"])
    @event = Event.new(data)
    if @event.save!
      Pusher.trigger('test_channel', 'my_event', {
        message: @event
      })

      head :ok, content_type: "text/html"
    else
      render json: @event.errors.full_messages, status: 422
    end
  end

  def edit
    @event = Event.find(params[:id])
    render :edit
  end

  def update
    @event = Event.find(params[:id])

    data = JSON.parse(params.flatten()[0])
    data = (data["data"])

    if (data["rsvp"])
      user_id = data["rsvp"]
      guest = Guest.find_by_id(user_id)
      @event.guests.push(guest) if @event.guests.include?(guest) == false
      guest.events.push(@event) if guest.events.include?(@event) == false
    elsif (data["dersvp"])
      user_id = data["dersvp"]
      guest = Guest.find_by_id(user_id)
      guest.events.delete(@event)
      @event.guests.delete(guest)
    else
      data.each do |k, v|
        if data[k] != nil
          @event[k] = data[k]
        end
      end
    end

    if @event.save()
      head :ok, content_type: "text/html"
    else
      render json: Event.new(listing_params).errors.full_messages, status: 422
    end
  end

  def destroy
    @event = Event.find(params[:id])
    @event.destroy if @event
    render :json => {}
  end

  private

    def listing_params
      params.require(:event).permit(:owner_id, :location, :start_date, :end_date, :description, :title)
    end

end

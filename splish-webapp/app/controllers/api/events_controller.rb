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

    data.each do |k, v|
      if data[k] != nil
        @event[k] = data[k]
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

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
    @event = Event.new(listing_params)
    if @event.save
      render :show
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
    if @event.update(listing_params)
      render :show
      # redirect_to listing_url(@event.id)
    else
      render json: Event.new(listing_params).errors.full_messages, status: 422
      # flash.now[:errors] = Event.new(listing_params).errors.full_messages
      # render :edit
    end
  end

  def destroy
    @event = Event.find(params[:id])
    @event.destroy if @event
    render :json => {}
  end

  private

    def listing_params
      params.require(:listing).permit(:owner_id, :location, :pet_name, :species,
      :breed, :age, :body, :gender, :picture)
    end

end

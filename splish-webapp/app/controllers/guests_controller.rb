class GuestsController < ApplicationController
  def new
    if signed_in?
      redirect_to "/#"
    else
      @guest = Guest.new
      render :new
    end
  end

  def create
    @guest = Guest.new(user_params)
    if @guest.save
      sign_in(@guest)
      redirect_to root_url
    else
      flash.now[:errors] = @guest.errors.full_messages
      render :new
    end
  end

  private

  def user_params
    params.require(:guest).permit(:email, :password, :first_name, :last_name)
  end
end

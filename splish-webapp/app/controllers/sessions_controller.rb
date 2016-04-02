class SessionsController < ApplicationController

  def new
    if signed_in?
      redirect_to root_url
    else
      render :new
    end
  end

  def create
    @guest = Guest.find_by_credentials(params[:guest][:email], params[:guest][:password])
    if @guest
      sign_in(@guest)
      redirect_to root_url
    else
      # redirect_to root_url
      flash.now[:errors] = ["Invalid username and/or password"]
      render :new
      # redirect_to root_url
    end
  end

  def destroy
    sign_out(current_user)
    redirect_to root_url
  end

end

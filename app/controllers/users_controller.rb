class UsersController < ApplicationController
  before_filter :authenticate_user!
  before_filter :correct_user?

    def edit
    @user = User.find(params[:id])
  end
  
  def update
    
    if @user.update_attributes(params[:user])
      redirect_to @user
    else
      render :edit
    end
  end


def show
    @user = User.find(params[:id])
    @wants = @user.wants.all
    @haves = @user.haves.all
    @want = Want.new
    @have = Have.new
  end


end

class HomeController < ApplicationController
  def index
    @users = User.all
    
    if current_user
      @user = current_user
      @wants = @user.wants
      @haves = @user.haves
      
      @want = Want.new
      @have = Have.new
    end
  end
  
  
end

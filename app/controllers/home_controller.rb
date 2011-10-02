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
  
  def update
    if request.post? and params.has_key?(:number)
      session_id = params[:user_id]
      @user = User.find()
      @user.number = params[:number]
      @user.save!
      respond_to do |format|
        format.html {redirect_to @user}
        format.js
      end
    end
  end
  
end

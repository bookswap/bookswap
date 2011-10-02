class WantsController < ApplicationController
  # GET /wants
  # GET /wants.json
  def index
    @wants = Want.all

    respond_to do |format|
      format.html # index.html.erb
      format.json { render json: @wants }
    end
  end

  # GET /wants/1
  # GET /wants/1.json
  def show
    @want = Want.find(params[:id])

    respond_to do |format|
      format.html # show.html.erb
      format.json { render json: @want }
    end
  end

  # GET /wants/new
  # GET /wants/new.json
  def new
    @want = Want.new

    respond_to do |format|
      format.html # new.html.erb
      format.json { render json: @want }
    end
  end

  # GET /wants/1/edit
  def edit
    @want = Want.find(params[:id])
  end

  # POST /wants
  # POST /wants.json
  def create
    @want = current_user.wants.create!
    @book = Book.create(:title => params[:title], :version => params[:version])
    @want.book = @book
    @want.save!
    @wants = current_user.wants.all
    respond_to do |format|
      if @want.save
        format.html { redirect_to @want, notice: 'Want was successfully created.' }
       # format.json { render json: @want, status: :created, location: @want }
       format.js 
      else
        format.html { render action: "new" }
        format.json { render json: @want.errors, status: :unprocessable_entity }
      end
    end
  end

  # PUT /wants/1
  # PUT /wants/1.json
  def update
    @want = Want.find(params[:id])

    respond_to do |format|
      if @want.update_attributes(params[:want])
        format.html { redirect_to @want, notice: 'Want was successfully updated.' }
        format.json { head :ok }
      else
        format.html { render action: "edit" }
        format.json { render json: @want.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /wants/1
  # DELETE /wants/1.json
  def destroy
    @want = Want.find(params[:id])
    @want.destroy

    respond_to do |format|
      format.html { redirect_to wants_url }
      format.json { head :ok }
    end
  end
end

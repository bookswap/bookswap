require 'spec_helper'

# This spec was generated by rspec-rails when you ran the scaffold generator.
# It demonstrates how one might use RSpec to specify the controller code that
# was generated by Rails when you ran the scaffold generator.
#
# It assumes that the implementation code is generated by the rails scaffold
# generator.  If you are using any extension libraries to generate different
# controller code, this generated spec may or may not pass.
#
# It only uses APIs available in rails and/or rspec-rails.  There are a number
# of tools you can use to make these specs even more expressive, but we're
# sticking to rails and rspec-rails APIs to keep things simple and stable.
#
# Compared to earlier versions of this generator, there is very limited use of
# stubs and message expectations in this spec.  Stubs are only used when there
# is no simpler way to get a handle on the object needed for the example.
# Message expectations are only used when there is no simpler way to specify
# that an instance is receiving a specific message.

describe WantsController do

  # This should return the minimal set of attributes required to create a valid
  # Want. As you add validations to Want, be sure to
  # update the return value of this method accordingly.
  def valid_attributes
    {}
  end

  describe "GET index" do
    it "assigns all wants as @wants" do
      want = Want.create! valid_attributes
      get :index
      assigns(:wants).should eq([want])
    end
  end

  describe "GET show" do
    it "assigns the requested want as @want" do
      want = Want.create! valid_attributes
      get :show, :id => want.id.to_s
      assigns(:want).should eq(want)
    end
  end

  describe "GET new" do
    it "assigns a new want as @want" do
      get :new
      assigns(:want).should be_a_new(Want)
    end
  end

  describe "GET edit" do
    it "assigns the requested want as @want" do
      want = Want.create! valid_attributes
      get :edit, :id => want.id.to_s
      assigns(:want).should eq(want)
    end
  end

  describe "POST create" do
    describe "with valid params" do
      it "creates a new Want" do
        expect {
          post :create, :want => valid_attributes
        }.to change(Want, :count).by(1)
      end

      it "assigns a newly created want as @want" do
        post :create, :want => valid_attributes
        assigns(:want).should be_a(Want)
        assigns(:want).should be_persisted
      end

      it "redirects to the created want" do
        post :create, :want => valid_attributes
        response.should redirect_to(Want.last)
      end
    end

    describe "with invalid params" do
      it "assigns a newly created but unsaved want as @want" do
        # Trigger the behavior that occurs when invalid params are submitted
        Want.any_instance.stub(:save).and_return(false)
        post :create, :want => {}
        assigns(:want).should be_a_new(Want)
      end

      it "re-renders the 'new' template" do
        # Trigger the behavior that occurs when invalid params are submitted
        Want.any_instance.stub(:save).and_return(false)
        post :create, :want => {}
        response.should render_template("new")
      end
    end
  end

  describe "PUT update" do
    describe "with valid params" do
      it "updates the requested want" do
        want = Want.create! valid_attributes
        # Assuming there are no other wants in the database, this
        # specifies that the Want created on the previous line
        # receives the :update_attributes message with whatever params are
        # submitted in the request.
        Want.any_instance.should_receive(:update_attributes).with({'these' => 'params'})
        put :update, :id => want.id, :want => {'these' => 'params'}
      end

      it "assigns the requested want as @want" do
        want = Want.create! valid_attributes
        put :update, :id => want.id, :want => valid_attributes
        assigns(:want).should eq(want)
      end

      it "redirects to the want" do
        want = Want.create! valid_attributes
        put :update, :id => want.id, :want => valid_attributes
        response.should redirect_to(want)
      end
    end

    describe "with invalid params" do
      it "assigns the want as @want" do
        want = Want.create! valid_attributes
        # Trigger the behavior that occurs when invalid params are submitted
        Want.any_instance.stub(:save).and_return(false)
        put :update, :id => want.id.to_s, :want => {}
        assigns(:want).should eq(want)
      end

      it "re-renders the 'edit' template" do
        want = Want.create! valid_attributes
        # Trigger the behavior that occurs when invalid params are submitted
        Want.any_instance.stub(:save).and_return(false)
        put :update, :id => want.id.to_s, :want => {}
        response.should render_template("edit")
      end
    end
  end

  describe "DELETE destroy" do
    it "destroys the requested want" do
      want = Want.create! valid_attributes
      expect {
        delete :destroy, :id => want.id.to_s
      }.to change(Want, :count).by(-1)
    end

    it "redirects to the wants list" do
      want = Want.create! valid_attributes
      delete :destroy, :id => want.id.to_s
      response.should redirect_to(wants_url)
    end
  end

end

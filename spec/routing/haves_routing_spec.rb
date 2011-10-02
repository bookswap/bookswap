require "spec_helper"

describe HavesController do
  describe "routing" do

    it "routes to #index" do
      get("/haves").should route_to("haves#index")
    end

    it "routes to #new" do
      get("/haves/new").should route_to("haves#new")
    end

    it "routes to #show" do
      get("/haves/1").should route_to("haves#show", :id => "1")
    end

    it "routes to #edit" do
      get("/haves/1/edit").should route_to("haves#edit", :id => "1")
    end

    it "routes to #create" do
      post("/haves").should route_to("haves#create")
    end

    it "routes to #update" do
      put("/haves/1").should route_to("haves#update", :id => "1")
    end

    it "routes to #destroy" do
      delete("/haves/1").should route_to("haves#destroy", :id => "1")
    end

  end
end

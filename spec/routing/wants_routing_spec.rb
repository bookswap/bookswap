require "spec_helper"

describe WantsController do
  describe "routing" do

    it "routes to #index" do
      get("/wants").should route_to("wants#index")
    end

    it "routes to #new" do
      get("/wants/new").should route_to("wants#new")
    end

    it "routes to #show" do
      get("/wants/1").should route_to("wants#show", :id => "1")
    end

    it "routes to #edit" do
      get("/wants/1/edit").should route_to("wants#edit", :id => "1")
    end

    it "routes to #create" do
      post("/wants").should route_to("wants#create")
    end

    it "routes to #update" do
      put("/wants/1").should route_to("wants#update", :id => "1")
    end

    it "routes to #destroy" do
      delete("/wants/1").should route_to("wants#destroy", :id => "1")
    end

  end
end

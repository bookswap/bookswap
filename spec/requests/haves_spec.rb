require 'spec_helper'

describe "Haves" do
  describe "GET /haves" do
    it "works! (now write some real specs)" do
      # Run the generator again with the --webrat flag if you want to use webrat methods/matchers
      get haves_path
      response.status.should be(200)
    end
  end
end

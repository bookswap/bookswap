class Match
  include Mongoid::Document
  has_one :user
  belongs_to :user
  has_one :book
end

class Want
  include Mongoid::Document
  include Mongoid::Timestamps

  belongs_to :user
  has_one :book
  accepts_nested_attributes_for :book, :allow_destroy => true
  
  def to_s
    if self.book
        self.book
    end
  end
  
end

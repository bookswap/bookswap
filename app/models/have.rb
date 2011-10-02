class Have
  include Mongoid::Document
  include Mongoid::Timestamps

  has_one :book
  belongs_to :user
  accepts_nested_attributes_for :book, :allow_destroy => true
  
  def to_s
    if self.book
      self.book.title
    end
  end
  
end

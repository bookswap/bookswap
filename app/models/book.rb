class Book
  include Mongoid::Document
  include Mongoid::Timestamps 
  field :version, :type => String
  field :ISBN, :type => Integer
  field :title, :type => String
  field :author, :type => String
  belongs_to :want
  belongs_to :have

  def to_s
    self.title
  end
end

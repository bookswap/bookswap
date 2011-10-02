class User
  include Mongoid::Document
  include Mongoid::Timestamps 
  field :provider, :type => String
  field :uid, :type => String
  field :name, :type => String
  field :email, :type => String
  has_many :haves
  has_many :wants

  attr_accessible :provider, :uid, :name, :email

  def to_s
    self.name
  end
  
  
    
  def match_have(book)
      Want.all.each do |want|
        if want.book.title.eql?(book.title)
          #execute match
           self.matches.create!(:user => want.user, :book => want.book)
        end
      end  
     
  end
  
  def match_want(book)
    Have.all.each do |have|
      if have.book.title.eql?(book.title)
        #execute match
        self.matches.create!(:user => have.user, :book => have.book)
      end
    end
  end
  
  def self.create_with_omniauth(auth)
    create! do |user|
      user.provider = auth['provider']
      user.uid = auth['uid']
      if auth['user_info']
        user.name = auth['user_info']['name'] if auth['user_info']['name'] # Twitter, Google, Yahoo, GitHub
        user.email = auth['user_info']['email'] if auth['user_info']['email'] # Google, Yahoo, GitHub
      end
      if auth['extra'] && auth['extra']['user_hash']
        user.name = auth['extra']['user_hash']['name'] if auth['extra']['user_hash']['name'] # Facebook
        user.email = auth['extra']['user_hash']['email'] if auth['extra']['user_hash']['email'] # Facebook
      end
    end
  end

end


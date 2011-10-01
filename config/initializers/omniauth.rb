Rails.application.config.middleware.use OmniAuth::Builder do
  provider :facebook, '172660092815473', '8fbb3f7f863299399eaf60a0d222eab1',  {:scope => "publish_stream, user_education_history, user_likes, friends_likes, email, offline_access, manage_pages", :client_options => {:ssl => {:verify => false}}}
end

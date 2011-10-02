Rails.application.config.middleware.use OmniAuth::Builder do
  provider :facebook, '176683522412651', ' 251529384284f3ed476718174520e5be',  {:scope => "publish_stream, user_education_history, user_likes, friends_likes, email, offline_access, manage_pages"}
end

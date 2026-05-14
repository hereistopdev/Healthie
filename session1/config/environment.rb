require "bundler/setup"
Bundler.require(:default)

require "yaml"
require "logger"

db_config = YAML.load_file(File.join(__dir__, "database.yml"))
ActiveRecord::Base.establish_connection(db_config["development"])
ActiveRecord::Base.logger = Logger.new($stdout) if ENV["VERBOSE"]

Dir[File.join(__dir__, "..", "app", "models", "*.rb")].sort.each { |f| require f }

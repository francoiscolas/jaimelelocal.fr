require_relative 'boot'

require 'rails/all'

# Require the gems listed in Gemfile, including any gems
# you've limited to :test, :development, or :production.
Bundler.require(*Rails.groups)

module Jaimelelocal
  class Application < Rails::Application
    # Settings in config/environments/* take precedence over those specified here.
    # Application configuration should go into files in config/initializers
    # -- all .rb files in that directory are automatically loaded.

    # Set default language to french.
    config.i18n.default_locale = :fr

    # Include all helpers.
    config.action_controller.include_all_helpers = true

    # Time zone aware types.
    config.active_record.time_zone_aware_types = [:datetime, :time]

    # SQlite represent boolean column as integer (1 or 0) instead of 't' or 'f'.
    config.active_record.sqlite3.represent_boolean_as_integer = true
  end
end

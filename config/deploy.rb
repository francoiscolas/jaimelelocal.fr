require 'mina/git'
require 'mina/puma'
require 'mina/rails'
require 'mina/rbenv'

set :application_name, 'cestlocal'
set :user, 'joseph'
set :domain, 'jaimelelocal.fr'
set :deploy_to, '/var/www/cestlocal'
set :repository, 'francoiscolas@bitbucket.org:francoiscolas/cestlocal.git'
set :branch, 'master'
set :puma_config, "#{fetch(:current_path)}/config/puma.production.rb"

# Shared dirs and files will be symlinked into the app-folder by the 'deploy:link_shared_paths' step.
# Some plugins already add folders to shared_dirs like `mina/rails` add `public/assets`, `vendor/bundle` and many more
# run `mina -d` to see all folders and files already included in `shared_dirs` and `shared_files`
set :shared_dirs, fetch(:shared_dirs, []).push('public/system', 'log', 'tmp/pids', 'tmp/sockets')
# set :shared_files, fetch(:shared_files, []).push('config/database.yml', 'config/secrets.yml')

task :remote_environment do
  invoke :'rbenv:load'
end

task :setup do
end

desc "Deploys the current version to the server."
task :deploy do
  deploy do
    invoke :'git:clone'
    invoke :'deploy:link_shared_paths'
    invoke :'bundle:install'
    invoke :'rails:db_migrate'
    invoke :'rails:assets_precompile'
    invoke :'deploy:cleanup'
    on :launch do
      in_path(fetch(:current_path)) do
        command %{mkdir -p tmp/}
        command %{touch tmp/restart.txt}
      end
      invoke :'puma:restart'
    end
  end
end

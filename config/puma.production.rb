shared_dir = "#{File.expand_path("../..", __FILE__)}"

# How many workers and threads ?
workers ENV.fetch("WEB_CONCURRENCY") { 2 }.to_i
threads 1, ENV.fetch("RAILS_MAX_THREADS") { 5 }.to_i

# Set up socket location
bind "unix://#{shared_dir}/tmp/sockets/puma.sock"

# Logging
stdout_redirect "#{shared_dir}/log/puma.stdout.log", "#{shared_dir}/log/puma.stderr.log", true

# Set master PID and state locations
pidfile "#{shared_dir}/tmp/pids/puma.pid"
state_path "#{shared_dir}/tmp/sockets/puma.state"
activate_control_app "unix://#{shared_dir}/tmp/sockets/pumactl.sock"

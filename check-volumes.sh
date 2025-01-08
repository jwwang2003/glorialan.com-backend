#!/usr/bin/env bash
#
# check-volumes.sh
#
# This script checks if the directories used by the "local bind" volumes in
# your docker-compose configuration exist on the host machine, under a
# base root directory (e.g., ./docker_data).

# BASE_ROOT="./docker_data"

# List of folder paths relative to BASE_ROOT
folders=(
  "./docker/html"
  "./docker/nginx"
  "./docker_data/ssl"
  "./docker_data/db"
  "./docker_data/redis_cache"
  # "certbot/www"
  # "letsencrypt"
)

echo "Checking required folders for NGINX & SSL docker-compose volumes..."
for folder in "${folders[@]}"; do
  # full_path="$BASE_ROOT/$folder"
  full_path="$folder"
  if [ -d "$full_path" ]; then
    echo "✔  Directory '$full_path' exists."
  else
    echo "✘  Directory '$full_path' does not exist."
    # Uncomment the next line if you want to create missing folders automatically
    mkdir -p "$full_path" && echo "    Created directory '$full_path'."s
  fi
done

echo "Done."
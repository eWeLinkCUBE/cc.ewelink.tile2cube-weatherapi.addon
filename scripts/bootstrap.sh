#!/bin/bash

npm install

# Config server
SERVER_DATA_PATH=$(pwd)/packages/server/data
mkdir -p $SERVER_DATA_PATH
cat << EOF > ./packages/server/.env
LOG_LEVEL=debug
EOF

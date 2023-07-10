#!/bin/bash

npm install

# Config server
SERVER_DATA_PATH=$(pwd)/packages/server/data
mkdir -p $SERVER_DATA_PATH
cat << EOF > ./packages/server/.env
LOG_LEVEL=debug
CONFIG_DATA_PATH=$SERVER_DATA_PATH
CONFIG_CUBE_HOST=ihost.local
APP_NAME="tile2cube-weatherapi"
ENABLE_PRINT_BUILDINFO=0
TEST_WEATHER_API_KEY=123456
EOF

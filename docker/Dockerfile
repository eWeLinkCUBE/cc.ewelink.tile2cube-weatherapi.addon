FROM node:16.20.0-alpine

ENV ENABLE_PRINT_BUILDINFO=1 \
    CONFIG_CUBE_HOST=ihost \
    CONFIG_DATA_PATH=/data \
    LOG_LEVEL=info \
    APP_NAME="tile2cube-weatherapi"

WORKDIR /workspace/ewelink-cube-weather-addon

COPY . .

CMD ["node", "server/index.js"]

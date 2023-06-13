FROM node:16.20.0-alpine

ENV ENABLE_MIDDLEWARE_LOG=1 \
    ENABLE_MIDDLEWARE_AUTH=1 \
    ENABLE_PRINT_BUILDINFO=1 \
    CONFIG_CUBE_HOSTNAME=ihost \
    LOG_LEVEL=info \
    APP_NAME="Weather Addon"

WORKDIR /workspace/ewelink-cube-weather-addon

COPY . .

CMD ["node", "server/index.js"]

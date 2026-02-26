# build stage

FROM node:alpine AS build

WORKDIR /app
COPY package*.json ./
RUN yarn install
COPY . .
RUN yarn build

# runtime stage
FROM nginx:1.29.4-alpine3.23-slim

RUN rm -rf /etc/nginx/conf.d/default.conf
COPY --from=build /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

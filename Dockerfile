# runtime stage
FROM nginx:1.29.4-alpine3.23-slim

RUN rm -rf /etc/nginx/conf.d/default.conf
COPY dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

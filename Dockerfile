FROM nginx:alpine

# Custom NGINX config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Assets to serve
COPY src/ /usr/share/nginx/html/

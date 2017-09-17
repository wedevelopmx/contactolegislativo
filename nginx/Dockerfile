FROM nginx
RUN apt-get update && apt-get -y install libcurl3 curl
COPY nginx.conf /etc/nginx/nginx.conf
RUN rm -rf /etc/nginx/conf.d/*
COPY services/* /etc/nginx/conf.d/
EXPOSE 80

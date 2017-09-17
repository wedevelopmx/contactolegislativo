# create a file named Dockerfile
FROM node:7-alpine

RUN apk add --no-cache make git && mkdir /portal
WORKDIR /portal

COPY package.json /portal
RUN npm install pm2 -g &&  npm install

COPY . /portal

EXPOSE 80

CMD ["pm2-docker", "process.json"]

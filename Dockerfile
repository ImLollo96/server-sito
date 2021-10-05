FROM node:16-alpine3.11 as builder
WORKDIR /usr/server
COPY ./ ./
RUN npm install

EXPOSE 5000

CMD [ "npm","start"]
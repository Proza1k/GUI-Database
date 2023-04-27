FROM node:latest
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install --force glob rimraf
RUN npm install --force
RUN mkdir ./dist
COPY ./dist ./dist

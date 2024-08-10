# Use the official Node.js image as the base image
FROM node:18-alpine

## Set the working directory
WORKDIR /usr/src/app

## Install app dependencies
COPY package.json ./

RUN npm install -g pnpm

## Install dependencies
RUN pnpm install

## Copy the rest of the application code
COPY ./ ./

## Build the application
RUN pnpm run build

## Expose the port the app runs on
EXPOSE 3000

RUN chmod +x init.script.sh

### Define the command to run the application
CMD [ "./init.script.sh"]

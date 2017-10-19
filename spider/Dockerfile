FROM node:boron

# Create app directory
WORKDIR /usr/src/app/spider

# Install app dependencies
COPY package.json .

RUN npm install

CMD [ "npm", "start" ]

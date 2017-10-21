FROM node:boron

# Create app directory
WORKDIR /usr/src/app/spider

# Install app dependencies
COPY package.json .

RUN npm install -g cnpm --registry=https://registry.npm.taobao.org \
    && cnpm install

CMD [ "npm", "start" ]

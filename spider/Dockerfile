FROM node:boron

# Create app directory
WORKDIR /usr/src/app/spider

COPY aliyun-sources.list /etc/apt/aliyun-sources.list

RUN cat /etc/apt/aliyun-sources.list > /etc/apt/sources.list

RUN apt-key adv --keyserver keyserver.ubuntu.com --recv-keys 40976EAF437D05B5
RUN apt-key adv --keyserver keyserver.ubuntu.com --recv-keys 3B4FE6ACC0B21F32

# Install app dependencies
COPY package.json .

RUN apt-get update \
    && npm install -g cnpm --registry=https://registry.npm.taobao.org \
    && cnpm install

CMD [ "npm", "start" ]

FROM node:boron

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package.json .

RUN echo "deb http://mirrors.aliyun.com/ubuntu/ xenial main restricted universe multiverse" > /etc/apt/sources.list
RUN echo "deb http://mirrors.aliyun.com/ubuntu/ xenial-security main restricted universe multiverse" > /etc/apt/sources.list
RUN echo "deb http://mirrors.aliyun.com/ubuntu/ xenial-updates main restricted universe multiverse" > /etc/apt/sources.list
RUN echo "deb http://mirrors.aliyun.com/ubuntu/ xenial-backports main restricted universe multiverse" > /etc/apt/sources.list
RUN echo "deb http://ppa.launchpad.net/jonathonf/tesseract/ubuntu trusty main" > /etc/apt/sources.list

RUN apt-key adv --keyserver keyserver.ubuntu.com --recv-keys 40976EAF437D05B5
RUN apt-key adv --keyserver keyserver.ubuntu.com --recv-keys 3B4FE6ACC0B21F32

ARG DEBIAN_FRONTEND=noninteractive
RUN apt-get update \
    && npm config set registry https://registry.npm.taobao.org \
    && npm install \
    && apt-get install -y tesseract-ocr \
    && apt-get install -y graphicsmagick \
    && apt-get install -y imagemagick

# Copy traineddata
COPY ./ocr/hpu.traineddata /usr/share/tesseract-ocr/tessdata

# Bundle app source
# COPY . .

EXPOSE 3000

CMD [ "npm", "start" ]

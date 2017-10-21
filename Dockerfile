FROM node:boron

# Create app directory
WORKDIR /usr/src/app

COPY aliyun-sources.list /etc/apt/aliyun-sources.list

RUN cat /etc/apt/aliyun-sources.list > /etc/apt/sources.list

RUN apt-key adv --keyserver keyserver.ubuntu.com --recv-keys 40976EAF437D05B5
RUN apt-key adv --keyserver keyserver.ubuntu.com --recv-keys 3B4FE6ACC0B21F32

# Install app dependencies
COPY package.json .

ARG DEBIAN_FRONTEND=noninteractive
RUN npm install -g cnpm --registry=https://registry.npm.taobao.org \
    && cnpm install \
    && apt-get update \
    && apt-get install -y apt-utils \
    && apt-get install -y tesseract-ocr \
    && apt-get install -y graphicsmagick \
    && apt-get install -y imagemagick

# Copy traineddata
COPY ./ocr/hpu.traineddata /usr/share/tesseract-ocr/tessdata

# Bundle app source
# COPY . .

EXPOSE 3000

CMD [ "npm", "start" ]

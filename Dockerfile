FROM node:boron

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package.json .

ARG DEBIAN_FRONTEND=noninteractive
RUN apt-get update \
    && apt-get install -y apt-utils \
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

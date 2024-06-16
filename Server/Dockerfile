FROM node:20.14.0-alpine3.20

WORKDIR /app

RUN apk update && apk add g++

RUN apk update && apk add openjdk11

RUN apk update && apk add python3

COPY package.json .

RUN npm install

COPY . .

EXPOSE 1234

# CMD [ "nodemon", "run", "dev" ]
CMD ["npx", "nodemon", "index"]




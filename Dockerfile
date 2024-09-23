FROM node:alpine AS build

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install

COPY . .

RUN npm run build

FROM node:alpine

WORKDIR /usr/src/app

RUN npm install http-server

COPY --from=build /usr/src/app/dist/btc-insights /usr/src/app/dist

EXPOSE 4200

CMD ["npx", "http-server", "dist", "-p", "4200"]
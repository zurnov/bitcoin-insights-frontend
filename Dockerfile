FROM node:alpine AS build

WORKDIR /usr/src/app

RUN npm install -g @angular/cli

COPY package*.json ./
RUN npm install

COPY . .

RUN ng build --configuration production

FROM node:alpine

WORKDIR /usr/src/app

RUN npm install -g http-server

COPY --from=build /usr/src/app/dist/btc-insights /usr/src/app/dist

EXPOSE 4200

CMD ["http-server", "dist", "-p", "4200"]

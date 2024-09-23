FROM node:alpine AS build

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install

COPY . .

RUN npm run build

FROM nginx:alpine

RUN rm /etc/nginx/conf.d/default.conf

COPY nginx.conf /etc/nginx/conf.d

COPY --from=build /usr/src/app/dist/btc-insights /usr/share/nginx/html

EXPOSE 4200

CMD ["nginx", "-g", "daemon off;"]
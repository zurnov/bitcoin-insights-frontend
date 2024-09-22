FROM node:alpine

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install -g @angular/cli
RUN npm install

COPY . .

CMD ["npm", "run", "build","0.0.0.0", "--disable-host-check"]

EXPOSE 4200

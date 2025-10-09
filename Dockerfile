FROM node:20
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install --production
COPY . .
RUN npm run build
EXPOSE 8383
CMD ["npm", "start"]
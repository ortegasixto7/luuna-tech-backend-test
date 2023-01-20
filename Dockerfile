FROM node:16-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build-prod
EXPOSE 8080
CMD [ "npm", "start" ]
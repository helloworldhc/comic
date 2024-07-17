FROM node:20-alpine
RUN npm install pm2 -g
WORKDIR /app
COPY . /app
RUN npm install
EXPOSE 3000
CMD [ "pm2-runtime", "pm2.config.js", "--env", "production" ]
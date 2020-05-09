FROM node:12-alpine
WORKDIR /app
COPY ./package.json ./
RUN npm install
COPY . .
RUN npm run build
RUN npm prune --production
CMD [ "npm", "start" ]
EXPOSE 3000
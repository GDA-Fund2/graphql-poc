FROM node:latest
ENV NODE_ENV=production

WORKDIR /graphql_server

COPY ["package.json", "package-lock.json*", "./"]

RUN npm install --production

COPY . .

EXPOSE 4000

CMD [ "npm", "start" ]

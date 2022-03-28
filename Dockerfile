FROM node:16 AS ui-build

WORKDIR /usr/server
COPY . .
RUN npm install

EXPOSE 8000

CMD [ "node", "index.js" ]
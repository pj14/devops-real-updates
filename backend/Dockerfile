
FROM node:18-alpine

WORKDIR /home/node/app

COPY package*.json ./

RUN npm install --unsafe-perm

COPY . .

RUN npm run build

RUN chown -R node:node /home/node/app/node_modules

USER node

EXPOSE 5001

CMD [ "node", "dist/app.js" ]

FROM node:17-alpine

COPY package.json ./

RUN npm install -g typescript
RUN yarn
COPY .. .
RUN tsc

CMD [ "node", "./build/index.js" ]

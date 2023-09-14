FROM node:18-alpine

WORKDIR /usr/app

COPY index.mjs .
COPY package.json .
COPY package-lock.json .
COPY /src ./src/

ENV PORT 5001
EXPOSE 5001

RUN npm install --production

ENTRYPOINT ["npm", "start"]